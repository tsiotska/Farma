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
import Dialog from '../../../components/Dialog';
import AvatarDropzone from '../../../components/AvatarDropzone';
import FormRow from '../../../components/FormRow';
import { IPosition } from '../../../interfaces/IPosition';
import { USER_ROLE } from '../../../constants/Roles';
import { observable, computed, toJS } from 'mobx';
import { phoneValidator, Validator, emailValidator, stringValidator, lengthValidator } from '../../../helpers/validators';
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
    onSubmit: (data: IWorkerModalValues, image: File) => void;
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
}

export interface IWorkerModalValues {
    [key: string]: string | number;
    name: string;
    workPhone: string;
    homePhone: string;
    card: string;
    position: USER_ROLE;
    email: string;
    password: string;
    city: string;
    region: number;
}

@inject(({
    appState: {
        departmentsStore: {
            loadSpecificCities,
            regions
        }
    }
}) => ({
    loadSpecificCities,
    regions
}))
@observer
class WorkerModal extends Component<IProps> {
    readonly regionRelatedFields: Array<keyof IWorkerModalValues> = ['city', 'region'];
    readonly validators: Partial<Record<keyof IWorkerModalValues, Validator>>;
    readonly dropzoneClasses: any;
    readonly errorMessages: { [key: string]: string } = {
        homePhone: 'Телефон має склададатись з 10 або 12 цифр',
        workPhone: 'Телефон має склададатись з 10 або 12 цифр',
        name: 'Значення має містити не менше 3 символів',
        password: 'Значення має містити не менше 3 символів',
    };
    readonly defaultValues: IWorkerModalValues = {
        name: '',
        workPhone: '',
        homePhone: '',
        card: '',
        position: USER_ROLE.UNKNOWN,
        email: '',
        password: '',
        city: '',
        region: 0,
    };

    @observable formValues: IWorkerModalValues = {...this.defaultValues};
    @observable errors: Map<keyof IWorkerModalValues, boolean | string> = new Map();
    @observable image: File | string = null;
    @observable cities: ILocation[] = [];

