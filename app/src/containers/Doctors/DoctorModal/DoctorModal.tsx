import React, { Component } from 'react';
import { createStyles, WithStyles, Button, MenuItem } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { ISpecialty } from '../../../interfaces/ISpecialty';
import { ILPU } from '../../../interfaces/ILPU';
import Dialog from '../../../components/Dialog';
import FormRow from '../../../components/FormRow';
import { observable, computed } from 'mobx';
import { lengthValidator, onlyNumbersValidator, Validator } from '../../../helpers/validators';
import LoadingMask from '../../../components/LoadingMask';
import { IDoctor } from '../../../interfaces/IDoctor';

const styles = (theme: any) => createStyles({
    submitButton: {
        marginLeft: 'auto',
    },
    header: {
        marginBottom: 10
    },
    menuItem: {
        minHeight: 36
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});

interface IProps extends WithStyles<typeof styles> {
    open: boolean;
    isLoading: boolean;
    onClose: () => void;
    onSubmit: (values: IDoctorModalValues) => void;
    title: string;
    specialties?: ISpecialty[];
    loadSpecialties?: () => void;
    LPUs?: ILPU[];
    loadLPUs?: () => void;
    initialDoc?: IDoctor;
}

export interface IDoctorModalValues {
    [key: string]: string | ILPU | ISpecialty;
    name: string;
    lpu: ILPU;
    specialty: ISpecialty;
    homePhone: string;
    workPhone: string;
    card: string;
}

@inject(({
    appState: {
        departmentsStore: {
            specialties,
            loadSpecialties,
            LPUs,
            loadLPUs,
        }
    }
}) => ({
    specialties,
    loadSpecialties,
    LPUs,
    loadLPUs,
}))
@observer
class DoctorModal extends Component<IProps> {
    readonly objectFields: Array<keyof IDoctorModalValues> = [ 'lpu', 'specialty' ];
    readonly optionalFields: Array<keyof IDoctorModalValues> = [ 'homePhone', 'workPhone' ];
    readonly allFields: Array<keyof IDoctorModalValues>;
    readonly validators: Partial<Record<keyof IDoctorModalValues, Validator>>;
    readonly errorMessages: { [key: string]: string } = {
        name: 'Значення має містити не менше 3 символів',
        card: 'Значення має складатись з 16 цифр',
        homePhone: 'Телефон має склададатись з 10 або 12 цифр',
        workPhone: 'Телефон має склададатись з 10 або 12 цифр',
    };
    readonly initialFormValues: IDoctorModalValues = {
        name: '',
        lpu: null,
        specialty: null,
        homePhone: '',
        workPhone: '',
        card: '',
    };
    @observable formValues: IDoctorModalValues = { ...this.initialFormValues };
    @observable errors: Map<keyof IDoctorModalValues, boolean | string> = new Map();

    constructor(props: IProps) {
        super(props);
        const phoneValidator = (value: string) => !!value
            && onlyNumbersValidator(value)
            && (value.length === 10 || value.length === 12);
        const cardValidator = (value: string) => !!value
            && value.length === 16
            && onlyNumbersValidator(value);
        const objectValidator = (value: any) => !!value;
        this.validators = {
            name: (value: string) => lengthValidator(3, value),
            lpu: objectValidator,
            specialty: objectValidator,
            homePhone: phoneValidator,
            workPhone: phoneValidator,
            card: cardValidator,
        };
        this.allFields = [...Object.keys(this.initialFormValues)];
    }

    @computed
    get valuesChanged(): boolean {
        const { initialDoc } = this.props;
        if (!initialDoc) {
            return this.allFields.some(x => this.formValues[x] !== this.initialFormValues[x]);
        }
        return true;
    }

    @computed
    get allowSubmit(): boolean {
        const requiredProps = this.allFields.filter(x => this.optionalFields.includes(x) === false);
        const hasRequiredProps = requiredProps.every(x => !!this.formValues[x]);
        const allPropsIsValid = this.allFields.every(x => (
            this.optionalFields.includes(x)
                ? !this.errors.get(x)
                : this.errors.get(x) === false
        ));
        return hasRequiredProps && allPropsIsValid && this.valuesChanged;
    }

    validate = (propName: keyof IDoctorModalValues, value: string) => {
        const validator = this.validators[propName];
        const isOptional = this.optionalFields.includes(propName);
        const errorMessage = this.errorMessages[propName];
        const isValid = isOptional
            ? !value || validator(value)
            : !!value && validator(value);
        this.errors.set(
            propName,
            isValid
                ? false
                : errorMessage || true
        );
    }

    changeHandler = (propName: keyof IDoctorModalValues, value: string) => {
        const { LPUs, specialties } = this.props;
        if (this.objectFields.includes(propName)) {
            const id = +value;
            const source = (
                propName === 'lpu'
                    ? LPUs
                    : specialties
                ) || [];
            const targetItem = source.find(x => x.id === id);
            this.formValues[propName] = targetItem || null;
        } else {
            this.formValues[propName] = value;
        }
        this.validate(propName, value);
    }

    submitHandler = () => this.props.onSubmit(this.formValues);

    componentDidUpdate(prevProps: IProps) {
        const { open: wasOpen } = prevProps;
        const { open, loadSpecialties, loadLPUs } = this.props;

        const becomeOpen = wasOpen === false && open === true;
        if (becomeOpen) {
            loadSpecialties();
            loadLPUs();
        }
    }

    render() {
        const {
            classes,
            open,
            onClose,
            title,
            specialties,
            LPUs,
            isLoading
        } = this.props;

        return (
            <Dialog
                classes={{
                    title: classes.header,
                    content: classes.container
                }}
                open={open}
                onClose={onClose}
                title={title}
                fullWidth
                maxWidth='sm'>
                <FormRow
                    label='ПІБ'
                    values={this.formValues}
                    onChange={this.changeHandler}
                    propName='name'
                    error={this.errors.get('name')}
                    required
                />
                <FormRow
                    label='Телефон 1'
                    values={this.formValues}
                    onChange={this.changeHandler}
                    error={this.errors.get('homePhone')}
                    propName='homePhone'
                />
                <FormRow
                    select
                    label='ЛПУ/Аптека'
                    values={this.formValues}
                    onChange={this.changeHandler}
                    error={this.errors.get('lpu')}
                    propName='lpu'
                    disabled={!LPUs || !LPUs.length}
                    value={
                        this.formValues.lpu
                        ? this.formValues.lpu.id
                        : ''
                    }
                    required>
                        {
                            !!LPUs && LPUs.map(({ id, name }) => (
                                <MenuItem key={id} value={id}>
                                    { name }
                                </MenuItem>
                            ))
                        }
                </FormRow>
                <FormRow
                    label='Телефон 2'
                    values={this.formValues}
                    onChange={this.changeHandler}
                    error={this.errors.get('workPhone')}
                    propName='workPhone'
                />
                <FormRow
                    select
                    label='Спеціальність'
                    values={this.formValues}
                    onChange={this.changeHandler}
                    error={this.errors.get('specialty')}
                    propName='specialty'
                    disabled={!specialties || !specialties.length}
                    value={
                        this.formValues.specialty
                        ? this.formValues.specialty.id
                        : ''
                    }
                    required>
                        {
                            !!specialties && specialties.map(({ id, name }) => (
                                <MenuItem key={id} value={id}>
                                    { name }
                                </MenuItem>
                            ))
                        }
                </FormRow>
                <FormRow
                    label='Банківська картка'
                    values={this.formValues}
                    onChange={this.changeHandler}
                    error={this.errors.get('card')}
                    propName='card'
                    required
                />
                <Button
                    onClick={this.submitHandler}
                    disabled={isLoading || this.allowSubmit === false}
                    className={classes.submitButton}
                    variant='contained'
                    color='primary'>
                        {
                            isLoading
                            ? <LoadingMask size={20} />
                            : 'Додати лікаря'
                        }
                </Button>
            </Dialog>
        );
    }
}

export default withStyles(styles)(DoctorModal);
