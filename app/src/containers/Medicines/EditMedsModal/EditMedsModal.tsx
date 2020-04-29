import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, computed, toJS } from 'mobx';
import { ADD_MEDICINE_MODAL, MEDICINE_EDIT_MODAL } from '../../../constants/Modals';
import { IAsyncStatus } from '../../../stores/AsyncStore';
import { SNACKBAR_TYPE } from '../../../constants/Snackbars';
import Snackbar from '../../../components/Snackbar';
import { IFormValues } from '../FormContent/FormContent';
import MedsModal from '../MedsModal';
import { IMedicine } from '../../../interfaces/IMedicine';

interface IProps {
    openedModal?: string;
    openModal?: (modalName: string) => void;
    getAsyncStatus?: (key: string) => IAsyncStatus;
    editMedicine?: (medicine: IMedicine, data: IFormValues, image: File | string) => Promise<boolean>;
    modalPayload?: any;
}

@inject(({
    appState: {
        uiStore: {
            openedModal,
            openModal,
            modalPayload
        },
        departmentsStore: {
            editMedicine,
            getAsyncStatus
        }
    }
}) => ({
    getAsyncStatus,
    editMedicine,
    modalPayload,
    openedModal,
    openModal,
}))
@observer
class EditMedsModal extends Component<IProps> {
    @observable openSnackbar: boolean = false;
    @observable snackbarType: SNACKBAR_TYPE = SNACKBAR_TYPE.SUCCESS;

    @computed
    get isLoading(): boolean {
        return this.props.getAsyncStatus('addMedicine').loading;
    }

    closeHandler = () => this.props.openModal(null);

    snackbarCloseHandler = () => {
        this.openSnackbar = false;
    }

    submitHandler = async (image: File | string, data: IFormValues) => {
        const { editMedicine, modalPayload } = this.props;
        const medicineChanged = await editMedicine(modalPayload, data, image);
        this.openSnackbar = true;
        this.snackbarType = medicineChanged
            ? SNACKBAR_TYPE.SUCCESS
            : SNACKBAR_TYPE.ERROR;
    }

    render() {
        const { openedModal, modalPayload } = this.props;

        return (
            <>
                <MedsModal
                    open={openedModal === MEDICINE_EDIT_MODAL}
                    title='Редагувати препарат'
                    isLoading={this.isLoading}
                    onClose={this.closeHandler}
                    onSubmit={this.submitHandler}
                    defaultMedicine={modalPayload}
                />
                <Snackbar
                    open={!!this.openSnackbar}
                    onClose={this.snackbarCloseHandler}
                    type={this.snackbarType}
                    autoHideDuration={6000}
                    anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
                    message={
                        this.snackbarType === SNACKBAR_TYPE.SUCCESS
                        ? 'Медикамент успішно змінено'
                        : 'Неможливо змінити медикамент'
                    }
                />
            </>
        );
    }
}

export default EditMedsModal;
