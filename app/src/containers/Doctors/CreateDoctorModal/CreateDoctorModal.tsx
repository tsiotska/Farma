import React, { Component } from 'react';
import { createStyles, WithStyles } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { computed } from 'mobx';
import DoctorModal from '../DoctorModal';
import { CREATE_DOC_MODAL } from '../../../constants/Modals';
import { ILPU } from '../../../interfaces/ILPU';

const styles = (theme: any) => createStyles({});

interface IProps extends WithStyles<typeof styles> {
    openedModal?: string;
    openModal?: (modalName: string) => void;
}

@inject(({
    appState: {
        uiStore: {
            openedModal,
            openModal
        }
    }
}) => ({
    openedModal,
    openModal
}))
@observer
class CreateDoctorModal extends Component<IProps> {
    @computed
    get isOpen(): boolean {
        return this.props.openedModal === CREATE_DOC_MODAL;
    }

    @computed
    get isLoading(): boolean {
        return false;
    }

    closeHandler = () => this.props.openModal(null);

    submitHandler = () => {
        console.log('submit');
    }

    render() {
        return (
            <DoctorModal
                open={this.isOpen}
                isLoading={this.isLoading}
                onClose={this.closeHandler}
                onSubmit={this.submitHandler}
                title='Додати лікаря'
            />
        );
    }
}

export default withStyles(styles)(CreateDoctorModal);
