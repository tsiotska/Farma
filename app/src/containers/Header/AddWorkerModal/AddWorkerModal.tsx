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
    positions?: Map<number, IPosition>;
}

@inject(({
    appState: {
        uiStore: {
            openedModal,
            openModal
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
    positions
}))
@observer
class AddWorkerModal extends Component<IProps> {
    @computed
    get isLoading(): boolean {
        return this.props.getAsyncStatus('').loading;
    }

    @computed
    get positions(): IPosition[] {
        const res: IPosition[] = [];

        this.props.positions.forEach(x => {
            res.push(x);
        });

        return res;
    }

    closeHandler = () => this.props.openModal(null);

    submitHandler = () => {
        console.log('submit');
    }

    render() {
        const { openedModal } = this.props;

        return (
            <WorkerModal
                open={openedModal === ADD_WORKER_MODAL}
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
