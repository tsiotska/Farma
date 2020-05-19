import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Button, MenuItem } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { observable, computed, reaction, when, toJS } from 'mobx';
import { ILocation } from '../../../interfaces/ILocation';
import { ILPU } from '../../../interfaces/ILPU';
import Dialog from '../../../components/Dialog';
import FormRow from '../../../components/FormRow';
import { phoneValidator } from '../../../helpers/validators';

const styles = (theme: any) => createStyles({
    submitButton: {
        marginLeft: 'auto',
    },
    header: {
        marginBottom: 10
    },
    menuItem: {
        minHeight: 36,
        textTransform: 'capitalize'
    }
});

interface IProps extends WithStyles<typeof styles> {
    open: boolean;
    isLoading: boolean;
    title: string;
    onClose: () => void;
    onSubmit: (values: IPharmacyModalValues) => void;
    types: string[];

    initialPharmacy?: ILPU;
    oblasti?: Map<number, ILocation>;
    loadSpecificCities?: (param: {
        oblastName?: string;
        regionId?: number;
    }) => Promise<ILocation[]>;
    loadSpecificLpus?: (cityId: number) => Promise<ILPU[]>;
}

export interface IPharmacyModalValues {
    name: string;
    oblast: string;
    city: ILocation;
    lpu: string | number; // hotfix
    address: string;
    phone1: string;
    phone2: string;
    type: string;
}

@inject(({
             appState: {
                 departmentsStore: {
                     oblasti,
                     loadSpecificCities,
                     loadSpecificLpus,
                 }
             }
         }) => ({
    oblasti,
    loadSpecificCities,
    loadSpecificLpus,
}))
@observer
class PharmacyModal extends Component<IProps> {
    readonly initialValues: IPharmacyModalValues = {
        name: '',
        oblast: '',
        lpu: '',
        city: null,
        type: '',
        address: '',
        phone1: '',
        phone2: '',
    };
    oblastReactionDisposer: any;
    cityReactionDisposer: any;

    @observable cities: ILocation[] = [];
    @observable lpus: ILPU[] = [];

    @observable errors: Map<keyof IPharmacyModalValues, boolean | string> = new Map();
    @observable optionalFields: Array<keyof IPharmacyModalValues> = ['lpu', 'phone1', 'phone2'];
    @observable formValues: IPharmacyModalValues = { ...this.initialValues };

    readonly errorMessages: { [key: string]: string } = {
        phone1: 'Телефон має скададатись з 10 або 12 цифр',
        phone2: 'Телефон має скададатись з 10 або 12 цифр',
        default: 'Значення має містити не менше 3 символів'
    };

    @computed
    get allProps(): Array<keyof IPharmacyModalValues> {
        return [...Object.keys(this.formValues)] as Array<keyof IPharmacyModalValues>;
    }

    @computed
    get valuesChanged(): boolean {
        const { initialPharmacy } = this.props;

        if (!initialPharmacy) {
            return this.allProps.some(x => !!this.formValues[x]);
        }

        return this.allProps.some(x => {
            const { [x as keyof IPharmacyModalValues]: initialValue } = initialPharmacy;
            const { [x as keyof IPharmacyModalValues]: currentValue } = this.formValues;

            if (x === 'city') {
                const cityName = currentValue
                    ? (currentValue as ILocation).name
                    : null;

                return initialValue !== cityName;
            }

            return (initialValue || '') !== currentValue;
        });
    }

    @computed
    get allowSubmit(): boolean {
        const requiredProps = this.allProps
            .filter((x) => (this.optionalFields as string[]).includes(x) === false);
        const hasRequiredProps = requiredProps.every(x => !!this.formValues[x]);
        const isAllPropsValid = this.allProps.every(x => !(this.errors as Map<string, any>).get(x));
        return hasRequiredProps && isAllPropsValid && this.valuesChanged;
    }

    @computed
    get oblastListItems(): string[] {
        const { oblasti } = this.props;
        return oblasti
            ? [...oblasti.values()].map(({ name }) => name.toLowerCase())
            : [];
    }

    submitHandler = () => {
        const { lpu, ...rest } = this.formValues;
        const targetLpu = this.lpus.find(({ name }) => name === lpu);
        const lpuId = targetLpu
            ? targetLpu.id
            : '';
        const convertedPharmacy = {
            ...rest,
            lpu: lpuId
        };
        this.props.onSubmit(convertedPharmacy);
    }

    validateValue = (propName: keyof IPharmacyModalValues, value: string) => {
        if (this.optionalFields.includes(propName)) {
            if (!value) return false;

            const isInvalid = propName === 'lpu'
                ? !value || value.length < 3
                : !phoneValidator(value);

            return isInvalid && this.errorMessages[propName];
        } else {
            const isInvalid = !value || value.length < 3;
            return isInvalid && this.errorMessages.default;
        }
    }

    changeHandler = (propName: keyof IPharmacyModalValues, value: string) => {
        if (propName === 'city') {
            const cityId = +value;
            const targetCity = this.cities.find(({ id }) => id === cityId);
            this.formValues.city = targetCity || null;
        } else {
            this.formValues[propName] = value;
            const hasError = this.validateValue(propName, value);
            this.errors.set(propName, hasError);
        }
    }

