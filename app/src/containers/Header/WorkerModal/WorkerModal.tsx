import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    Grid,
    MenuItem,
    Typography,
    Button
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { observable, computed, toJS } from 'mobx';

import Dialog from '../../../components/Dialog';
import AvatarDropzone from '../../../components/AvatarDropzone';
import FormRow from '../../../components/FormRow';
import { IPosition } from '../../../interfaces/IPosition';
import { USER_ROLE } from '../../../constants/Roles';
import {
    phoneValidator,
    Validator,
    emailValidator,
    stringValidator,
    lengthValidator
} from '../../../helpers/validators';
import { IUser } from '../../../interfaces';
import LoadingMask from '../../../components/LoadingMask';
import { IWorker } from '../../../interfaces/IWorker';
import { ILocation } from '../../../interfaces/ILocation';

const styles = (theme: any) => createStyles({
    modalContent: {
        flexDirection: 'column'
    },
    dropzone: {
        alignItems: 'center',
        minWidth: 130,
        marginRight: 12
    },
    dropzoneButton: {
        width: '100%'
    },
    menuItem: {
        height: 36
    },
    subheader: {
        width: '100%',
        marginBottom: 12
    },
    submitButton: {
        marginLeft: 'auto',
        minWidth: 160
    }
});

interface IProps extends WithStyles<typeof styles> {
    open: boolean;
    onSubmit: (data: IWorkerModalValues, image: File | string) => void;
    onClose: () => void;
    isLoading: boolean;
    title: string;
    positions: IPosition[];
    showLocationsBlock?: boolean;
    initialWorker?: IWorker;
    loadSpecificCities?: (param: {
        oblastName?: string;
        regionId?: number;
    }) => Promise<ILocation[]>;
    regions?: Map<number, ILocation>;
    loadRMRegions?: () => Map<number, ILocation>;
}

export interface IWorkerModalValues {
    [key: string]: string | number;

    name: string;
    workPhone: string;
    mobilePhone: string;
    card: string;
    position: USER_ROLE;
    email: string;
    password: string;
    city: number;
    region: number;
}

@inject(({
             appState: {
                 departmentsStore: {
                     loadSpecificCities,
                     regions,
                     loadRMRegions
                 }
             }
         }) => ({
    loadSpecificCities,
    regions,
    loadRMRegions
}))
@observer
class WorkerModal extends Component<IProps> {
    readonly regionRelatedFields: Array<keyof IWorkerModalValues> = ['city', 'region'];
    readonly validators: Partial<Record<keyof IWorkerModalValues, Validator>>;
    readonly dropzoneClasses: any;
    readonly errorMessages: { [key: string]: string } = {
        mobilePhone: 'Телефон має склададатись з 10 або 12 цифр',
        workPhone: 'Телефон має склададатись з 10 або 12 цифр',
        name: 'Значення має містити не менше 3 символів',
        password: 'Значення має містити не менше 3 символів',
        card: 'Значення має складатись з 16 символів'
    };
    readonly defaultValues: IWorkerModalValues = {
        name: '',
        workPhone: '',
        mobilePhone: '',
        card: '',
        position: USER_ROLE.UNKNOWN,
        email: '',
        password: '',
        city: 0,
        region: 0,
    };

    @observable regionsList: Map<number, ILocation> = new Map();
    @observable formValues: IWorkerModalValues = { ...this.defaultValues };
    @observable errors: Map<keyof IWorkerModalValues, boolean | string> = new Map();
    @observable image: File | string = null;
    @observable cities: ILocation[] = [];

    constructor(props: IProps) {
        super(props);
        this.validators = {
            mobilePhone: phoneValidator,
            workPhone: phoneValidator,
            email: emailValidator,
            position: stringValidator,
            name: (value: string) => lengthValidator(3, value),
            password: (value: string) => lengthValidator(3, value),
            card: (value: string) => value && value.length === 16,
        };
        const { classes } = props;
        this.dropzoneClasses = {
            container: classes.dropzone,
            removePhotoButton: classes.dropzoneButton,
            addPhotoButton: classes.dropzoneButton,
        };
    }