    constructor(props: IProps) {
        super(props);
        this.validators = {
            homePhone: phoneValidator,
            workPhone: phoneValidator,
            email: emailValidator,
            position: stringValidator,
            name: (value: string) => lengthValidator(3, value),
            password: (value: string) => lengthValidator(3, value),
            card: (value: string) => value && value.length === 16,
            city: stringValidator,
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
        const defaultValues: Array<keyof IWorkerModalValues> = ['homePhone', 'workPhone'];
        if (open && initialWorker) return [...defaultValues, 'password' ];
        return defaultValues;
    }

    @computed
    get valuesChanged(): boolean {
        const { initialWorker } = this.props;

        const valuesChanged = initialWorker
        ? this.allProps.some(x => {
            const initialValue = initialWorker[x];
            const currentValue = this.formValues[x];

            if (x === 'position') {
                return initialValue !== currentValue;
            } else if (x === 'region') {
                return (initialValue || 0) !== currentValue;
            }

            return (initialValue || '') !== currentValue;
        })
        : this.allProps.some(x => !!this.formValues[x]);

        const imageChanged = !!this.image && typeof this.image === 'object';

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
                const flag = valueExist
                    ? isValid
                    : isOptional;

                return allow && flag;
        }, this.valuesChanged);
    }

    @computed
    get regions(): ILocation[] {
        const { regions, open } = this.props;
        if (open === false) return [];
        const res: ILocation[] = [];

        regions.forEach(x => {
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
        if (propName === 'region') return !value;

        const validator = this.validators[propName] || stringValidator;
        const errorMessage = this.errorMessages[propName];

        const isValid = this.optionalValues.includes(propName)
            ? !value || validator(value)
            : !!value && validator(value);

        return isValid
            ? false
            : (errorMessage || true);
    }

    changeHandler = (propName: keyof IWorkerModalValues, value: string) => {
        if (propName === 'position') {
            const converted = +value;
            this.formValues[propName] = converted;
        } else if (propName === 'region') {
            this.formValues[propName] = +value || 0;
            this.formValues.city = '';
            this.loadSpecificCities();
        } else {
            this.formValues[propName] = value;
        }
        const hasError = this.valueValidator(propName, value);
        this.errors.set(propName, hasError);
    }

    submitHandler = () => {
        const { onSubmit, isLoading } = this.props;
        if (isLoading) return;
        console.log('image: ', toJS(this.image));
        onSubmit(
            this.formValues,
            typeof this.image === 'string'
            ? null
            : this.image
        );
    }

    appendFileHandler = (image: File) => {
        this.image = image;
    }

    removeFileHandler = () => {
        this.image = null;
    }

    componentDidUpdate(prevProps: IProps) {
        const { open: wasOpen } = prevProps;
        const { open, initialWorker } = this.props;
        const becomeOpened = wasOpen === false && open === true;
        const becomeClosed = wasOpen === true && open === false;

        if (becomeClosed) {
            this.formValues = {...this.defaultValues};
            this.image = null;
        } else if (becomeOpened && !!initialWorker) {
            this.initValuesFromInitialWorker();
        }

        if (this.requireRegion === false && !!this.formValues.region) {
            this.formValues.region = this.defaultValues.region;
        }
        if (this.requireCity === false && !!this.formValues.city) {
            this.formValues.city = this.defaultValues.city;
        }
        const shouldInitLocationsBlock = !!initialWorker
            && (this.requireRegion === true && !this.formValues.region)
            || (this.requireCity === true && !this.formValues.city);
        if (shouldInitLocationsBlock) this.initLocationsBlock();
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
                avatar
        }} = this.props;

        this.formValues = {
            name: name || this.defaultValues.name,
            workPhone: workPhone || this.defaultValues.workPhone,
            homePhone: mobilePhone || this.defaultValues.homePhone,
            card: card || this.defaultValues.card,
            position: position || this.defaultValues.position,
            email: email || this.defaultValues.email,

            password: this.defaultValues.password,
            city: this.defaultValues.city,
            region: this.defaultValues.region,
        };

        if (avatar) this.image = avatar;

        if (!showLocationsBlock) return;

        this.initLocationsBlock();
    }

    initLocationsBlock = async () => {
        const { initialWorker: { city, region } } = this.props;
        this.formValues.region = region || this.defaultValues.region;
        await this.loadSpecificCities();
        if (!city) return;
        const targetCity = this.cities.find(({ id }) => id === city);
        if (!targetCity) return;
        this.formValues.city = targetCity.name;
    }

    render() {
        const {
            initialWorker,
            isLoading,
            open,
            onClose,
            title,
            classes,
            positions,
            regions,
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
                            <Grid justify='space-between'  container>
                                <FormRow
                                    required
                                    label='Назва'
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
                                    required
                                    label='Банківська картка'
                                    values={this.formValues}
                                    onChange={this.changeHandler}
                                    propName='card'
                                    error={this.errors.get('card')}
                                />
                                <FormRow
                                    label='Домашній телефон'
                                    values={this.formValues}
                                    onChange={this.changeHandler}
                                    propName='homePhone'
                                    error={this.errors.get('homePhone')}
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
                                        <MenuItem value={USER_ROLE.UNKNOWN} className={classes.menuItem} />
                                        {
                                            positions.map(({ id, alias }) => (
                                                <MenuItem
                                                    key={id}
                                                    value={`${id}`}
                                                    className={classes.menuItem}>
                                                    { alias }
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
                                                this.regions.length && regions.has(this.formValues.region)
                                                ? regions.get(this.formValues.region).id
                                                : ''
                                            }
                                            onChange={this.changeHandler}
                                            error={this.errors.get('region')}
                                            propName='region'>
                                                {
                                                    this.regions.map(({ id, name }) => (
                                                        <MenuItem key={id} value={id}>
                                                            { name }
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
                                            propName='city'>
                                                {
                                                    this.cities.map(({ id, name }) => (
                                                        <MenuItem key={id} value={name}>
                                                            { name }
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
                                    label='email'
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
                                    password
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
                            ? <LoadingMask size={20} />
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
