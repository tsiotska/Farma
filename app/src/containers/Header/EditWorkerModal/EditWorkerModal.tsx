import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { IAsyncStatus } from '../../../stores/AsyncStore';
import { IWorker } from '../../../interfaces/IWorker';
import { IPosition } from '../../../interfaces/IPosition';
import { EDIT_WORKER_MODAL } from '../../../constants/Modals';
import { computed, toJS, observable } from 'mobx';
import WorkerModal from '../WorkerModal';
import { IWorkerModalValues } from '../WorkerModal/WorkerModal';
import { SNACKBAR_TYPE } from '../../../constants/Snackbars';
import Snackbar from '../../../components/Snackbar';

interface IProps {
    showLocationsBlock: boolean;
    getAsyncStatus?: (key: string) => IAsyncStatus;
    openModal?: (modalName: string) => void;
    openedModal?: string;
    modalPayload?: {
        initialWorker: IWorker,
        positions: IPosition[],
    };
    editWorker?: (initialWorker: IWorker, values: IWorkerModalValues, newAvatar: File | string) => boolean;
}

@inject(({
    appState: {
        uiStore: {
            openedModal,
            modalPayload,
            openModal
        },
        departmentsStore: {
            getAsyncStatus,
            editWorker
        }
    }
}) => ({
    openedModal,
    modalPayload,
    getAsyncStatus,
    openModal,
    editWorker
}))
@observer
class EditWorkerModal extends Component<IProps> {
    @observable showSnackbar: boolean = false;
    @observable snackbarType: SNACKBAR_TYPE = SNACKBAR_TYPE.SUCCESS;

    @computed
    get isLoading(): boolean {
        return this.props.getAsyncStatus('editWorker').loading;
    }

    @computed
    get isOpen(): boolean {
        const { openedModal, modalPayload } = this.props;
        if (!modalPayload) return false;
        const { initialWorker, positions } = modalPayload;
        return openedModal === EDIT_WORKER_MODAL
            && !!initialWorker
            && Array.isArray(positions);
    }

    @computed
    get positions(): IPosition[] {
        const { modalPayload } = this.props;
        if (!this.isOpen) return [];
        const { positions } = modalPayload;
        return positions || [];
    }

    @computed
    get initialWorker(): IWorker {
        const { modalPayload } = this.props;
        if (!this.isOpen) return null;
        return modalPayload
            ? modalPayload.initialWorker || null
            : null;
    }

    closeHandler = () => this.props.openModal(null);

    snackbarCloseHandler = () => {
        this.showSnackbar = false;
    }

    submitHandler = async (data: IWorkerModalValues, image: File) => {
        if (!this.initialWorker) return;
        const { editWorker } = this.props;
        const isEdited = await editWorker(this.initialWorker, data, image);
        this.snackbarType = isEdited
            ? SNACKBAR_TYPE.SUCCESS
            : SNACKBAR_TYPE.ERROR;
        this.showSnackbar = true;
        if (isEdited) this.closeHandler();
    }

    render() {
        const { showLocationsBlock,  } = this.props;

        return (
            <>
                <WorkerModal
                    open={this.isOpen}
                    isLoading={this.isLoading}
                    onClose={this.closeHandler}
                    onSubmit={this.submitHandler}
                    title='Редагувати працівника'
                    positions={this.positions}
                    initialWorker={this.initialWorker}
                    showLocationsBlock={showLocationsBlock}
                />
                <Snackbar
                    message={
                        this.snackbarType === SNACKBAR_TYPE.SUCCESS
                            ? 'Дані працівника успішно змінені'
                            : 'Не вдалося змінити дані працівника'
                    }
                    open={this.showSnackbar}
                    type={this.snackbarType}
                    onClose={this.snackbarCloseHandler}
                />
            </>
        );
    }
}

export default EditWorkerModal;
