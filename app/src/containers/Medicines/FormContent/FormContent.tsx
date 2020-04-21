import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Button } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { observable, computed } from 'mobx';
import FormRow from '../FormRow';
import { Validator, stringValidator, moneyValidator, numberValidator, lengthValidator, onlyNumbersValidator } from '../../../helpers/validators';
import LoadingMask from '../../../components/LoadingMask';

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
    file: File;
    submitHandler: (data: any) => void;
    isLoading: boolean;
}

type InputType = 'string' | 'number' | 'money' | 'barcode';
interface IValidatorSettings {
    validator: Validator;
    text: string;
}

@observer
class FormContent extends Component<IProps> {
    lengthValidator: Validator;
    readonly validatorSettings: Record<InputType, IValidatorSettings[]>;
    readonly values: any = {
        name: 'name',
        releaseForm: 'releaseForm',
        dosage: 'dosage',
        manufacturer: 'manufacturer',
        bonus: 'bonus',
        price: 'price',
        barcode: 'barcode'
    };

    constructor(props: IProps) {
        super(props);
        this.lengthValidator = (value: string): boolean => {
            return !!value && value.length >= 3;
        };

        this.validatorSettings = {
            string: [{ validator: this.lengthValidator, text: 'Мінімальна довжина поля - 3 символи' }],
            money: [{ validator: stringValidator, text: 'Пусті значення недопустимі' }, { validator: moneyValidator, text: 'Неправильне числове значення' }],
            number: [{ validator: numberValidator, text: 'Неправильне числове значення' }, { validator: stringValidator, text: 'Пусті значення недопустимі' }],
            barcode: [{ validator: onlyNumbersValidator, text: 'Допустимі лише цифри' }]
        };
    }

    @observable formValues: any = {};
    @observable fieldsErrorStatuses: any = {
        name: false,
        releaseForm: false,
        dosage: false,
        manufacturer: false,
        bonus: false,
        price: false,
    };

    @computed
    get isSubmitAllowed(): boolean {
        const allValuesExist = Object.keys(this.fieldsErrorStatuses).length === Object.keys(this.formValues).length;
        const allValuesValid = Object.values(this.fieldsErrorStatuses).every(x => x === false);
        const imageAdded = !!this.props.file;
        return allValuesExist && allValuesValid && imageAdded;
    }

    changeHandler = (propName: string, type: InputType = 'string') =>
        ({ target: { value }}: any) => {
            this.formValues[propName] = value;
            const validatorSetting = this.validatorSettings[type];

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

    enterPressHandler = (ev: KeyboardEvent) => {
        if (ev.keyCode === 13) this.submitHandler();
    }

    addEventListener = () => {
        window.addEventListener('keypress', this.enterPressHandler);
    }

    removeEventListener = () => {
        window.removeEventListener('keypress', this.enterPressHandler);
    }

    resetValues = () => {
        this.formValues = {};
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
                            value={this.formValues[this.values.name] || ''}
                            onChange={this.changeHandler(this.values.name)}
                            error={this.fieldsErrorStatuses[this.values.name]}
                        />
                        <FormRow
                            label='Дозування, мг'
                            value={this.formValues[this.values.dosage] || ''}
                            onChange={this.changeHandler(this.values.dosage, 'number')}
                            error={this.fieldsErrorStatuses[this.values.dosage]}
                        />
                        <FormRow
                            label='Штрихкод'
                            value={this.formValues[this.values.barcode] || ''}
                            onChange={this.changeHandler(this.values.barcode, 'barcode')}
                            error={this.fieldsErrorStatuses[this.values.barcode]}
                        />
                        <FormRow
                            label='Балл'
                            value={this.formValues[this.values.bonus] || ''}
                            onChange={this.changeHandler(this.values.bonus, 'money')}
                            error={this.fieldsErrorStatuses[this.values.bonus]}
                        />
                    </Grid>
                    <Grid direction='column' xs container item>
                        <FormRow
                            label='Форма выпуску'
                            value={this.formValues[this.values.releaseForm] || ''}
                            onChange={this.changeHandler(this.values.releaseForm)}
                            error={this.fieldsErrorStatuses[this.values.releaseForm]}
                        />
                        <FormRow
                            label='Виробник'
                            value={this.formValues[this.values.manufacturer] || ''}
                            onChange={this.changeHandler(this.values.manufacturer)}
                            error={this.fieldsErrorStatuses[this.values.manufacturer]}
                        />
                        <FormRow
                            label='Ціна, грн'
                            value={this.formValues[this.values.price] || ''}
                            onChange={this.changeHandler(this.values.price, 'money')}
                            error={this.fieldsErrorStatuses[this.values.price]}
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
