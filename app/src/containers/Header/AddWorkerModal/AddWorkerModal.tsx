import React, { Component } from 'react';
import { createStyles, WithStyles } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import WorkerModal from '../WorkerModal';
import { IAsyncStatus } from '../../../stores/AsyncStore';
import { computed } from 'mobx';

interface IProps {
    getAsyncStatus?: (key: string) => IAsyncStatus;
    openModal?: (modalName: string) => void;
    openedModal?: string;
}

@inject(({
    appState: {
        uiStore: {
            openedModal,
            openModal
        },
        departmentsStore: {
            getAsyncStatus,
        }
    }
}) => ({
    openedModal,
    openModal,
    getAsyncStatus,
}))
@observer
class AddWorkerModal extends Component<IProps> {
    @computed
    get isLoading(): boolean {
        return this.props.getAsyncStatus('').loading;
    }

    closeHandler = () => this.props.openModal(null);

    submitHandler = () => {
        console.log('submit');
    }

    render() {
        const { openedModal } = this.props;

        return (
            <WorkerModal
                open={true}
                isLoading={this.isLoading}
                onClose={this.closeHandler}
                onSubmit={this.submitHandler}
                title='Додати працівника'
            />
        );
    }
}

export default AddWorkerModal;
