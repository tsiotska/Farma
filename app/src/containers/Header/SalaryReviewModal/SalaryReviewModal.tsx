import React, { Component } from 'react';
import { withStyles, createStyles, WithStyles, Grid, Typography } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import Dialog from '../../../components/Dialog';
import { SALARY_PREVIEW_MODAL } from '../../../constants/Modals';
import ProfilePreview from '../../../components/ProfilePreview';
import UserShortInfo from '../../../components/UserShortInfo';
import { IUser } from '../../../interfaces';
import { toJS } from 'mobx';
import UserContent from './UserContent';

const styles = createStyles({
    header: {
        minWidth: 800
    }
});

interface IProps extends WithStyles<typeof styles> {
    user?: IUser;
    openedModal?: string;
    openModal?: (modalName: string) => void;
}

@inject(({
    appState: {
        uiStore: {
            modalPayload: user,
            openedModal,
            openModal
        }
    }
}) => ({
    openedModal,
    openModal,
    user
}))
@observer
class SalaryReviewModal extends Component<IProps> {
    closeHandler = () => this.props.openModal(null);

    render() {
        const { openedModal, user, classes } = this.props;

        return (
            <Dialog
                maxWidth='lg'
                open={openedModal === SALARY_PREVIEW_MODAL}
                onClose={this.closeHandler}>
                    <Grid className={classes.header} container>
                        <Grid xs container item wrap='nowrap'>
                            <UserShortInfo user={user} />
                        </Grid>
                    </Grid>
                    <Typography variant='h5'>
                        Заробітня плата
                    </Typography>
                    <UserContent />
            </Dialog>
        );
    }
}

export default withStyles(styles)(SalaryReviewModal);
