import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles, createStyles, WithStyles } from '@material-ui/core';
import Dialog from '../../../components/Dialog';
import { ADD_DEPARTMENT_MODAL } from '../../../constants/Modals';

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
class AddDepartmentModal extends Component<IProps> {
    closeHandler = () => this.props.openModal(null);

    render() {
        const { openedModal } = this.props;

        return (
            <Dialog
                open={openedModal === ADD_DEPARTMENT_MODAL}
                onClose={this.closeHandler}
                title='Додати відділення'>
                    modal
            </Dialog>
        );
    }
}

export default withStyles(styles)(AddDepartmentModal);
