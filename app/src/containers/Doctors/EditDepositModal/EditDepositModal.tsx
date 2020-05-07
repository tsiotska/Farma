import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { computed, observable } from 'mobx';
import Dialog from '../../../components/Dialog';
import { EDIT_DEPOSIT_MODAL } from '../../../constants/Modals';
import { SNACKBAR_TYPE } from '../../../constants/Snackbars';
import { IAsyncStatus } from '../../../stores/AsyncStore';
import FormContent from './FormContent';

interface IProps {
    isLoading?: boolean;
    openedModal?: string;
    openModal?: (modalName: string) => void;
    getAsyncStatus?: (key: string) => IAsyncStatus;
}

@inject(({
             appState: {
                 uiStore: {
                     openedModal,
                     openModal,
                 },
                 departmentsStore: {
                     getAsyncStatus
                 }
             }
         }) => ({
    openedModal,
    openModal,
    getAsyncStatus
}))
@observer
class EditDepositModal extends Component<IProps> {
    @observable openSnackbar: boolean = false;
    @observable snackbarType: SNACKBAR_TYPE = SNACKBAR_TYPE.SUCCESS;

    @computed
    get isLoading(): boolean {
    //  return this.props.getAsyncStatus('changedDeposit').loading;
        return false;
    }

    closeHandler = () => this.props.openModal(null);

    snackbarCloseHandler = () => {
        this.openSnackbar = false;
    }

    submitHandler = async (data: any) => { // DepositInterface
        /*const { changeDeposit } = this.props;
        const changedDeposit = await changeDeposit(data);
        this.openSnackbar = true;
        this.snackbarType = changedDeposit
            ? SNACKBAR_TYPE.SUCCESS
            : SNACKBAR_TYPE.ERROR; */
    }

    render() {
        const { openedModal } = this.props;

        return (
            <Dialog
                open={openedModal === EDIT_DEPOSIT_MODAL}
                onClose={this.closeHandler}
                maxWidth='md'>
                <FormContent
                    submitHandler={this.submitHandler}
                    isLoading={this.isLoading}
                />
            </Dialog>
        );
    }
}

export default EditDepositModal;
