import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Button } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { observable, computed, toJS } from 'mobx';
import FormRow from '../FormRow';
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
});

interface IProps extends WithStyles<typeof styles> {
    ref?: any;
    file: File | string;
    submitHandler: (data: any) => void;
    isLoading: boolean;
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
}

@observer
class FormContent extends Component<IProps> {
    @observable formValues: Partial<IFormValues> = {};
    @observable fieldsErrorStatuses: Record<keyof IFormValues, boolean> = {
        name: false,
        releaseForm: false,
        dosage: false,
        manufacturer: false,
        mark: false,
        price: false,
        barcode: false
    };

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
        };
    }

    @computed
    get isSubmitAllowed(): boolean {
        const allValuesExist = Object.keys(this.fieldsErrorStatuses).length === Object.keys(this.formValues).length;
        const allValuesValid = Object.values(this.fieldsErrorStatuses).every(x => x === false);
        const imageAdded = !!this.props.file;
        return allValuesExist && allValuesValid && imageAdded;
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

    changeHandler = (propName: keyof IFormValues) => ({ target: { value }}: any) => {
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
        if (defaultMedicine) {
            const {
                name,
                releaseForm,
                dosage,
                manufacturer,
                barcode,
                mark,
                price,
            } = defaultMedicine;

            this.formValues = {
                name: name || '',
                releaseForm: releaseForm || '',
                manufacturer: manufacturer || '',
                barcode: barcode || '',
                dosage: `${dosage || ''}`,
                mark: `${mark || ''}`,
                price: `${price || ''}`,
            };

            Object.entries(this.formValues)
                .forEach(([ propName, value ]: [keyof IFormValues, string]) => this.validate(propName, value));
        } else {
            this.formValues = {};
        }
    }

    submitHandler = () => {
        if (this.isSubmitAllowed) this.props.submitHandler(this.formValues);
    }

    componentWillUnmount() {
        this.removeEventListener();
    }

    render() {
        const { classes, isLoading } = this.props;

        return (
            <>
                <Grid className={classes.fieldsContainer} container>
                    <Grid direction='column' className={classes.columnFirst} xs container item>
                        <FormRow
                            label='Назва'
                            value={this.formValues.name || ''}
                            error={this.fieldsErrorStatuses.name}
                            onChange={this.changeHandler('name')}
                        />
                        <FormRow
                            label='Дозування, мг'
                            value={this.formValues.dosage || ''}
                            onChange={this.changeHandler('dosage')}
                            error={this.fieldsErrorStatuses.dosage}
                        />
                        <FormRow
                            label='Штрихкод'
                            value={this.formValues.barcode || ''}
                            onChange={this.changeHandler('barcode')}
                            error={this.fieldsErrorStatuses.barcode}
                        />
                        <FormRow
                            label='Балл'
                            value={this.formValues.mark || ''}
                            onChange={this.changeHandler('mark')}
                            error={this.fieldsErrorStatuses.mark}
                        />
                    </Grid>
                    <Grid direction='column' xs container item>
                        <FormRow
                            label='Форма выпуску'
                            value={this.formValues.releaseForm || ''}
                            onChange={this.changeHandler('releaseForm')}
                            error={this.fieldsErrorStatuses.releaseForm}
                        />
                        <FormRow
                            label='Виробник'
                            value={this.formValues.manufacturer || ''}
                            onChange={this.changeHandler('manufacturer')}
                            error={this.fieldsErrorStatuses.manufacturer}
                        />
                        <FormRow
                            label='Ціна, грн'
                            value={this.formValues.price || ''}
                            onChange={this.changeHandler('price')}
                            error={this.fieldsErrorStatuses.price}
                        />
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