    @computed
    get allProps(): string[] {
        return [...Object.keys(this.defaultValues)];
    }

    @computed
    get optionalValues(): Array<keyof IWorkerModalValues> {
        const { open, initialWorker } = this.props;
        const defaultValues: Array<keyof IWorkerModalValues> = ['mobilePhone', 'workPhone', 'card'];
        if (open && initialWorker) return [...defaultValues, 'password'];
        return defaultValues;
    }

    @computed
    get valuesChanged(): boolean {
        const { initialWorker } = this.props;

        const valuesChanged = initialWorker
            ? this.allProps.some(x => {
                const initialValue = initialWorker[x];
                const currentValue = this.formValues[x];

                if (this.regionRelatedFields.includes(x)) {
                    return (initialValue || 0) !== currentValue;
                } else if (x === 'position') {
                    return initialValue !== currentValue;
                }

                return (initialValue || '') !== currentValue;
            })
            : this.allProps.some(x => !!this.formValues[x]);

        const imageChanged = initialWorker
            ? this.image !== initialWorker.image
            : !!this.image;

        return valuesChanged || imageChanged;
    }

    @computed
    get allowSubmit(): boolean {
        return this.allProps.reduce(
            (allow: boolean, propName: keyof IWorkerModalValues) => {
                const shouldSkip = (propName === 'city' && this.requireCity === false)
                    || (propName === 'region' && this.requireRegion === false);
                if (shouldSkip) return allow;

                const isOptional = this.optionalValues.includes(propName);
                const isValid = !this.errors.get(propName);
                const valueExist = !!this.formValues[propName];

                const isOk = valueExist
                    ? isValid
                    : isOptional;

                return allow && isOk;
            }, this.valuesChanged);
    }

    @computed
    get regions(): ILocation[] {
        const { open } = this.props;
        if (open === false) return [];
        const res: ILocation[] = [];
        this.regionsList.forEach(x => {
            res.push(x);
        });
        return res;
    }

    @computed
    get requireCity(): boolean {
        const { position } = this.formValues;
        return position === USER_ROLE.MEDICAL_AGENT;
    }

    @computed
    get requireRegion(): boolean {
        const { position } = this.formValues;
        return position === USER_ROLE.MEDICAL_AGENT || position === USER_ROLE.REGIONAL_MANAGER;
    }

    loadSpecificCities = async () => {
        const { loadSpecificCities } = this.props;
        const { region } = this.formValues;

        if (!region) return;
        this.cities = await loadSpecificCities({ regionId: region }) || [];
    }

    valueValidator = (propName: keyof IWorkerModalValues, value: string): string | boolean => {
        if (this.regionRelatedFields.includes(propName)) return !value;

        const validator = this.validators[propName] || stringValidator;
        const errorMessage = this.errorMessages[propName];

        const isValid = this.optionalValues.includes(propName)
            ? !value || validator(value)
            : !!value && validator(value);

        return isValid
            ? false
            : (errorMessage || true);
    }

    positionChangeCallback = async (position: number) => {
        const { regions, loadRMRegions } = this.props;
        if (position === USER_ROLE.REGIONAL_MANAGER) {
            this.regionsList = await loadRMRegions();
            this.insertBookedRegion();
        } else {
            this.regionsList = regions;
        }
        const { initialWorker } = this.props;
        if (!initialWorker) return;
        const { initialWorker: { city, region } } = this.props;
        if (this.requireRegion === true && !this.formValues.region) {
            this.formValues.region = region || this.defaultValues.region;
            await this.loadSpecificCities();
        }
        if (this.requireCity === true && !this.formValues.city) {
            this.formValues.city = city || this.defaultValues.city;
        }
    }

