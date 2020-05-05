import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { IAsyncStatus } from '../../../stores/AsyncStore';
import { IWorker } from '../../../interfaces/IWorker';
import { IPosition } from '../../../interfaces/IPosition';
import { EDIT_WORKER_MODAL } from '../../../constants/Modals';
import { computed, toJS } from 'mobx';
import WorkerModal from '../WorkerModal';
import { IWorkerModalValues } from '../WorkerModal/WorkerModal';

interface IProps {
    showLocationsBlock: boolean;
    getAsyncStatus?: (key: string) => IAsyncStatus;
    openModal?: (modalName: string) => void;
    openedModal?: string;
    modalPayload?: {
        initialWorker: IWorker,
        positions: IPosition[],
    };
}

@inject(({
    appState: {
        uiStore: {
            openedModal,
            modalPayload,
            openModal
        },
        departmentsStore: {
            getAsyncStatus
        }
    }
}) => ({
    openedModal,
    modalPayload,
    getAsyncStatus,
    openModal
}))
@observer
class EditWorkerModal extends Component<IProps> {
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

    // @computed
    // get showLocationsBlock(): boolean {
    //     const { modalPayload } = this.props;
    //     return !!modalPayload && 'showLocationsBlock' in modalPayload
    //         ? modalPayload.showLocationsBlock
    //         : false;
    // }

    closeHandler = () => this.props.openModal(null);

    submitHandler = async (data: IWorkerModalValues, image: File) => {
        console.log('submit');
    }

    render() {
        const { modalPayload, showLocationsBlock } = this.props;
        // console.log(toJS(modalPayload));

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
            </>
        );
    }
}

export default EditWorkerModal;
