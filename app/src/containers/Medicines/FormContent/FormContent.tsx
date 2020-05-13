import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Button, MenuItem } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { observable, computed, toJS } from 'mobx';
import {
    Validator,
    stringValidator,
    moneyValidator,
    numberValidator,
    lengthValidator,
    onlyNumbersValidator
} from '../../../helpers/validators';
import LoadingMask from '../../../components/LoadingMask';
import { IMedicine } from '../../../interfaces/IMedicine';
import { IDepartment } from '../../../interfaces/IDepartment';
import FormRow from '../../../components/FormRow';
import isEqual from 'lodash/isEqual';

const styles = (theme: any) => createStyles({
    columnFirst: {
        [theme.breakpoints.up('sm')]: {
            marginRight: theme.spacing(2),
        }
    },
    fieldsContainer: {
        minWidth: 530,
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            minWidth: 300,
        }
    },
    submitButton: {
        margin: '8px 0 0 auto',
        padding: '4px 16px',
    },
    menuItem: {
        height: 36
    }
});

interface IProps extends WithStyles<typeof styles> {
    ref?: any;
    file: File | string;
    submitHandler: (data: any) => void;
    isLoading: boolean;
    departments?: IDepartment[];
    currentDepartment?: IDepartment;
}

interface IValidatorSettings {
    validator: Validator;
    text: string;
}

export interface IFormValues {
    name: string;
    releaseForm: string;
    dosage: string;
    manufacturer: string;
    barcode: string;
    mark: string;
    price: string;
    department: string;
}

@inject(({
    appState: {
        departmentsStore: {
            departments,
            currentDepartment
        }
    }
}) => ({
    departments,
    currentDepartment
}))
@observer
class FormContent extends Component<IProps> {
    @observable initialValue: IFormValues = {
        name: '',
        releaseForm: '',
        dosage: '',
        manufacturer: '',
        mark: '',
        price: '',
        barcode: '',
        department: '',
    };
    @observable formValues: IFormValues = {...this.initialValue};

    @observable fieldsErrorStatuses: Record<keyof IFormValues, boolean> = {
        name: false,
        releaseForm: false,
        dosage: false,
        manufacturer: false,
        mark: false,
        price: false,
        barcode: false,
        department: false
    };

    @computed
    get isValuesChanged(): boolean {
        const { file } = this.props;
        const isImageChanged = !!file && typeof file === 'object';
        return !isEqual(this.formValues, this.initialValue) || isImageChanged;
    }

    lengthValidator: Validator;
    barcodeLengthValidator: Validator;
    readonly validators: Record<keyof IFormValues, IValidatorSettings[]> = null;

    constructor(props: IProps) {
        super(props);
        this.lengthValidator = (value: string): boolean => {
            return !!value && value.length >= 3;
        };

        this.barcodeLengthValidator = (value: string): boolean => {
            return !!value && value.length === 13;
        };

        const stringValidators =  [{ validator: this.lengthValidator, text: 'Мінімальна довжина поля - 3 символи' }];
        const moneyValidators =  [
            { validator: stringValidator, text: 'Пусті значення недопустимі' },
            { validator: moneyValidator, text: 'Неправильне числове значення' }
        ];
        const numberValidators =  [
            { validator: numberValidator, text: 'Неправильне числове значення' },
            { validator: stringValidator, text: 'Пусті значення недопустимі' }
        ];
        const barcodeValidators =  [
            { validator: onlyNumbersValidator, text: 'Допустимі лише цифри' },
            { validator: this.barcodeLengthValidator, text: 'Штрихкод має бути завдовжки 13 символів'}
        ];

        this.validators = {
            name: stringValidators,
            releaseForm: stringValidators,
            dosage: numberValidators,
            manufacturer: stringValidators,
            mark: moneyValidators,
            price: moneyValidators,
            barcode: barcodeValidators,
            department: []
        };
    }

    @computed
    get isSubmitAllowed(): boolean {
        const allValuesExist = Object.keys(this.fieldsErrorStatuses).length === Object.keys(this.formValues).length;
        const allValuesValid = Object.values(this.fieldsErrorStatuses).every(x => x === false);
        const imageAdded = !!this.props.file;
        return allValuesExist && allValuesValid && imageAdded && this.isValuesChanged;
    }

    @computed
    get departmentOptions(): Array<{ key: number, value: string }> {
        return (this.props.departments || []).map(({ id, name }) => ({
            key: id,
            value: name
        }));
    }

