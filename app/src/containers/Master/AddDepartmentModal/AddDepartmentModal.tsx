import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles, createStyles, WithStyles, Divider, Typography, Button } from '@material-ui/core';
import Dialog from '../../../components/Dialog';
import { ADD_DEPARTMENT_MODAL } from '../../../constants/Modals';
import { observable, computed, toJS } from 'mobx';
import FFMBlock from '../FFMBlock';
import DepartmentBlock from '../DepartmentBlock';
import { ICreateDepartmentReport } from '../../../stores/DepartmentsStore';
import { SNACKBAR_TYPE } from '../../../constants/Snackbars';
import LoadingMask from '../../../components/LoadingMask';
import Snackbar from '../../../components/Snackbar';
import { emailValidator } from '../../../helpers/validators';
import { USER_ROLE } from '../../../constants/Roles';

const styles = (theme: any) => createStyles({
    subtitle: {
        margin: '12px 0'
    },
    submitButton: {
        height: 36,
        width: 90,
        color: 'white',
        backgroundColor: '#647cfe',
        marginLeft: 'auto',
        '&:hover': {
            backgroundColor: '#748aff'
        }
    },
    snackbar: {
        position: 'fixed'
    }
});

interface IProps extends WithStyles<typeof styles> {
    openedModal?: string;
    openModal?: (modalName: string) => void;
    createDepartment?: (departmentData: FormData, FFMData: FormData) => Promise<ICreateDepartmentReport>;
}

export enum TARGET_IMAGE {
    FFM,
    DEPARTMENT
}

export interface IDepartmentData {
    image: File;
    name: string;
}

export interface IFFMData {
    image: File;
    name: string;
    workPhone: string;
    mobilePhone: string;
    card: string;
    email: string;
    password: string;
}

interface ISnackbarSettings {
    isOpen: boolean;
    type: SNACKBAR_TYPE;
    text: string;
}

@inject(({
    appState: {
        uiStore: {
            openedModal,
            openModal
        },
        departmentsStore: {
            createDepartment
        }
    }
}) => ({
    openedModal,
    openModal,
    createDepartment
}))
@observer
class AddDepartmentModal extends Component<IProps> {
    readonly requiredDepartmentProps: string[] = ['name'];
    readonly initialDepartmentData: IDepartmentData = {
        image: null,
        name: ''
    };

    readonly requiredFfmData: string[] = [ 'name', 'email', 'password' ];
    readonly initialFfmData: IFFMData = {
        image: null,
        name: '',
        workPhone: '',
        mobilePhone: '',
        card: '',
        email: '',
        password: ''
    };

    readonly validators: Partial<Record<keyof IFFMData & IDepartmentData, any>> = {
        email: emailValidator,
        image: (value: File) => !!value,
        phone: (value: string) => value && (value.length === 10 || value.length === 13),
        card: (value: string) => value && (value.length === 13)
    };

    @observable departmentData: IDepartmentData = {...this.initialDepartmentData};
    @observable ffmData: IFFMData = {...this.initialFfmData};

    @observable invalidDepartmentFields: Set<keyof IDepartmentData> = new Set();
    @observable invalidFFMFields: Set<keyof IFFMData> = new Set();

    @observable isProccessing: boolean = false;
    @observable snackbarSettings: ISnackbarSettings = {
        isOpen: false,
        type: SNACKBAR_TYPE.SUCCESS,
        text: ''
    };

    defaultValueValidator = (value: string): boolean => !!value && value.length >= 3;

    appendImage = (targetProp: TARGET_IMAGE) => (image: File) => {
        if (targetProp === TARGET_IMAGE.FFM) {
            this.ffmData.image = image;
        } else if (targetProp === TARGET_IMAGE.DEPARTMENT) {
            this.departmentData.image = image;
        }
    }

    removeImage = (targetProp: TARGET_IMAGE) => () => {
        if (targetProp === TARGET_IMAGE.DEPARTMENT) {
            this.departmentData.image = null;
        } else if (targetProp === TARGET_IMAGE.FFM) {
            this.ffmData.image = null;
        }
    }

    departmentNameChangeHandler = ({ target: { value }}: any) => {
        this.departmentData.name = value;
    }

    fmmDataChangeHandler = (propName: keyof Omit<IFFMData, 'image'>, value: string) => {
        this.ffmData[propName] = value;
    }

    getDepartmentFormData = (): FormData => {
        const { name, image } = this.departmentData;
        const departmentFormData = new FormData();

        departmentFormData.append('image', image);
        departmentFormData.append('json', JSON.stringify({ name }));

        return departmentFormData;
    }

