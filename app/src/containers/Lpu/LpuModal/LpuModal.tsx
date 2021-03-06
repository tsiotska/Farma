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
import { observable, computed, reaction, toJS } from 'mobx';
import { ILocation } from '../../../interfaces/ILocation';
import FormRow from '../../../components/FormRow';
// import { phoneValidator } from '../../../helpers/validators';

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
    types: string[];

    initialLpu?: ILPU;
    title: string;
    oblasti?: Map<number, ILocation>;
    loadSpecificCities?: (param: {
        oblastName?: string;
        regionId?: number;
    }) => Promise<ILocation[]>;
}

export interface ILpuModalValues {
    [key: string]: string | ILocation;

    name: string;
    oblast: ILocation;
    city: ILocation;
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
                 }
             }
         }) => ({
    oblasti,
    loadSpecificCities,
}))
@observer
class LpuModal extends Component<IProps> {
    readonly objectFields: Array<keyof ILpuModalValues> = ['oblast', 'city'];
    readonly optionalFields: Array<keyof ILpuModalValues> = ['phone1', 'phone2'];
    readonly errorMessages: { [key: string]: string } = {
        default: 'Значення має містити не менше 3 символів'
    };
    readonly initialValues: ILpuModalValues = {
        name: '',
        oblast: null,
        city: null,
        type: '',
        address: '',
        phone1: '',
        phone2: '',
    };

    @observable cities: ILocation[] = [];

    @observable errors: Map<keyof ILpuModalValues, boolean | string> = new Map();
    @observable formValues: ILpuModalValues = { ...this.initialValues };

    @computed
    get oblastListItems(): ILocation[] {
        const { oblasti } = this.props;
        return oblasti
            ? [...oblasti.values()]
            : [];
    }

    @computed
    get allProps(): string[] {
        return [...Object.keys(this.formValues)];
    }

    @computed
    get valuesChanged(): boolean {
        const { initialLpu } = this.props;

        if (!initialLpu) {
            return this.allProps.some(x => !!this.formValues[x]);
        }

        return this.allProps.some(x => {
            const initialValue = initialLpu[x];
            const currentValue = this.formValues[x];

            if (this.objectFields.includes(x)) {
                const actualValue = (currentValue && typeof currentValue === 'object')
                    ? currentValue.name
                    : null;
                return initialValue !== actualValue;
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

    // false -> is valid
    // true -> is invalid
    // string -> is invalid and string is error message to display
    valueValidator = (value: string, propName: keyof ILpuModalValues): string | boolean => {
        /* if (this.optionalFields.includes(propName)) {
             // phones are the only optional fields, so if they are empty, they are valid
             if (!value) return false;
             const isInvalid = !phoneValidator(value);
             return isInvalid && this.errorMessages[propName];
         } else if*/
        if (this.optionalFields.includes(propName)) {
            return;
        } else if (this.objectFields.includes(propName)) {
            return !value;
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
        if (this.objectFields.includes(propName)) {
            const id = value
                ? (value as any).id
                : null;

            if (propName === 'oblast') {
                const targetOblast = this.oblastListItems.find(x => x.id === id) || null;
                this.formValues[propName] = targetOblast;
                this.formValues.city = null;
                if (targetOblast) this.loadSpecificCities(targetOblast.name);
            } else if (propName === 'city') {
                this.formValues[propName] = this.cities.find(x => x.id === id) || null;
            }
        } else {
            this.formValues[propName] = value;
        }
        this.validate(propName, value);
    }

    submitHandler = () => this.props.onSubmit(this.formValues);

    loadSpecificCities = async (oblastName: string) => {
        const res = await this.props.loadSpecificCities({ oblastName });
        if (Array.isArray(res)) this.cities = res;
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
            oblast: null,
            city: null,
            type: type || '',
            address: address || '',
            phone1: phone1 || '',
            phone2: phone2 || '',
        };

        const targetOblast = this.oblastListItems.find(x => x.name.toLowerCase() === oblast);
        if (!targetOblast) return;

        this.formValues.oblast = targetOblast;
        await this.loadSpecificCities(targetOblast.name);

        this.formValues.city = this.cities.find(x => x.name.toLowerCase() === city) || null;
    }

    componentDidUpdate(prevProps: IProps) {
        const { open: wasOpen, initialLpu: prevInitial } = prevProps;
        const { open: isOpen, initialLpu } = this.props;

        const shouldSetInitial = !prevInitial && !!initialLpu;
        const becomeClosed = wasOpen && !open;

        if (isOpen && shouldSetInitial) this.initFromInitial();
        else if (becomeClosed) this.formValues = { ...this.initialValues };
    }

    async componentDidMount() {
        this.initFromInitial();
    }

    render() {
        const {
            open,
            onClose,
            title,
            classes,
            types
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
                        autoComplete
                        label='Область'
                        onChange={this.changeHandler}
                        propName='oblast'
                        renderPropName='name'
                        required
                        value={this.formValues.oblast}
                        options={!!this.oblastListItems ? this.oblastListItems : []}
                        error={this.errors.get('oblast')}/>
                    <FormRow
                        required
                        label='Адрес'
                        values={this.formValues}
                        onChange={this.changeHandler}
                        propName='address'
                        error={this.errors.get('address')}
                    />
                    <FormRow
                        autoComplete
                        required
                        disabled={!this.formValues.oblast}
                        label='Місто'
                        onChange={this.changeHandler}
                        propName='city'
                        renderPropName='name'
                        value={this.formValues.city}
                        options={!!this.cities ? this.cities : []}
                        error={this.errors.get('city')}/>
                    <FormRow
                        label='Телефон 1'
                        values={this.formValues}
                        onChange={this.changeHandler}
                        propName='phone1'
                        error={this.errors.get('phone1')}
                    />
                    <FormRow
                        select
                        required
                        disabled={!types.length}
                        label='Тип'
                        values={this.formValues}
                        onChange={this.changeHandler}
                        propName='type'
                        error={this.errors.get('type')}>
                        {
                            types.map(name => (
                                <MenuItem key={name} value={name}>
                                    {name}
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
