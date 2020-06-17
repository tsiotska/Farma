import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { IAsyncStatus } from '../../../stores/AsyncStore';
import DoctorModal, { IDoctorModalValues } from '../DoctorModal/DoctorModal';
import { IDoctor } from '../../../interfaces/IDoctor';
import { computed, observable } from 'mobx';
import { SNACKBAR_TYPE } from '../../../constants/Snackbars';
import { EDIT_DOC_MODAL } from '../../../constants/Modals';
import Snackbar from '../../../components/Snackbar';

interface IProps {
    openedModal?: string;
    openModal?: (modalName: string) => void;
    editDoc?: (initialDoc: IDoctor, formValues: IDoctorModalValues) => Promise<boolean>;
    getAsyncStatus?: (key: string) => IAsyncStatus;
    modalPayload?: IDoctor;
}

@inject(({
    appState: {
        uiStore: {
            openModal,
            openedModal,
            modalPayload,
        },
        departmentsStore: {
            getAsyncStatus,
            editDoc
        }
    }
}) => ({
    openModal,
    openedModal,
    editDoc,
    getAsyncStatus,
    modalPayload
}))
@observer
class EditDoctorModal extends Component<IProps> {
    @observable showSnackbar: boolean = false;
    @observable snackbarType: SNACKBAR_TYPE = SNACKBAR_TYPE.SUCCESS;

    @computed
    get isLoading(): boolean {
        return this.props.getAsyncStatus('editDoc').loading;
    }

    @computed
    get isOpen(): boolean {
        const { openedModal, modalPayload } = this.props;
        return !!modalPayload && openedModal === EDIT_DOC_MODAL;
    }

    closeHandler = () => this.props.openModal(null);

    submitHandler = async (formValues: IDoctorModalValues) => {
        const { editDoc, modalPayload } = this.props;
        const docEdited = await editDoc(modalPayload, formValues);
        this.snackbarType = docEdited
            ? SNACKBAR_TYPE.SUCCESS
            : SNACKBAR_TYPE.ERROR;
        this.showSnackbar = true;
        if (docEdited) this.closeHandler();
    }

    snackbarCloseHandler = () => {
        this.showSnackbar = false;
    }

    render() {
        const { modalPayload } = this.props;

        return (
            <>
                <DoctorModal
                    open={this.isOpen}
                    isLoading={this.isLoading}
                    onClose={this.closeHandler}
                    onSubmit={this.submitHandler}
                    title='Змінити лікаря'
                    initialDoc={modalPayload}
                />
                <Snackbar
                    open={this.showSnackbar}
                    onClose={this.snackbarCloseHandler}
                    type={this.snackbarType}
                    message={
                        this.snackbarType === SNACKBAR_TYPE.SUCCESS
                        ? 'Лікар успішно змінений'
                        : 'Не вдалося відредагувати лікаря'
                    }
                />
            </>
        );
    }
}

export default EditDoctorModal;
