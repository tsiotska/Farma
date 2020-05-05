import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Button, MenuItem } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { observable, computed, reaction, when } from 'mobx';
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
        minHeight: 36
    }
});

interface IProps extends WithStyles<typeof styles> {
    open: boolean;
    isLoading: boolean;
    title: string;
    onClose: () => void;
    onSubmit: (values: IPharmacyModalValues) => void;

    initialPharmacy?: ILPU;
    oblasti?: Map<number, ILocation>;
    loadSpecificCities?: (param: {
        oblastName?: string;
        regionName?: string;
    }) => Promise<ILocation[]>;
    loadSpecificLpus?: (cityId: number) =>  Promise<ILPU[]>;
    loadTypes?: (targetProp: 'hcf' | 'pharmacy') => Promise<string[]>;
}

export interface IPharmacyModalValues {
    name: string;
    oblast: string;
    city: ILocation;
    lpu: string;
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
            loadTypes,
        }
    }
}) => ({
    oblasti,
    loadSpecificCities,
    loadSpecificLpus,
    loadTypes,
}))
@observer
class PharmacyModal extends Component<IProps> {
    oblastReactionDisposer: any;
    cityReactionDisposer: any;

    @observable cities: ILocation[] = [];
    @observable types: string[] = [];
    @observable lpus: ILPU[] = [];

    @observable errors: Map<keyof IPharmacyModalValues, boolean | string> = new Map();
    @observable optionalFields: Array<keyof IPharmacyModalValues> = [ 'lpu', 'phone1', 'phone2' ];
    @observable formValues: IPharmacyModalValues = {
        name: '',
        oblast: '',
        lpu: '',
        city: null,
        type: '',
        address: '',
        phone1: '',
        phone2: '',
    };

    readonly errorMessages: {[key: string]: string} = {
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
            return this.allProps.some(x => !this.formValues[x]);
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
        const res: any = [];

        oblasti.forEach(({ name }) => {
            res.push(name);
        });

        return res;
    }

    submitHandler = () => this.props.onSubmit(this.formValues);

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
        const res = await this.props.loadSpecificCities({oblastName});
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

        // if (oblast) await this.loadSpecificCities(oblast);
        if (city) {
            await when(() => !!this.cities.length);
            const targetCity = this.cities.find(x => x.name === city);
            if (targetCity) this.formValues.city = this.formValues.city = targetCity;
        }
        if (lpuName) {
            await when(() => !!this.lpus.length);
            const targetLpu = this.lpus.find(x => x.name === lpuName);
            if (targetLpu) this.formValues.lpu = lpuName;

        }
    }

    async componentDidMount() {
        const { loadTypes } = this.props;

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

        this.types = await loadTypes('pharmacy');
    }

    componentDidUpdate(prevProps: IProps) {
        const { initialPharmacy: prevInitial } = prevProps;
        const { open, initialPharmacy } = this.props;

        const shouldSetInititial = !prevInitial && !!initialPharmacy;

        if (open && shouldSetInititial) this.initFromInitial();
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
            oblasti
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
                            select
                            label='Область'
                            values={this.formValues}
                            onChange={this.changeHandler}
                            propName='oblast'
                            required
                            disabled={this.oblastListItems.length === 0}
                            error={this.errors.get('oblast')}>
                                {
                                    this.oblastListItems.map(name => (
                                        <MenuItem className={classes.menuItem} key={name} value={name}>
                                            { name }
                                        </MenuItem>
                                    ))
                                }
                        </FormRow>
                        <FormRow
                            label='Адрес'
                            values={this.formValues}
                            onChange={this.changeHandler}
                            propName='address'
                            error={this.errors.get('address')}
                            required
                        />
                        <FormRow
                            select
                            label='Місто'
                            values={this.formValues}
                            onChange={this.changeHandler}
                            propName='city'
                            disabled={this.formValues.oblast === '' || !this.cities.length}
                            value={
                                this.formValues.city
                                ? this.formValues.city.id
                                : ''
                            }
                            required
                            error={this.errors.get('city')}>
                                {
                                    this.cities.map(({ id, name }) => (
                                        <MenuItem className={classes.menuItem} key={id} value={id}>
                                            { name }
                                        </MenuItem>
                                    ))
                                }
                        </FormRow>
                        <FormRow
                            label='Телефон 1'
                            values={this.formValues}
                            onChange={this.changeHandler}
                            propName='phone1'
                            error={this.errors.get('phone1')}
                        />
                        <FormRow
                            select
                            label='ЛПУ'
                            values={this.formValues}
                            onChange={this.changeHandler}
                            propName='lpu'
                            disabled={!this.formValues.city || !this.lpus.length}
                            error={this.errors.get('lpu')}>
                                <MenuItem value='' className={classes.menuItem} />
                                {
                                    this.lpus.map(({ id, name }) => (
                                        <MenuItem className={classes.menuItem} key={id} value={name}>
                                            { name }
                                        </MenuItem>
                                    ))
                                }
                        </FormRow>
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
                            disabled={!this.types.length}
                            required
                            error={this.errors.get('type')}>
                                {
                                    this.types.map(x => (
                                        <MenuItem className={classes.menuItem} key={x} value={x}>
                                            { x }
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
