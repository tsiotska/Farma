import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { computed, observable } from 'mobx';
import DoctorModal from '../DoctorModal';
import { CREATE_DOC_MODAL } from '../../../constants/Modals';
import { IDoctorModalValues } from '../DoctorModal/DoctorModal';
import { IAsyncStatus } from '../../../stores/AsyncStore';
import { SNACKBAR_TYPE } from '../../../constants/Snackbars';
import Snackbar from '../../../components/Snackbar';

interface IProps {
    openedModal?: string;
    openModal?: (modalName: string) => void;
    createDoc?: (formValues: IDoctorModalValues) => Promise<boolean>;
    getAsyncStatus?: (key: string) => IAsyncStatus;
}

@inject(({
    appState: {
        uiStore: {
            openedModal,
            openModal
        },
        departmentsStore: {
            createDoc,
            getAsyncStatus
        }
    }
}) => ({
    openedModal,
    openModal,
    createDoc,
    getAsyncStatus
}))
@observer
class CreateDoctorModal extends Component<IProps> {
    @observable showSnackbar: boolean = false;
    @observable snackbarType: SNACKBAR_TYPE = SNACKBAR_TYPE.SUCCESS;

    @computed
    get isOpen(): boolean {
        return this.props.openedModal === CREATE_DOC_MODAL;
    }

    @computed
    get isLoading(): boolean {
        return this.props.getAsyncStatus('createDoc').loading;
    }

    closeHandler = () => this.props.openModal(null);

    submitHandler = async (formValues: IDoctorModalValues) => {
        const { createDoc } = this.props;
        const docCreated = await createDoc(formValues);
        this.snackbarType = docCreated
            ? SNACKBAR_TYPE.SUCCESS
            : SNACKBAR_TYPE.ERROR;
        this.showSnackbar = true;
        if (docCreated) this.closeHandler();
    }

    snackbarCloseHandler = () => {
        this.showSnackbar = false;
    }

    render() {
        return (
            <>
                <DoctorModal
                    open={this.isOpen}
                    isLoading={this.isLoading}
                    onClose={this.closeHandler}
                    onSubmit={this.submitHandler}
                    title='Додати лікаря'
                />
                <Snackbar
                    open={this.showSnackbar}
                    onClose={this.snackbarCloseHandler}
                    type={this.snackbarType}
                    message={
                        this.snackbarType === SNACKBAR_TYPE.SUCCESS
                        ? 'Лікар успішно створений'
                        : 'Створити лікаря неможливо'
                    }
                />
            </>
        );
    }
}

export default CreateDoctorModal;
