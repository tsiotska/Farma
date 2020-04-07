import React, { Component } from 'react';
import { withStyles, createStyles, WithStyles, Grid, Typography } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import Dialog from '../../../components/Dialog';
import { SALARY_PREVIEW_MODAL } from '../../../constants/Modals';
import ProfilePreview from '../../../components/ProfilePreview';
import UserShortInfo from '../../../components/UserShortInfo';
import { IUser } from '../../../interfaces';
import { toJS, observable } from 'mobx';
import UserContent from './UserContent';
import { ISalaryInfo } from '../../../interfaces/ISalaryInfo';
import { USER_ROLE } from '../../../constants/Roles';

const styles = createStyles({
    header: {
        minWidth: 800
    }
});

interface IProps extends WithStyles<typeof styles> {
    user?: IUser;
    openedModal?: string;
    openModal?: (modalName: string) => void;
    loadUserSalaryInfo?: (user: IUser) => void;
    userSalary?: Map<number, ISalaryInfo>;
}

@inject(({
    appState: {
        userStore: {
            loadUserSalaryInfo,
            userSalary
        },
        uiStore: {
            modalPayload: user,
            openedModal,
            openModal
        }
    }
}) => ({
    loadUserSalaryInfo,
    userSalary,
    openedModal,
    openModal,
    user
}))
@observer
class SalaryReviewModal extends Component<IProps> {
    @observable isOpen: boolean = false;

    get levelsCount() {
        const { user } = this.props;
        if (!user) return 0;
        return user.position === USER_ROLE.MEDICAL_AGENT
        ? 5
        : 3;
    }

    closeHandler = () => {
        this.isOpen = false;
        setTimeout(
            () => this.props.openModal(null),
            300
        );
    }

    componentDidUpdate(prevProps: IProps) {
        const { openedModal: prevModal } = prevProps;
        const { openedModal, user, loadUserSalaryInfo } = this.props;
        const becomeOpen = prevModal !== SALARY_PREVIEW_MODAL && openedModal === SALARY_PREVIEW_MODAL;
        const userExist = !!user;
        if (becomeOpen && userExist) {
            this.isOpen = true;
            loadUserSalaryInfo(user);
        }
    }

    render() {
        const { user, classes, userSalary } = this.props;
        console.log(toJS(userSalary));

        return (
            <Dialog
                maxWidth='lg'
                open={this.isOpen}
                onClose={this.closeHandler}>
                    <Grid className={classes.header} container>
                        <Grid xs container item wrap='nowrap'>
                            <UserShortInfo user={user} disableClick />
                        </Grid>
                    </Grid>
                    <Typography variant='h5'>
                        Заробітня плата
                    </Typography>
                    <UserContent levelsCount={this.levelsCount} user={user} salary={userSalary} />
            </Dialog>
        );
    }
}

export default withStyles(styles)(SalaryReviewModal);
