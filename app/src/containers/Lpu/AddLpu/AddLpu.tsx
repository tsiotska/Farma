import React, { Component } from 'react';
import { createStyles, WithStyles } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import LpuModal from '../LpuModal';
import { computed, observable } from 'mobx';
import { IAsyncStatus } from '../../../stores/AsyncStore';
import { ADD_LPU_MODAL } from '../../../constants/Modals';
import Snackbar from '../../../components/Snackbar';
import { SNACKBAR_TYPE } from '../../../constants/Snackbars';
import { ILpuModalValues } from '../LpuModal/LpuModal';

const styles = (theme: any) => createStyles({});

interface IProps extends WithStyles<typeof styles> {
    getAsyncStatus?: (key: string) => IAsyncStatus;
    openModal?: (modalName: string) => void;
    openedModal?: string;
    addLpu?: (data: ILpuModalValues) => Promise<boolean> ;
}

@inject(({
    appState: {
        uiStore: {
            openedModal,
            openModal
        },
        departmentsStore: {
            getAsyncStatus,
            addLpu
        }
    }
}) => ({
    openedModal,
    openModal,
    getAsyncStatus,
    addLpu
}))
@observer
class AddLpu extends Component<IProps> {
    @observable openSnackbar: boolean = false;
    @observable snackbarType: SNACKBAR_TYPE = SNACKBAR_TYPE.SUCCESS;

    @computed
    get isLoading(): boolean {
        return this.props.getAsyncStatus('').loading;
    }

    snackbarCloseHandler = () => {
        this.openSnackbar = false;
    }

    closeHandler = () => this.props.openModal(null);

    submitHandler = async (formValues: ILpuModalValues) => {
        const { addLpu } = this.props;
        const lpuCreated = await addLpu(formValues);
        this.openSnackbar = true;
        this.snackbarType = !!lpuCreated
            ? SNACKBAR_TYPE.SUCCESS
            : SNACKBAR_TYPE.ERROR;
    }

    render() {
        const { openedModal } = this.props;

        return (
            <>
            <LpuModal
                open={openedModal === ADD_LPU_MODAL}
                isLoading={this.isLoading}
                onClose={this.closeHandler}
                onSubmit={this.submitHandler}
                title='Додати ЛПУ'
            />
            <Snackbar
                open={!!this.openSnackbar}
                onClose={this.snackbarCloseHandler}
                type={this.snackbarType}
                autoHideDuration={6000}
                anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
                message={
                    this.snackbarType === SNACKBAR_TYPE.SUCCESS
                    ? 'ЛПУ успішно створено'
                    : 'Неможливо додати ЛПУ'
                }
            />
            </>
        );
    }
}

export default withStyles(styles)(AddLpu);