    getFFMFormData = (): FormData => {
        const {
            card,
            email,
            image,
            name,
            password,
            workPhone,
            mobilePhone
        } = this.ffmData;
        const ffmFormData = new FormData();

        ffmFormData.append('image', image);

        const json = JSON.stringify({
            bank_card: card,
            email: email,
            full_name: name,
            password: password,
            work_phone: workPhone,
            mobile_phone: mobilePhone,
            position: USER_ROLE.FIELD_FORCE_MANAGER
        });
        ffmFormData.append('json', json);

        return ffmFormData;
    }

    openSnackbar = ({ isDepartmentCreated, isFFMCreated }: ICreateDepartmentReport) => {
        if (isDepartmentCreated && isFFMCreated) {
            this.snackbarSettings = {
                isOpen: true,
                type: SNACKBAR_TYPE.SUCCESS,
                text: 'Відділення і ФФМ успішно створені'
            };
            this.closeHandler();
        } else {
            const text: string = !isDepartmentCreated
            ? 'Неможливо створити відділення'
            : 'неможливо стоврити ФФМ`а';

            this.snackbarSettings = {
                isOpen: true,
                type: SNACKBAR_TYPE.ERROR,
                text
            };
        }
    }

    validate = (): boolean => {
        this.invalidFFMFields.clear();
        Object.entries(this.ffmData).forEach(([ prop, value ]: [keyof IFFMData, any]) => {
            const validator = this.validators[prop] || this.defaultValueValidator;
            const isRequired = this.requiredFfmData.includes(prop);
            const isValid = isRequired
                ? validator(value)
                : value
                    ? validator(value)
                    : true;
            if (!isValid) this.invalidFFMFields.add(prop);
        });

        this.invalidDepartmentFields.clear();
        Object.entries(this.departmentData).forEach(([ prop, value ]: [keyof IDepartmentData, any]) => {
            const validator = this.validators[prop] || this.defaultValueValidator;
            const isRequired = this.requiredDepartmentProps.includes(prop);
            const isValid = isRequired
                ? validator(value)
                : value
                    ? validator(value)
                    : true;
            if (!isValid) this.invalidDepartmentFields.add(prop);
        });

        return !this.invalidDepartmentFields.size && !this.invalidFFMFields.size;
    }

    submitHandler = async () => {
        const { createDepartment } = this.props;

        const isValid = this.validate();
        if (this.isProccessing || !isValid) return;

        const ffmData = this.getFFMFormData();
        const departmentData = this.getDepartmentFormData();

        this.isProccessing = true;
        const report = await createDepartment(departmentData, ffmData);
        this.isProccessing = false;

        this.openSnackbar(report);

    }

    closeHandler = () => this.props.openModal(null);

    snackbarCloseHandler = () => {
        this.snackbarSettings.isOpen = false;
    }

    componentDidUpdate({ openedModal: prevModal }: IProps) {
        const { openedModal: currentModal } = this.props;
        const shouldClearValues = prevModal === ADD_DEPARTMENT_MODAL
            && currentModal !== ADD_DEPARTMENT_MODAL;

        if (shouldClearValues) {
            this.ffmData = {...this.initialFfmData};
            this.departmentData = {...this.initialDepartmentData};
        }
    }

    render() {
        const { openedModal, classes } = this.props;

        return (
            <Dialog
                fullWidth
                open={openedModal === ADD_DEPARTMENT_MODAL}
                onClose={this.closeHandler}
                title='Додати відділення'>
                    <DepartmentBlock
                        values={this.departmentData}
                        onNameChange={this.departmentNameChangeHandler}
                        removeIcon={this.removeImage(TARGET_IMAGE.DEPARTMENT)}
                        appendFile={this.appendImage(TARGET_IMAGE.DEPARTMENT)}
                        invalidFields={this.invalidDepartmentFields}
                    />
                    <Divider />
                    <Typography variant='h5' className={classes.subtitle}>
                        Створити ФФМ
                    </Typography>
                    <FFMBlock
                        values={this.ffmData}
                        changeHandler={this.fmmDataChangeHandler}
                        appendFile={this.appendImage(TARGET_IMAGE.FFM)}
                        removeIcon={this.removeImage(TARGET_IMAGE.FFM)}
                        invalidFields={this.invalidFFMFields}
                    />
                    <Button
                        onClick={this.submitHandler}
                        variant='contained'
                        className={classes.submitButton}>
                        {
                            this.isProccessing
                            ? <LoadingMask size={20} />
                            : 'Зберегти'
                        }
                    </Button>
                    <Snackbar
                        open={this.snackbarSettings.isOpen}
                        onClose={this.snackbarCloseHandler}
                        type={this.snackbarSettings.type}
                        message={this.snackbarSettings.text}
                        autoHideDuration={6000}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        classes={{ root: classes.snackbar }}
                    />
            </Dialog>
        );
    }
}

export default withStyles(styles)(AddDepartmentModal);