    loadSpecificCities = async (oblastName: string) => {
        const res = await this.props.loadSpecificCities({ oblastName });
        if (Array.isArray(res)) this.cities = res;
    }

    loadSpecificLpus = async (cityId: number) => {
        this.lpus = await this.props.loadSpecificLpus(cityId);
    }

    initFromInitial = async () => {
        const { initialPharmacy } = this.props;

        if (!initialPharmacy) return;

        const {
            name,
            oblast,
            lpuName,
            city,
            type,
            address,
            phone1,
            phone2,
        } = initialPharmacy;

        this.formValues = {
            name: name || '',
            oblast: oblast || '',
            lpu: '',
            city: null,
            type: type || '',
            address: address || '',
            phone1: phone1 || '',
            phone2: phone2 || '',
        };

        if (city) {
            await when(() => !!this.cities.length);
            const targetCity = this.cities.find(x => x.name.toLowerCase() === city);
            if (targetCity) this.formValues.city = this.formValues.city = targetCity;
        }

        if (lpuName) {
            await when(() => !!this.lpus.length);
            const targetLpu = this.lpus.find(x => x.name.toLowerCase() === lpuName);
            if (targetLpu) this.formValues.lpu = lpuName;
        }
    }

    async componentDidMount() {
        this.oblastReactionDisposer = reaction(
            () => this.formValues.oblast,
            async (oblastName: string) => {
                this.formValues.city = null;
                this.cities = [];
                this.loadSpecificCities(oblastName);
            }
        );
        this.cityReactionDisposer = reaction(
            () => this.formValues.city,
            (selectedCity: ILocation) => {
                this.formValues.lpu = '';
                if (selectedCity) {
                    this.lpus = [];
                    this.loadSpecificLpus(selectedCity.id);
                }
            }
        );
    }

    componentDidUpdate(prevProps: IProps) {
        const { open: wasOpen, initialPharmacy: prevInitial } = prevProps;
        const { open, initialPharmacy } = this.props;

        const shouldSetInititial = !prevInitial && !!initialPharmacy;
        const becomeClosed = wasOpen && !open;

        if (open && shouldSetInititial) this.initFromInitial();
        else if (becomeClosed) this.formValues = { ...this.initialValues };
    }

    componentWillUnmount() {
        this.cityReactionDisposer();
        this.oblastReactionDisposer();
    }

    render() {
        const {
            open,
            onClose,
            title,
            classes,
            oblasti,
            types
        } = this.props;

        return (
            <>
                <Dialog
                    classes={{ title: classes.header }}
                    open={open}
                    onClose={onClose}
                    title={title}
                    fullWidth
                    maxWidth='sm'>
                    <FormRow
                        label='Назва'
                        values={this.formValues}
                        onChange={this.changeHandler}
                        propName='name'
                        error={this.errors.get('name')}
                        required
                    />
                    <Grid justify='space-between' container>
                        <FormRow
                            autoComplete
                            label='Область'
                            onChange={this.changeHandler}
                            propName='oblast'
                            renderPropName='name'
                            disabled={this.oblastListItems.length === 0}
                            required
                            options={!!this.oblastListItems ? this.oblastListItems.map((oblast, id) =>
                                ({ id, name: oblast })) : []}
                            error={this.errors.get('oblast')}/>
                        <FormRow
                            label='Адрес'
                            values={this.formValues}
                            onChange={this.changeHandler}
                            propName='address'
                            error={this.errors.get('address')}
                            required
                        />
                        <FormRow
                            autoComplete
                            label='Місто'
                            onChange={this.changeHandler}
                            propName='city'
                            renderPropName='name'
                            disabled={this.formValues.oblast === '' || !this.cities.length}
                            required
                            options={!!this.cities ? this.cities.map((city, id) =>
                                ({ id, name: city })) : []}
                            error={this.errors.get('city')}/>
                        <FormRow
                            label='Телефон 1'
                            values={this.formValues}
                            onChange={this.changeHandler}
                            propName='phone1'
                            error={this.errors.get('phone1')}
                        />
                        <FormRow
                            autoComplete
                            label='ЛПУ'
                            onChange={this.changeHandler}
                            propName='lpu'
                            renderPropName='name'
                            options={!!this.lpus ? this.lpus.map((lpu, id) =>
                                ({ id, name: lpu })) : []}
                            disabled={!this.formValues.city || !this.lpus.length}
                            error={this.errors.get('lpu')}/>
                        <FormRow
                            label='Телефон 2'
                            values={this.formValues}
                            onChange={this.changeHandler}
                            propName='phone2'
                            error={this.errors.get('phone2')}
                        />
                        <FormRow
                            select
                            label='Тип'
                            values={this.formValues}
                            onChange={this.changeHandler}
                            propName='type'
                            disabled={!types.length}
                            required
                            error={this.errors.get('type')}>
                            {
                                types.map(x => (
                                    <MenuItem className={classes.menuItem} key={x} value={x}>
                                        {x}
                                    </MenuItem>
                                ))
                            }
                        </FormRow>
                    </Grid>
                    <Button
                        variant='contained'
                        color='primary'
                        className={classes.submitButton}
                        onClick={this.submitHandler}
                        disabled={!this.allowSubmit}>
                        Зберегти
                    </Button>
                </Dialog>
            </>
        );
    }
}

export default withStyles(styles)(PharmacyModal);
