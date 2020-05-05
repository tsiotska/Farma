import React, { Component } from 'react';
import { createStyles, WithStyles } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IAsyncStatus } from '../../../stores/AsyncStore';
import { observable, computed } from 'mobx';
import { SNACKBAR_TYPE } from '../../../constants/Snackbars';
import PharmacyModal, { IPharmacyModalValues } from '../PharmacyModal/PharmacyModal';
import { ADD_PHARMACY_MODAL } from '../../../constants/Modals';
import Snackbar from '../../../components/Snackbar';

interface IProps {
    getAsyncStatus?: (key: string) => IAsyncStatus;
    openModal?: (modalName: string) => void;
    openedModal?: string;
    addPharmacy?: (data: any) => boolean;
}

@inject(({
    appState: {
        uiStore: {
            openModal,
            openedModal
        },
        departmentsStore: {
            getAsyncStatus,
            addPharmacy
        }
    }
}) => ({
    getAsyncStatus,
    openModal,
    openedModal,
    addPharmacy,
}))
@observer
class AddPharmacy extends Component<IProps> {
    @observable openSnackbar: boolean = false;
    @observable snackbarType: SNACKBAR_TYPE = SNACKBAR_TYPE.SUCCESS;

    @computed
    get isLoading(): boolean {
        return this.props.getAsyncStatus('addPharmacy').loading;
    }

    snackbarCloseHandler = () => {
        this.openSnackbar = false;
    }

    closeHandler = () => this.props.openModal(null);

    submitHandler = async (formValues: IPharmacyModalValues) => {
        const { addPharmacy } = this.props;
        const lpuCreated = await addPharmacy(formValues);
        this.openSnackbar = true;
        this.snackbarType = !!lpuCreated
            ? SNACKBAR_TYPE.SUCCESS
            : SNACKBAR_TYPE.ERROR;
        if (lpuCreated) this.closeHandler();
    }

    render() {
        const { openedModal } = this.props;

        return (
            <>
                <PharmacyModal
                    open={openedModal === ADD_PHARMACY_MODAL}
                    isLoading={this.isLoading}
                    title='Створити аптеку'
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
                        ? 'Аптека успішно створена'
                        : 'Неможливо створити аптеку'
                    }
                />
            </>
        );
    }
}

export default AddPharmacy;
