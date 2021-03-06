import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import LpuModal from '../LpuModal';
import { computed, observable } from 'mobx';
import { IAsyncStatus } from '../../../stores/AsyncStore';
import { ADD_LPU_MODAL } from '../../../constants/Modals';
import Snackbar from '../../../components/Snackbar';
import { SNACKBAR_TYPE } from '../../../constants/Snackbars';
import { ILpuModalValues } from '../LpuModal/LpuModal';

interface IProps {
    getAsyncStatus?: (key: string) => IAsyncStatus;
    openModal?: (modalName: string) => void;
    openedModal?: string;
    addLpu?: (data: ILpuModalValues) => Promise<boolean>;
    types: string[];
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
        return this.props.getAsyncStatus('addLpu').loading;
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
        if (lpuCreated) this.closeHandler();
    }

    render() {
        const { openedModal, types } = this.props;

        return (
            <>
            <LpuModal
                types={types}
                open={openedModal === ADD_LPU_MODAL}
                isLoading={this.isLoading}
                onClose={this.closeHandler}
                onSubmit={this.submitHandler}
                title='???????????? ??????'
            />
            <Snackbar
                open={!!this.openSnackbar}
                onClose={this.snackbarCloseHandler}
                type={this.snackbarType}
                autoHideDuration={6000}
                anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
                message={
                    this.snackbarType === SNACKBAR_TYPE.SUCCESS
                    ? '?????? ?????????????? ????????????????'
                    : '?????????????????? ???????????? ??????'
                }
            />
            </>
        );
    }
}

export default AddLpu;
