import React, { Component } from 'react';
import { createStyles, WithStyles } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IAsyncStatus } from '../../../stores/AsyncStore';
import { observable, computed } from 'mobx';
import { SNACKBAR_TYPE } from '../../../constants/Snackbars';
import PharmacyModal, { IPharmacyModalValues } from '../PharmacyModal/PharmacyModal';
import Snackbar from '../../../components/Snackbar';
import { EDIT_PHARMACY_MODAL } from '../../../constants/Modals';
import { ILPU } from '../../../interfaces/ILPU';

const styles = (theme: any) => createStyles({});

interface IProps extends WithStyles<typeof styles> {
    getAsyncStatus?: (key: string) => IAsyncStatus;
    openModal?: (modalName: string) => void;
    openedModal?: string;
    editPharmacy?: (initialPharmacy: ILPU, data: any) => boolean;
    modalPayload?: ILPU;
}

@inject(({
    appState: {
        uiStore: {
            openModal,
            openedModal,
            modalPayload
        },
        departmentsStore: {
            getAsyncStatus,
            editPharmacy
        }
    }
}) => ({
    getAsyncStatus,
    openModal,
    openedModal,
    editPharmacy,
    modalPayload
}))
@observer
class EditPharmacy extends Component<IProps> {
    @observable openSnackbar: boolean = false;
    @observable snackbarType: SNACKBAR_TYPE = SNACKBAR_TYPE.SUCCESS;

    @computed
    get isLoading(): boolean {
        return this.props.getAsyncStatus('editPharmacy').loading;
    }

    snackbarCloseHandler = () => {
        this.openSnackbar = false;
    }

    closeHandler = () => this.props.openModal(null);

    submitHandler = async (formValues: IPharmacyModalValues) => {
        const { editPharmacy, modalPayload } = this.props;
        const pharmacyEdited = await editPharmacy(modalPayload, formValues);
        this.openSnackbar = true;
        this.snackbarType = !!pharmacyEdited
            ? SNACKBAR_TYPE.SUCCESS
            : SNACKBAR_TYPE.ERROR;
        if (pharmacyEdited) this.closeHandler();
    }

    render() {
        const { openedModal, modalPayload } = this.props;

        return (
            <>
                <PharmacyModal
                    open={openedModal === EDIT_PHARMACY_MODAL && !!modalPayload}
                    isLoading={this.isLoading}
                    title='Редагувати аптеку'
                    onClose={this.closeHandler}
                    onSubmit={this.submitHandler}
                    initialPharmacy={modalPayload}
                />
                <Snackbar
                    open={!!this.openSnackbar}
                    onClose={this.snackbarCloseHandler}
                    type={this.snackbarType}
                    autoHideDuration={6000}
                    anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
                    message={
                        this.snackbarType === SNACKBAR_TYPE.SUCCESS
                        ? 'Аптека успішно відредагована'
                        : 'Неможливо редагувати аптеку'
                    }
                />
            </>
        );
    }
}

export default withStyles(styles)(EditPharmacy);
