import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Button } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { observable } from 'mobx';
import FormRow from '../FormRow';
import { Validator, stringValidator, moneyValidator, numberValidator } from '../../../helpers/validators';

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
        // color: theme.palette.primary.white,
        // backgroundColor: theme.palette.primary.blue,
        // '&:hover': {
        //     backgroundColor: '#1d8ce4',
        // }
    },
});

interface IProps extends WithStyles<typeof styles> {
    ref?: any;
    file: File;
    submitHandler: (data: any) => void;
}

type InputType = 'string' | 'number' | 'money';
interface IValidatorSettings {
    validator: Validator;
    text: string;
}

@observer
class FormContent extends Component<IProps> {
    readonly validatorSettings: Record<InputType, IValidatorSettings> = {
        string: { validator: stringValidator, text: 'Пустые значения недопустимы' },
        money: { validator: moneyValidator, text: 'Неверное числовое значение' },
        number: { validator: numberValidator, text: 'Неверное числовое значение'},
    };
    readonly values: any = {
        name: 'name',
        releaseForm: 'releaseForm',
        dosage: 'dosage',
        manufacturer: 'manufacturer',
        bonus: 'bonus',
        price: 'price'
    };

    @observable formValues: any = {};
    @observable fieldsErrorStatuses: any = {
        name: false,
        releaseForm: false,
        dosage: false,
        manufacturer: false,
        bonus: false,
        price: false,
    };

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
            const isValid = value.length && validatorSetting.validator(value);

            if (isValid) {
                this.fieldsErrorStatuses[propName] = false;
            } else {
                this.fieldsErrorStatuses[propName] = value.length
                ? validatorSetting.text
                : 'Пустые значения недопустимы';
            }
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
        const { classes } = this.props;

        return (
            <>
                <Grid className={classes.fieldsContainer} container>
                    <Grid direction='column' className={classes.columnFirst} xs container item>
                        <FormRow
                            label='Название'
                            value={this.formValues[this.values.name] || ''}
                            onChange={this.changeHandler(this.values.name)}
                            error={this.fieldsErrorStatuses[this.values.name]}
                        />
                        <FormRow
                            label='Дозировка, мг'
                            value={this.formValues[this.values.dosage] || ''}
                            onChange={this.changeHandler(this.values.dosage, 'number')}
                            error={this.fieldsErrorStatuses[this.values.dosage]}
                        />
                        <FormRow
                            label='Бонус, грн'
                            value={this.formValues[this.values.bonus] || ''}
                            onChange={this.changeHandler(this.values.bonus, 'money')}
                            error={this.fieldsErrorStatuses[this.values.bonus]}
                        />
                    </Grid>
                    <Grid direction='column' xs container item>
                        <FormRow
                            label='Форма выпуска'
                            value={this.formValues[this.values.releaseForm] || ''}
                            onChange={this.changeHandler(this.values.releaseForm)}
                            error={this.fieldsErrorStatuses[this.values.releaseForm]}
                        />
                        <FormRow
                            label='Производитель'
                            value={this.formValues[this.values.manufacturer] || ''}
                            onChange={this.changeHandler(this.values.manufacturer)}
                            error={this.fieldsErrorStatuses[this.values.manufacturer]}
                        />
                        <FormRow
                            label='Цена, грн'
                            value={this.formValues[this.values.price] || ''}
                            onChange={this.changeHandler(this.values.price, 'money')}
                            error={this.fieldsErrorStatuses[this.values.price]}
                        />
                    </Grid>
                </Grid>
                <Button
                    disabled={!this.isSubmitAllowed}
                    className={classes.submitButton}
                    variant='contained'
                    color='primary'
                    onClick={this.submitHandler}>
                    Добавить
                </Button>
            </>
        );
    }
}

export default withStyles(styles)(FormContent);