    changeHandler = async (propName: keyof IWorkerModalValues, value: string) => {
        if (propName === 'position') {
            const converted = +value;
            if (converted !== this.formValues[propName]) {
                this.formValues[propName] = converted;
                this.positionChangeCallback(converted);
            }
        } else if (propName === 'region') {
            this.formValues[propName] = +value || 0;
            this.formValues.city = this.defaultValues.city;
            this.loadSpecificCities();
        } else if (propName === 'city') {
            this.formValues[propName] = +value || 0;
        } else {
            this.formValues[propName] = value;
        }
        const hasError = this.valueValidator(propName, value);
        this.errors.set(propName, hasError);
    }

    submitHandler = () => {
        const { onSubmit, isLoading } = this.props;
        if (isLoading) return;
        onSubmit(
            this.formValues,
            this.image
            // typeof this.image === 'string'
            // ? null
            // : this.image
        );
    }

    appendFileHandler = (image: File) => {
        this.image = image;
    }

    removeFileHandler = () => {
        this.image = null;
    }

    insertBookedRegion = () => {
        const { regions } = this.props;
        if (!this.regionsList.has(this.formValues.region)) {
            const currentRegion = regions.get(this.formValues.region);
            this.regionsList.set(currentRegion.id, currentRegion);
        }
    }

    async componentDidUpdate(prevProps: IProps) {
        const { open: wasOpen } = prevProps;
        const { open, initialWorker, positions, loadRMRegions, regions } = this.props;
        const becomeOpened = wasOpen === false && open === true;
        const becomeClosed = wasOpen === true && open === false;

        if (becomeClosed) {
            this.formValues = { ...this.defaultValues };
            this.image = null;
        } else if (becomeOpened) {
            this.formValues.position = positions[0].id;
            this.regionsList = await loadRMRegions();

            if (!!initialWorker) {
                this.initValuesFromInitialWorker();
                if (this.formValues.position === USER_ROLE.REGIONAL_MANAGER) {
                    this.regionsList = await loadRMRegions();
                    this.insertBookedRegion();
                } else {
                    this.regionsList = regions;
                }
                this.insertBookedRegion();
            }
        }
        if (this.requireRegion === false && !!this.formValues.region) {
            this.formValues.region = this.defaultValues.region;
        }
        if (this.requireCity === false && !!this.formValues.city) {
            this.formValues.city = this.defaultValues.city;
        }
    }

    initValuesFromInitialWorker = () => {
        const {
            showLocationsBlock,
            initialWorker: {
                name,
                workPhone,
                mobilePhone,
                card,
                position,
                email,
                image
            }
        } = this.props;

        this.formValues = {
            name: name || this.defaultValues.name,
            workPhone: workPhone || this.defaultValues.workPhone,
            mobilePhone: mobilePhone || this.defaultValues.mobilePhone,
            card: card || this.defaultValues.card,
            position: position || this.defaultValues.position,
            email: email || this.defaultValues.email,
            password: this.defaultValues.password,
            city: this.defaultValues.city,
            region: this.defaultValues.region,
        };

        if (image) this.image = image;

        if (!showLocationsBlock) return;

        this.initLocationsBlock();
    }

    initLocationsBlock = async () => {
        const { initialWorker: { city, region } } = this.props;
        this.formValues.region = region || this.defaultValues.region;
        await this.loadSpecificCities();
        this.formValues.city = city || this.defaultValues.city;
    }

