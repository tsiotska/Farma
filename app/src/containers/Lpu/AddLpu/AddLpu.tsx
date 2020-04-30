import React, { Component } from 'react';
import { createStyles, WithStyles } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import LpuModal from '../LpuModal';
import { computed } from 'mobx';
import { IAsyncStatus } from '../../../stores/AsyncStore';
import { ADD_LPU_MODAL } from '../../../constants/Modals';

const styles = (theme: any) => createStyles({});

interface IProps extends WithStyles<typeof styles> {
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
            getAsyncStatus
        }
    }
}) => ({
    openedModal,
    openModal,
    getAsyncStatus
}))
@observer
class AddLpu extends Component<IProps> {
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
            <LpuModal
                open={openedModal === ADD_LPU_MODAL}
                isLoading={this.isLoading}
                onClose={this.closeHandler}
                onSubmit={this.submitHandler}
                title='Додати ЛПУ'
            />
        );
    }
}

export default withStyles(styles)(AddLpu);
