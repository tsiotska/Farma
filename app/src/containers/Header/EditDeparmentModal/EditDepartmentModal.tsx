import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Button } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { EDIT_DEPARTMENT_MODAL } from '../../../constants/Modals';
import { IDepartment } from '../../../interfaces/IDepartment';
import Dialog from '../../../components/Dialog';
import DepartmentDropzone from '../../Master/DepartmentDropzone';
import { observable } from 'mobx';
import FormRow from '../../../components/FormRow';
import { SNACKBAR_TYPE } from '../../../constants/Snackbars';
import Snackbar from '../../../components/Snackbar';

const styles = (theme: any) => createStyles({
    dropzone: {
        minWidth: 70,
        minHeight: 70
    },
    snackbar: {
        position: 'fixed'
    },
    submitButton: {
        width: 90,
        height: 36,
        marginLeft: 'auto'
    }
});

interface IProps extends WithStyles<typeof styles> {
    openModal?: (modalName: string) => void;
    openedModal?: string;
    modalPayload?: any;
    editDepartment?: (image: File | string, name: string) => boolean;
}

@inject(({
             appState: {
                 uiStore: {
                     openModal,
                     openedModal,
                     modalPayload,
                 },
                 departmentsStore: {
                     editDepartment
                 }
             }
         }) => ({
    openModal,
    openedModal,
    modalPayload,
    editDepartment
}))
@observer
class EditDepartmentModal extends Component<IProps> {
    readonly dropzoneClasses: any;
    @observable name: string = '';
    @observable image: File | string;
    @observable errors: Map<'image' | 'name', boolean | string> = new Map();
    @observable isLoading: boolean = false;
    @observable showSnackbar: boolean = false;
    @observable snackbarType: SNACKBAR_TYPE = SNACKBAR_TYPE.SUCCESS;

    constructor(props: IProps) {
        super(props);
        this.dropzoneClasses = { dropzone: this.props.classes.dropzone };
    }

    get isOpen(): boolean {
        const { openedModal, modalPayload } = this.props;
        return openedModal === EDIT_DEPARTMENT_MODAL && !!modalPayload;
    }

    get allowSubmit(): boolean {
        if (!this.isOpen) return false;
        const { modalPayload: { name, image } } = this.props;
        return !this.errors.get('name') && (image !== this.image || name !== this.name);
    }

    nameChangeHandler = (propName: string, value: string) => {
        this.name = value;
        const isValid = value.replace(/ /g, '').length >= 3;
        const errorValue = isValid
            ? false
            : 'Значення має містити не менше трьох символів';
        this.errors.set('name', errorValue);
    }

    removeIcon = () => {
        this.image = null;
    }

    appendImage = (image: File) => {
        this.image = image;
    }

    closeHandler = () => {
        const { openModal } = this.props;
        openModal(null);
    }

    submitHandler = async () => {
        this.isLoading = true;
        const edited = await this.props.editDepartment(this.image, this.name);
        this.isLoading = false;
        this.snackbarType = edited
            ? SNACKBAR_TYPE.SUCCESS
            : SNACKBAR_TYPE.ERROR;
        this.showSnackbar = true;
    }

    snackbarCloseHandler = () => this.showSnackbar = false;

    componentDidUpdate(prevProps: IProps) {
        const { openedModal: prevModal } = prevProps;
        const { openedModal, modalPayload } = this.props;
        const becomeOpen = prevModal !== EDIT_DEPARTMENT_MODAL
            && this.isOpen;
        const becomeClosed = prevModal === EDIT_DEPARTMENT_MODAL
            && openedModal !== EDIT_DEPARTMENT_MODAL;
        if (becomeOpen) {
            const { name, image } = (modalPayload as IDepartment);
            this.name = name;
            this.image = image;
        } else if (becomeClosed) {
            window.setTimeout(() => {
                this.name = '';
                this.image = null;
            }, 500);
        }
    }

    componentWillUnmount() {
        this.name = '';
        this.image = null;
    }

    render() {
        const { classes } = this.props;
        return (
            <Dialog
                fullWidth
                open={this.isOpen}
                onClose={this.closeHandler}
                maxWidth='xs'
                title='Редагувати віділення'>
                <Grid alignItems='center' wrap='nowrap' container>
                    <DepartmentDropzone
                        file={this.image}
                        classes={this.dropzoneClasses}
                        error={this.errors.get('image')}
                        removeIcon={this.removeIcon}
                        appendFile={this.appendImage}
                    />
                    <FormRow
                        fullWidth
                        required
                        label='Назва віділення'
                        value={this.name}
                        onChange={this.nameChangeHandler}
                        propName='name'
                        error={this.errors.get('name')}
                    />
                </Grid>
                <Button
                    className={classes.submitButton}
                    disabled={this.allowSubmit === false}
                    onClick={this.submitHandler}
                    color='primary'
                    variant='contained'>
                    Зберегти
                </Button>
                <Snackbar
                    classes={{ root: classes.snackbar }}
                    open={this.showSnackbar}
                    onClose={this.snackbarCloseHandler}
                    type={this.snackbarType}
                    message={
                        this.snackbarType === SNACKBAR_TYPE.SUCCESS
                            ? 'Віділення успішно змінено'
                            : 'Неможливо змінити віділення'
                    }
                />
            </Dialog>
        );
    }
}

export default withStyles(styles)(EditDepartmentModal);
