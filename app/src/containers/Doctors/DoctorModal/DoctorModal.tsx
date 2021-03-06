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
    },
    name: {
        textTransform: 'capitalize'
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
        name: '???????????????? ?????? ?????????????? ???? ?????????? 3 ????????????????',
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
        const objectValidator = (value: any) => !!value;
        this.validators = {
            name: (value: string) => lengthValidator(3, value),
            lpu: objectValidator,
            specialty: objectValidator,
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
        if (!(propName in this.validators)) return;
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
            const id = value
                ? (value as any).id
                : null;
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
            name: name || this.initialFormValues.name,
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
                    className={classes.name}
                    label='??????'
                    values={this.formValues}
                    onChange={this.changeHandler}
                    propName='name'
                    error={this.errors.get('name')}
                    required
                />
                <FormRow
                    label='?????????????????? ??????????????'
                    values={this.formValues}
                    onChange={this.changeHandler}
                    propName='mobilePhone'
                />
                <FormRow
                    required
                    autoComplete
                    label='??????'
                    propName='lpu'
                    renderPropName='name'
                    onChange={this.changeHandler}
                    error={this.errors.get('lpu')}
                    disabled={!LPUs || !LPUs.length}
                    value={this.formValues.lpu}
                    options={!!LPUs ? LPUs : []}/>
                <FormRow
                    label='?????????????? ??????????????'
                    values={this.formValues}
                    onChange={this.changeHandler}
                    propName='workPhone' />
                <FormRow
                    required
                    autoComplete
                    label='??????????????????????????'
                    propName='specialty'
                    renderPropName='name'
                    onChange={this.changeHandler}
                    value={this.formValues.specialty}
                    disabled={!specialties || !specialties.length}
                    options={!!specialties ? specialties : []}
                    error={this.errors.get('specialty')}/>
                <FormRow
                    label='???????????????????? ????????????/????????????????'
                    values={this.formValues}
                    onChange={this.changeHandler}
                    propName='card'/>
                <FormRow
                    select
                    label='????????????'
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
                            : '???????????????? ??????????'
                    }
                </Button>
            </Dialog>
        )
            ;
    }
}

export default withStyles(styles)(DoctorModal);