    validate = (propName: keyof IFormValues, value: string) => {
        const validatorSetting = this.validators[propName];
        const { isValid, errorMessage } = validatorSetting.reduce(
            (total, { validator, text }) => {
                const valid = validator(value);
                const newErrorMessage = valid
                    ? null
                    : text;
                return {
                    isValid: total.isValid && valid,
                    errorMessage: total.errorMessage || newErrorMessage
                };
            },
            { isValid: true, errorMessage: null }
        );

        this.fieldsErrorStatuses[propName] = isValid
            ? false
            : errorMessage;
    }

    changeHandler = (propName: keyof IFormValues, value: string) => {
        this.formValues[propName] = value;
        this.validate(propName, value);
    }

    enterPressHandler = (ev: KeyboardEvent) => {
        if (ev.keyCode === 13) this.submitHandler();
    }

    addEventListener = () => {
        window.addEventListener('keypress', this.enterPressHandler);
    }

    removeEventListener = () => {
        window.removeEventListener('keypress', this.enterPressHandler);
    }

    resetValues = (defaultMedicine?: IMedicine) => {
        const { currentDepartment } = this.props;

        const department = currentDepartment
            ? currentDepartment.name
            : '';

        if (defaultMedicine) {
            const {
                name,
                releaseForm,
                dosage,
                manufacturer,
                barcode,
                mark,
                price,
                image
            } = defaultMedicine;

            this.initialValue = {
                name: name || '',
                releaseForm: releaseForm || '',
                manufacturer: manufacturer || '',
                barcode: barcode || '',
                dosage: `${dosage || ''}`,
                mark: `${mark || ''}`,
                price: `${price || ''}`,
                department
            };

        } else {
            this.initialValue = { ...this.initialValue, department };
        }

        this.formValues = { ...this.initialValue };
        if (defaultMedicine) {
            Object.entries(this.formValues)
                .forEach(([ propName, value ]: [keyof IFormValues, string]) => this.validate(propName, value));
        }

    }

    submitHandler = () => {
        if (this.isSubmitAllowed) this.props.submitHandler(this.formValues);
    }

    componentWillUnmount() {
        this.removeEventListener();
    }

    render() {
        const { classes, isLoading, departments } = this.props;

        return (
            <>
                <Grid className={classes.fieldsContainer} container>
                    <Grid direction='column' className={classes.columnFirst} xs container item>
                        <FormRow
                            label='Назва'
                            values={this.formValues}
                            onChange={this.changeHandler}
                            propName='name'
                            error={this.fieldsErrorStatuses.name}
                            fullWidth
                            required
                        />
                        <FormRow
                            label='Дозування, мг'
                            values={this.formValues}
                            onChange={this.changeHandler}
                            propName='dosage'
                            error={this.fieldsErrorStatuses.dosage}
                            fullWidth
                        />
                        <FormRow
                            label='Штрихкод'
                            values={this.formValues}
                            onChange={this.changeHandler}
                            propName='barcode'
                            error={this.fieldsErrorStatuses.barcode}
                            fullWidth
                            required
                        />
                        <FormRow
                            label='Балл'
                            values={this.formValues}
                            onChange={this.changeHandler}
                            propName='mark'
                            error={this.fieldsErrorStatuses.mark}
                            fullWidth
                            required
                        />
                    </Grid>
                   <Grid direction='column' xs container item>
                        <FormRow
                            label='Форма выпуску'
                            values={this.formValues}
                            onChange={this.changeHandler}
                            propName='releaseForm'
                            error={this.fieldsErrorStatuses.releaseForm}
                            fullWidth
                            required
                        />
                        <FormRow
                            label='Виробник'
                            values={this.formValues}
                            onChange={this.changeHandler}
                            propName='manufacturer'
                            error={this.fieldsErrorStatuses.manufacturer}
                            fullWidth
                            required
                        />
                        <FormRow
                            label='Ціна, грн'
                            values={this.formValues}
                            onChange={this.changeHandler}
                            propName='price'
                            error={this.fieldsErrorStatuses.price}
                            fullWidth
                            required
                        />
                        <FormRow
                            select
                            label='Віділення'
                            values={this.formValues}
                            onChange={this.changeHandler}
                            propName='department'
                            disabled={!departments || !departments.length}
                            error={this.fieldsErrorStatuses.department}
                            fullWidth
                            required
                        >
                            {
                                departments && departments.map(({ id, name }) => (
                                    <MenuItem key={id} className={classes.menuItem} value={name}>
                                        { name }
                                    </MenuItem>
                                ))
                            }
                        </FormRow>
                    </Grid>
                </Grid>
                <Button
                    disabled={!this.isSubmitAllowed || isLoading}
                    className={classes.submitButton}
                    variant='contained'
                    color='primary'
                    onClick={this.submitHandler}>
                        {
                            isLoading
                            ? <LoadingMask size={20} />
                            : 'Додати'
                        }
                </Button>
            </>
        );
    }
}

export default withStyles(styles)(FormContent);
