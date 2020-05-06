import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import LpuModal from '../LpuModal';
import { computed, observable, toJS } from 'mobx';
import { IAsyncStatus } from '../../../stores/AsyncStore';
import { ADD_LPU_MODAL, EDIT_LPU_MODAL } from '../../../constants/Modals';
import Snackbar from '../../../components/Snackbar';
import { SNACKBAR_TYPE } from '../../../constants/Snackbars';
import { ILpuModalValues } from '../LpuModal/LpuModal';
import { ILPU } from '../../../interfaces/ILPU';

interface IProps {
    types: string[];
    getAsyncStatus?: (key: string) => IAsyncStatus;
    openModal?: (modalName: string) => void;
    openedModal?: string;
    editLpu?: (initialLpu: ILPU, data: ILpuModalValues) => Promise<boolean>;
    modalPayload?: ILPU;
}

@inject(({
    appState: {
        uiStore: {
            openedModal,
            openModal,
            modalPayload
        },
        departmentsStore: {
            getAsyncStatus,
            editLpu
        }
    }
}) => ({
    openedModal,
    openModal,
    getAsyncStatus,
    modalPayload,
    editLpu
}))
@observer
class EditLpu extends Component<IProps> {
    @observable openSnackbar: boolean = false;
    @observable snackbarType: SNACKBAR_TYPE = SNACKBAR_TYPE.SUCCESS;

    @computed
    get isLoading(): boolean {
        return this.props.getAsyncStatus('editLpu').loading;
    }

    snackbarCloseHandler = () => {
        this.openSnackbar = false;
    }

    closeHandler = () => this.props.openModal(null);

    submitHandler = async (formValues: ILpuModalValues) => {
        const { editLpu, modalPayload } = this.props;
        const lpuEdited = await editLpu(modalPayload, formValues);
        this.openSnackbar = true;
        this.snackbarType = !!lpuEdited
            ? SNACKBAR_TYPE.SUCCESS
            : SNACKBAR_TYPE.ERROR;
        if (lpuEdited) this.closeHandler();
    }

    render() {
        const { openedModal, modalPayload, types } = this.props;

        return (
            <>
            <LpuModal
                types={types}
                open={openedModal === EDIT_LPU_MODAL}
                isLoading={this.isLoading}
                onClose={this.closeHandler}
                onSubmit={this.submitHandler}
                title='Редагувати ЛПУ'
                initialLpu={modalPayload}
            />
            <Snackbar
                open={!!this.openSnackbar}
                onClose={this.snackbarCloseHandler}
                type={this.snackbarType}
                autoHideDuration={6000}
                anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
                message={
                    this.snackbarType === SNACKBAR_TYPE.SUCCESS
                    ? 'ЛПУ успішно змінено'
                    : 'Неможливо змінити ЛПУ'
                }
            />
            </>
        );
    }
}

export default EditLpu;
