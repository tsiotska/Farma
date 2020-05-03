
import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    Grid,
    MenuItem,
    Button
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { ILPU } from '../../../interfaces/ILPU';
import Dialog from '../../../components/Dialog';
import { observable, computed, reaction } from 'mobx';
import { ILocation } from '../../../interfaces/ILocation';
import FormRow from '../../../components/FormRow';
import { phoneValidator } from '../../../helpers/validators';

const styles = (theme: any) => createStyles({
    submitButton: {
        marginLeft: 'auto',
    },
    header: {
        marginBottom: 10
    }
});

interface IProps extends WithStyles<typeof styles> {
    open: boolean;
    isLoading: boolean;
    onClose: () => void;
    onSubmit: (value: ILpuModalValues) => void;

    initialLpu?: ILPU;
    title: string;
    oblasti?: Map<number, ILocation>;
    loadSpecificCities?: (oblastName: string) => Promise<ILocation[]>;
    loadTypes?: (targetProp: string) => Promise<string[]>;
}

export interface ILpuModalValues {
    name: string;
    oblast: string;
    city: string;
    type: string;
    address: string;
    phone1: string;
    phone2: string;
}

@inject(({
    appState: {
        departmentsStore: {
            oblasti,
            loadSpecificCities,
            loadTypes,
        }
    }
}) => ({
    oblasti,
    loadSpecificCities,
    loadTypes,
}))
@observer
class LpuModal extends Component<IProps> {
    readonly optionalFields: Array<keyof ILpuModalValues> = [ 'phone1', 'phone2' ];
    readonly errorMessages: {[key: string]: string} = {
        phone1: 'Телефон має склададатись з 10 або 12 цифр',
        phone2: 'Телефон має склададатись з 10 або 12 цифр',
        default: 'Значення має містити не менше 3 символів'
    };

    reactionDisposer: any;
    @observable cities: ILocation[] = [];
    @observable types: string[] = [];

    @observable errors: Map<keyof ILpuModalValues, boolean | string> = new Map();
    @observable formValues: ILpuModalValues = {
        name: '',
        oblast: '',
        city: '',
        type: '',
        address: '',
        phone1: '',
        phone2: '',
    };

    @computed
    get oblastListItems(): string[] {
        const { oblasti } = this.props;
        const res: any = [];

        oblasti.forEach(({ name }) => {
            res.push(name);
        });

        return res;
    }

    @computed
    get allProps(): Array<keyof ILpuModalValues> {
        return [...Object.keys(this.formValues)] as Array<keyof ILpuModalValues>;
    }

    @computed
    get valuesChanged(): boolean {
        const { initialLpu } = this.props;

        if (!initialLpu) {
            return this.allProps.some(x => !this.formValues[x]);
        }

        return this.allProps.some(x => {
            const { [x as keyof ILpuModalValues]: initialValue } = initialLpu;
            const { [x as keyof ILpuModalValues]: currentValue } = this.formValues;
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

    // false -> is valid
    // true -> is invalid
    // string -> is invalid and string is error message to display
    valueValidator = (value: string, propName: keyof ILpuModalValues): string | boolean => {
        if (this.optionalFields.includes(propName)) {
            // phones are the only optional fields, so if they are empty, they are valid
            if (!value) return false;
            const isInvalid = !phoneValidator(value);
            return isInvalid && this.errorMessages[propName];
        } else {
            const isInvalid = !value || value.length < 3;
            return isInvalid && this.errorMessages.default;
        }
    }

    validate = (propName: keyof ILpuModalValues, value: string) => {
        const hasError = this.valueValidator(value, propName);
        this.errors.set(propName, hasError);
    }

    changeHandler = (propName: keyof ILpuModalValues, value: string) => {
        this.formValues[propName] = value;
        this.validate(propName, value);
    }

    submitHandler = () => this.props.onSubmit(this.formValues);

    loadSpecificCities = async (oblastName: string) => {
        this.cities = await this.props.loadSpecificCities(oblastName);
    }

    initFromInitial = async () => {
        const { initialLpu } = this.props;

        if (!initialLpu) return;

        const {
            name,
            oblast,
            city,
            type,
            address,
            phone1,
            phone2,
        } = initialLpu;

        this.formValues = {
            name: name || '',
            oblast: oblast || '',
            city: '',
            type: type || '',
            address: address || '',
            phone1: phone1 || '',
            phone2: phone2 || '',
        };

        await this.loadSpecificCities(oblast);

        this.formValues.city = city || '';
    }

    componentDidUpdate(prevProps: IProps) {
        const { initialLpu: prevInitial } = prevProps;
        const { open: isOpen, initialLpu } = this.props;

        const shouldSetInitial = !prevInitial && !!initialLpu;

        if (isOpen && shouldSetInitial) {
            this.initFromInitial();
        }
    }

    async componentDidMount() {
        const { loadTypes} = this.props;

        this.initFromInitial();

        this.reactionDisposer = reaction(
            () => this.formValues.oblast,
            async (oblastName: string) => {
                this.formValues.city = '';
                this.cities = [];
                this.loadSpecificCities(oblastName);
            }
        );

        this.types = await loadTypes('hcf');
    }

    componentWillUnmount() {
        this.reactionDisposer();
    }

    render() {
        const {
            open,
            onClose,
            title,
            classes
        } = this.props;

        return (
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
                            error={this.errors.get('oblast')}>
                                {
                                    this.oblastListItems.map(name => (
                                        <MenuItem key={name} value={name}>
                                            { name }
                                        </MenuItem>
                                    ))
                                }
                        </FormRow>
                        <FormRow
                            required
                            label='Адрес'
                            values={this.formValues}
                            onChange={this.changeHandler}
                            propName='address'
                            error={this.errors.get('address')}
                        />
                        <FormRow
                            select
                            required
                            disabled={!this.formValues.oblast}
                            label='Місто'
                            values={this.formValues}
                            onChange={this.changeHandler}
                            propName='city'
                            error={this.errors.get('city')}>
                                {
                                    this.cities.map(({ id, name }) => (
                                        <MenuItem key={id} value={name}>
                                            { name }
                                        </MenuItem>
                                    ))
                                }
                        </FormRow>
                        <FormRow
                            label='Основний телефон'
                            values={this.formValues}
                            onChange={this.changeHandler}
                            propName='phone1'
                            error={this.errors.get('phone1')}
                        />
                        <FormRow
                            select
                            required
                            disabled={!this.types.length}
                            label='Тип'
                            values={this.formValues}
                            onChange={this.changeHandler}
                            propName='type'
                            error={this.errors.get('type')}>
                                {
                                    this.types.map(name => (
                                        <MenuItem key={name} value={name}>
                                            { name }
                                        </MenuItem>
                                    ))
                                }
                        </FormRow>
                        <FormRow
                            label='Запасний телефон'
                            values={this.formValues}
                            onChange={this.changeHandler}
                            propName='phone2'
                            error={this.errors.get('phone2')}
                        />
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
        );
    }
}

export default withStyles(styles)(LpuModal);
