import React, { Component } from 'react';
import { createStyles, WithStyles } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import WorkerModal from '../WorkerModal';
import { IAsyncStatus } from '../../../stores/AsyncStore';
import { computed } from 'mobx';
import { ADD_WORKER_MODAL } from '../../../constants/Modals';
import { IPosition } from '../../../interfaces/IPosition';

interface IProps {
    getAsyncStatus?: (key: string) => IAsyncStatus;
    openModal?: (modalName: string) => void;
    openedModal?: string;
    modalPayload?: IPosition[];
    positions?: Map<number, IPosition>;
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
            positions
        }
    }
}) => ({
    openedModal,
    openModal,
    getAsyncStatus,
    positions,
    modalPayload
}))
@observer
class AddWorkerModal extends Component<IProps> {
    @computed
    get isLoading(): boolean {
        return this.props.getAsyncStatus('').loading;
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

    submitHandler = () => {
        console.log('submit');
    }

    render() {
        return (
            <WorkerModal
                open={this.isOpen}
                isLoading={this.isLoading}
                onClose={this.closeHandler}
                onSubmit={this.submitHandler}
                title='Додати працівника'
                positions={this.positions}
            />
        );
    }
}

export default AddWorkerModal;
