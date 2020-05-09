import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { computed, observable, toJS } from 'mobx';
import Dialog from '../../../components/Dialog';
import { EDIT_DEPOSIT_MODAL } from '../../../constants/Modals';
import { SNACKBAR_TYPE } from '../../../constants/Snackbars';
import { IAsyncStatus } from '../../../stores/AsyncStore';
import FormContent from './FormContent';
import { IDeposit } from '../../../interfaces/IDeposit';
import { createStyles, Grid, WithStyles } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import Snackbar from '../../../components/Snackbar';

export interface IDepositFormValue {
    deposit: string;
    message: string;
}

const styles = () => createStyles({
    content: {
        minWidth: 600
    }
});

interface IProps extends WithStyles<typeof styles> {
    isLoading?: boolean;
    openedModal?: string;
    openModal?: (modalName: string) => void;
    getAsyncStatus?: (key: string) => IAsyncStatus;
    loadDepositHistory?: () => any;
    insertDeposit?: (data: IDepositFormValue) => any;
}

@inject(({
             appState: {
                 uiStore: {
                     openedModal,
                     openModal,
                 },
                 departmentsStore: {
                     getAsyncStatus
                 },
                 userStore: {
                     loadDepositHistory,
                     insertDeposit
                 }
             }
         }) => ({
    openedModal,
    openModal,
    getAsyncStatus,
    loadDepositHistory,
    insertDeposit
}))
@observer
class EditDepositModal extends Component<IProps> {
    @observable isSnackbarOpen: boolean = false;
    @observable snackbarType: SNACKBAR_TYPE = SNACKBAR_TYPE.SUCCESS;
    @observable deposits: IDeposit[];

    async componentDidUpdate(prevProps: IProps) {
        const { openedModal: prevModal } = prevProps;
        const { loadDepositHistory, openedModal } = this.props;
        const becomeOpened = prevModal !== EDIT_DEPOSIT_MODAL && openedModal === EDIT_DEPOSIT_MODAL;
        if (becomeOpened) {
            this.deposits = await loadDepositHistory();
        }
    }

    @computed
    get isLoading(): boolean {
        //  return this.props.getAsyncStatus('insertDeposit').loading;
        return false;
    }

    closeHandler = () => this.props.openModal(null);

    snackbarCloseHandler = () => {
        this.isSnackbarOpen = false;
    }

    submitHandler = async (data: IDepositFormValue) => {
        const { insertDeposit } = this.props;
        const isInserted = await insertDeposit(data);
        this.isSnackbarOpen = true;
        this.snackbarType = isInserted
            ? SNACKBAR_TYPE.SUCCESS
            : SNACKBAR_TYPE.ERROR;
    }

    render() {
        const { openedModal, classes } = this.props;

        return (
            <>
                <Dialog
                    classes={{ content: classes.content }}
                    open={openedModal === EDIT_DEPOSIT_MODAL}
                    onClose={this.closeHandler}
                    maxWidth='md'>
                    <FormContent
                        deposits={this.deposits}
                        submitHandler={this.submitHandler}
                        isLoading={this.isLoading}
                    />
                </Dialog>

                <Snackbar
                    open={this.isSnackbarOpen}
                    onClose={this.snackbarCloseHandler}
                    type={this.snackbarType}
                    message={
                        this.snackbarType === SNACKBAR_TYPE.SUCCESS
                            ? 'Депозит внесено'
                            : 'Неможливо внести депозит'
                    }
                />
            </>
        );
    }
}

export default withStyles(styles)(EditDepositModal);