    render() {
        const {
            open,
            title,
            onClose,
            classes,
            isLoading,
            positions,
            initialWorker,
            showLocationsBlock
        } = this.props;

        return (
            <Dialog
                classes={{ content: classes.modalContent }}
                open={open}
                onClose={onClose}
                title={title}
                maxWidth='md'>
                <Grid wrap='nowrap' container>
                    <AvatarDropzone
                        classes={this.dropzoneClasses}
                        appendFile={this.appendFileHandler}
                        removeIcon={this.removeFileHandler}
                        file={this.image}
                    />
                    <Grid container>
                        <Grid justify='space-between' container>
                            <FormRow
                                required
                                label='ПІБ'
                                propName='name'
                                values={this.formValues}
                                onChange={this.changeHandler}
                                error={this.errors.get('name')}
                            />
                            <FormRow
                                label='Робочий телефон'
                                values={this.formValues}
                                onChange={this.changeHandler}
                                propName='workPhone'
                                error={this.errors.get('workPhone')}
                            />
                            <FormRow
                                label='Банківська картка'
                                values={this.formValues}
                                onChange={this.changeHandler}
                                propName='card'
                                error={this.errors.get('card')}
                            />
                            <FormRow
                                label='Мобільний телефон'
                                values={this.formValues}
                                onChange={this.changeHandler}
                                propName='mobilePhone'
                                error={this.errors.get('mobilePhone')}
                            />
                            <FormRow
                                required
                                select
                                label='Посада'
                                values={this.formValues}
                                value={
                                    positions.length
                                        ? this.formValues.position
                                        : USER_ROLE.UNKNOWN
                                }
                                onChange={this.changeHandler}
                                error={this.errors.get('position')}
                                propName='position'>
                                {/* <MenuItem value={USER_ROLE.UNKNOWN} className={classes.menuItem} /> */}
                                {
                                    positions.map(({ id, alias }) => (
                                        <MenuItem
                                            key={id}
                                            value={`${id}`}
                                            className={classes.menuItem}>
                                            {alias}
                                        </MenuItem>
                                    ))
                                }
                            </FormRow>
                        </Grid>
                        {
                            showLocationsBlock &&
                            <Grid justify='space-between' container>
                                <Typography className={classes.subheader}>
                                    Територія
                                </Typography>
                                {
                                    this.requireRegion &&
                                    <FormRow
                                        required
                                        select
                                        label='Регіон'
                                        values={this.formValues}
                                        value={
                                            this.regions.length && this.regionsList.has(this.formValues.region)
                                                ? this.regionsList.get(this.formValues.region).id
                                                : ''
                                        }
                                        onChange={this.changeHandler}
                                        error={this.errors.get('region')}
                                        propName='region'>
                                        {
                                            this.regions.map(({ id, name }) => (
                                                <MenuItem key={id} value={id}>
                                                    {name}
                                                </MenuItem>
                                            ))
                                        }
                                    </FormRow>
                                }
                                {
                                    this.requireCity &&
                                    <FormRow
                                        required
                                        select
                                        label='Місто'
                                        values={this.formValues}
                                        onChange={this.changeHandler}
                                        error={this.errors.get('city')}
                                        disabled={this.cities.length === 0}
                                        propName='city'>
                                        <MenuItem value={this.defaultValues.city} className={classes.menuItem}/>
                                        {
                                            this.cities.map(({ id, name }) => (
                                                <MenuItem key={id} value={id}>
                                                    {name}
                                                </MenuItem>
                                            ))
                                        }
                                    </FormRow>
                                }
                            </Grid>
                        }
                        <Grid justify='space-between' container>
                            <Typography className={classes.subheader}>
                                Авторизація
                            </Typography>
                            <FormRow
                                required
                                label='Email'
                                values={this.formValues}
                                onChange={this.changeHandler}
                                propName='email'
                                error={this.errors.get('email')}
                            />
                            <FormRow
                                required={this.optionalValues.includes('password') === false}
                                label='Пароль'
                                values={this.formValues}
                                onChange={this.changeHandler}
                                propName='password'
                                error={this.errors.get('password')}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Button
                    color='primary'
                    variant='contained'
                    className={classes.submitButton}
                    onClick={this.submitHandler}
                    disabled={this.allowSubmit === false}>
                    {
                        isLoading
                            ? <LoadingMask size={20}/>
                            : initialWorker
                            ? 'Зберегти зміни'
                            : 'Додати користувача'
                    }
                </Button>
            </Dialog>
        );
    }
}

export default withStyles(styles)(WorkerModal);
