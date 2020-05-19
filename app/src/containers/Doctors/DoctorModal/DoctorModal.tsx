import React, { Component } from 'react';
import { createStyles, WithStyles, Button, MenuItem } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { ISpecialty } from '../../../interfaces/ISpecialty';
import { ILPU } from '../../../interfaces/ILPU';
import Dialog from '../../../components/Dialog';
import FormRow from '../../../components/FormRow';
import { observable, computed, toJS } from 'mobx';
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
    },
    lastFormRow: {
        paddingRight: '52%'
    }
});

interface IProps extends WithStyles<typeof styles> {
    open: boolean;
    isLoading: boolean;
    onClose: () => void;
    onSubmit: (values: IDoctorModalValues) => void;
    title: string;
    specialties?: ISpecialty[];
    loadSpecialties?: () => Promise<void>;
    LPUs?: ILPU[];
    loadLPUs?: () => Promise<void>;
    initialDoc?: IDoctor;
    getDocsPositions?: () => Promise<string[]>;
}

export interface IDoctorModalValues {
    [key: string]: string | ILPU | ISpecialty;

    name: string;
    lpu: ILPU;
    specialty: ISpecialty;
    position: string;
    mobilePhone: string;
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
                     getDocsPositions
                 }
             }
         }) => ({
    specialties,
    loadSpecialties,
    LPUs,
    loadLPUs,
    getDocsPositions
}))
@observer
class DoctorModal extends Component<IProps> {
    readonly objectFields: Array<keyof IDoctorModalValues> = ['lpu', 'specialty'];
    readonly optionalFields: Array<keyof IDoctorModalValues> = ['mobilePhone', 'workPhone', 'position', 'card'];
    readonly allFields: Array<keyof IDoctorModalValues>;
    readonly validators: Partial<Record<keyof IDoctorModalValues, Validator>>;
    readonly errorMessages: { [key: string]: string } = {
        name: 'Значення має містити не менше 3 символів',
        card: 'Значення має складатись з 16 цифр',
        mobilePhone: 'Телефон має склададатись з 10 або 12 цифр',
        workPhone: 'Телефон має склададатись з 10 або 12 цифр',
    };
    readonly initialFormValues: IDoctorModalValues = {
        name: '',
        lpu: null,
        specialty: null,
        mobilePhone: '',
        workPhone: '',
        card: '',
        position: ''
    };
    @observable formValues: IDoctorModalValues = { ...this.initialFormValues };
    @observable errors: Map<keyof IDoctorModalValues, boolean | string> = new Map();

    @observable docsPositions: string[] = [];

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
            mobilePhone: phoneValidator,
            workPhone: phoneValidator,
            card: cardValidator,
            position: objectValidator
        };
        this.allFields = [...Object.keys(this.initialFormValues)];
    }

    @computed
    get valuesChanged(): boolean {
        const { initialDoc } = this.props;
        if (!initialDoc) {
            return this.allFields.some(x => this.formValues[x] !== this.initialFormValues[x]);
        }
        return this.allFields.some(x => {
            const initialValue = initialDoc[x];
            const currentValue = this.formValues[x];

            if (x === 'lpu') {
                const lpuId = currentValue
                    ? (currentValue as ILPU).id
                    : null;
                return initialDoc.LPUId !== lpuId;
            } else if (x === 'specialty') {
                const specialtyName = currentValue
                    ? (currentValue as ISpecialty).name
                    : null;
                return (initialValue || null) !== specialtyName;
            }
            return (initialValue || '') !== currentValue;
        });
    }

    @computed
    get allowSubmit(): boolean {
        const requiredProps = this.allFields.filter(x => this.optionalFields.includes(x) === false);
        const hasRequiredProps = requiredProps.every(x => !!this.formValues[x]);
        const allPropsIsValid = this.allFields.every(x => !this.errors.get(x));
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
        const { open, loadSpecialties, loadLPUs, initialDoc } = this.props;

        const becomeOpen = wasOpen === false && open === true;
        if (!becomeOpen) return;
        const specialtyPromise = loadSpecialties();
        const lpusPromise = loadLPUs();

        if (!initialDoc) return;

        const {
            name,
            LPUId,
            specialty,
            position,
            mobilePhone,
            workPhone,
            card,
        } = initialDoc;

        this.formValues = {
            name: name.split(/\s+/).map(word => word[0].toUpperCase() + word.substring(1)).join(' ') || this.initialFormValues.name,
            lpu: this.initialFormValues.lpu,
            specialty: this.initialFormValues.specialty,
            mobilePhone: mobilePhone || this.initialFormValues.mobilePhone,
            workPhone: workPhone || this.initialFormValues.workPhone,
            card: card || this.initialFormValues.card,
            position: position || this.initialFormValues.position,
        };

        if (LPUId) {
            lpusPromise.then(() => {
                const targetLpu = this.props.LPUs
                    ? this.props.LPUs.find(x => x.id === LPUId)
                    : null;
                this.formValues.lpu = targetLpu;
            });
        }

        if (specialty) {
            specialtyPromise.then(() => {
                const targetSpecialty = this.props.specialties
                    ? this.props.specialties.find(x => x.name === specialty)
                    : null;
                this.formValues.specialty = targetSpecialty;
            });
        }
    }

    async componentDidMount() {
        const { getDocsPositions } = this.props;
        this.docsPositions = await getDocsPositions();
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
                    label='Мобільний телефон'
                    values={this.formValues}
                    onChange={this.changeHandler}
                    error={this.errors.get('mobilePhone')}
                    propName='mobilePhone'
                />
                <FormRow
                    autoComplete
                    id='lpu'
                    label='ЛПУ'
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
                    options={!!LPUs ? LPUs.map(({ id, name }) => (
                        name)) : []}
                    required/>

                <FormRow
                    label='Робочий телефон'
                    values={this.formValues}
                    onChange={this.changeHandler}
                    error={this.errors.get('workPhone')}
                    propName='workPhone'
                />
                <FormRow
                    autoComplete
                    id='lpu'
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
                    options={!!specialties ? specialties.map(({ id, name }) => (
                        name)) : []}
                    required/>
                <FormRow
                    label='Банківська картка'
                    values={this.formValues}
                    onChange={this.changeHandler}
                    error={this.errors.get('card')}
                    propName='card'
                    required
                />
                <FormRow
                    select
                    label='Посада'
                    values={this.formValues}
                    onChange={this.changeHandler}
                    classes={{ root: classes.lastFormRow }}
                    error={this.errors.get('position')}
                    propName='position'
                    fullWidth>
                    {
                        this.docsPositions.map(x => (
                            <MenuItem key={x} value={x}>
                                {x}
                            </MenuItem>
                        ))
                    }
                </FormRow>
                <Button
                    onClick={this.submitHandler}
                    disabled={isLoading || this.allowSubmit === false}
                    className={classes.submitButton}
                    variant='contained'
                    color='primary'>
                    {
                        isLoading
                            ? <LoadingMask size={20}/>
                            : 'Зберегти зміни'
                    }
                </Button>
            </Dialog>
        )
            ;
    }
}

export default withStyles(styles)(DoctorModal);
