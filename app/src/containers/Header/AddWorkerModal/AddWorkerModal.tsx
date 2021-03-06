import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import WorkerModal from '../WorkerModal';
import { IAsyncStatus } from '../../../stores/AsyncStore';
import { computed, observable } from 'mobx';
import { ADD_WORKER_MODAL } from '../../../constants/Modals';
import { IPosition } from '../../../interfaces/IPosition';
import { IWorkerModalValues } from '../WorkerModal/WorkerModal';
import { SNACKBAR_TYPE } from '../../../constants/Snackbars';
import Snackbar from '../../../components/Snackbar';

interface IProps {
    showLocationsBlock: boolean;
    getAsyncStatus?: (key: string) => IAsyncStatus;
    openModal?: (modalName: string) => void;
    openedModal?: string;
    modalPayload?: IPosition[];
    positions?: Map<number, IPosition>;
    createWorker?: (values: IWorkerModalValues, avatar: File, departmentId?: number) => Promise<boolean>;
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
            positions,
            createWorker
        }
    }
}) => ({
    openedModal,
    openModal,
    getAsyncStatus,
    positions,
    modalPayload,
    createWorker
}))
@observer
class AddWorkerModal extends Component<IProps> {
    @observable showSnackbar: boolean = false;
    @observable snackbarType: SNACKBAR_TYPE = SNACKBAR_TYPE.SUCCESS;

    @computed
    get isLoading(): boolean {
        return this.props.getAsyncStatus('createWorker').loading;
    }

    @computed
    get isOpen(): boolean {
        return this.props.openedModal === ADD_WORKER_MODAL;
    }

    @computed
    get positions(): IPosition[] {
        const { modalPayload, positions } = this.props;
        return (this.isOpen && Array.isArray(modalPayload))
            ? modalPayload
            : [...positions.values()];
    }

    closeHandler = () => this.props.openModal(null);

    snackbarCloseHandler = () => {
        this.showSnackbar = false;
    }

    submitHandler = async (data: IWorkerModalValues, image: File | string) => {
        const { createWorker } = this.props;
        const workerCreated = await createWorker(
            data,
            typeof image === 'string'
                ? null
                : image
        );
        this.showSnackbar = true;
        this.snackbarType = workerCreated
            ? SNACKBAR_TYPE.SUCCESS
            : SNACKBAR_TYPE.ERROR;
        if (workerCreated) this.closeHandler();
    }

    render() {
        const { showLocationsBlock } = this.props;

        return (
            <>
                <WorkerModal
                    open={this.isOpen}
                    isLoading={this.isLoading}
                    onClose={this.closeHandler}
                    onSubmit={this.submitHandler}
                    title='???????????? ????????????????????'
                    positions={this.positions}
                    showLocationsBlock={showLocationsBlock}
                />
                <Snackbar
                    open={this.showSnackbar}
                    type={this.snackbarType}
                    onClose={this.snackbarCloseHandler}
                    message={
                        this.snackbarType === SNACKBAR_TYPE.SUCCESS
                        ? '?????????????????? ?????????????? ??????????????????'
                        : '???????????????? ???????????????????? ?????????????????? '
                    }
                />
            </>
        );
    }
}

export default AddWorkerModal;
