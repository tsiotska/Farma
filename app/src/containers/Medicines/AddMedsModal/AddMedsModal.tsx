import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, computed, toJS } from 'mobx';
import { ADD_MEDICINE_MODAL } from '../../../constants/Modals';
import { IAsyncStatus } from '../../../stores/AsyncStore';
import { SNACKBAR_TYPE } from '../../../constants/Snackbars';
import Snackbar from '../../../components/Snackbar';
import { IFormValues } from '../FormContent/FormContent';
import MedsModal from '../MedsModal';

interface IProps {
    openedModal?: string;
    openModal?: (modalName: string) => void;
    getAsyncStatus?: (key: string) => IAsyncStatus;
    addMedicine?: (data: IFormValues, image: File) => boolean;
}

@inject(({
    appState: {
        uiStore: {
            openedModal,
            openModal,
        },
        departmentsStore: {
            addMedicine,
            getAsyncStatus
        }
    }
}) => ({
    openedModal,
    openModal,
    getAsyncStatus,
    addMedicine,
}))
@observer
class AddMedsModal extends Component<IProps> {
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

    submitHandler = async (image: File, data: IFormValues) => {
        const { addMedicine } = this.props;
        const medicineAdded = await addMedicine(data, image);
        this.openSnackbar = true;
        this.snackbarType = medicineAdded
            ? SNACKBAR_TYPE.SUCCESS
            : SNACKBAR_TYPE.ERROR;
    }

    render() {
        const { openedModal } = this.props;

        return (
            <>
                <MedsModal
                    open={openedModal === ADD_MEDICINE_MODAL}
                    title='Додати препарат'
                    isLoading={this.isLoading}
                    onClose={this.closeHandler}
                    onSubmit={this.submitHandler}
                />
                <Snackbar
                    open={!!this.openSnackbar}
                    onClose={this.snackbarCloseHandler}
                    type={this.snackbarType}
                    autoHideDuration={6000}
                    anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
                    message={
                        this.snackbarType === SNACKBAR_TYPE.SUCCESS
                        ? 'Медикамент успішно додано'
                        : 'Неможливо додати медикамент'
                    }
                />
            </>
        );
    }
}

export default AddMedsModal;
