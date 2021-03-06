import React, { Component } from 'react';
import {
    withStyles,
    createStyles,
    WithStyles,
    Grid,
    Typography,
} from '@material-ui/core';
import { observer, inject, } from 'mobx-react';
import Dialog from '../../../components/Dialog';
import { SALARY_PREVIEW_MODAL } from '../../../constants/Modals';
import UserShortInfo from '../../../components/UserShortInfo';
import { IUser } from '../../../interfaces';
import { toJS, observable } from 'mobx';
import UserContent from './UserContent';
import { ISalaryInfo } from '../../../interfaces/ISalaryInfo';
import { USER_ROLE } from '../../../constants/Roles';
import SalaryHeader from './SalaryHeader';
import { SNACKBAR_TYPE } from '../../../constants/Snackbars';
import Snackbar from '../../../components/Snackbar';
import DateSelectPopper from '../../../components/DateSelectPopper';
import LoadingMask from '../../../components/LoadingMask';

const styles = createStyles({
    header: {
        minWidth: 800
    },
    headerText: {
        margin: '20px 0'
    },
    snackbar: {
        position: 'fixed'
    },
    iconButton: {
        borderRadius: 2,
        minHeight: 64
    },
    titleContainer: {
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center'
    }
});

interface IProps extends WithStyles<typeof styles> {
    user?: IUser;
    openedModal?: string;
    userSalary?: Map<number, ISalaryInfo>;
    openModal?: (modalName: string) => void;
    loadUserSalaryInfo?: (user: IUser, year: number, month: number) => void;
    submitSalaryChanges?: (user: IUser) => boolean;
}

@inject(({
             appState: {
                 userStore: {
                     loadUserSalaryInfo,
                     userSalary,
                     submitSalaryChanges
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
    user,
    submitSalaryChanges
}))
@observer
class SalaryReviewModal extends Component<IProps> {
    @observable isOpen: boolean = false;
    @observable isSalesLoading: boolean = false;
    @observable snackbar: SNACKBAR_TYPE = null;
    @observable showSnackbar: boolean = false;
    @observable year: number = new Date().getFullYear();
    @observable month: number = new Date().getMonth();

    yearChangeHandler = (value: number) => {
        this.year = value;
    }

    monthChangeHandler = (value: number) => {
        this.month = value;
    }

    applyHandler = async () => {
        const { user, loadUserSalaryInfo } = this.props;
        this.isSalesLoading = true;
        await loadUserSalaryInfo(user, this.year, this.month);
        this.isSalesLoading = false;
    }

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

    snackbarCloseHandler = () => {
        this.showSnackbar = false;
    }

    submitHandler = async () => {
        const { submitSalaryChanges, user } = this.props;
        const updatedSuccessfully = await submitSalaryChanges(user);
        this.snackbar = await updatedSuccessfully
            ? SNACKBAR_TYPE.SUCCESS
            : SNACKBAR_TYPE.ERROR;
        this.showSnackbar = true;
    }

    async componentDidUpdate(prevProps: IProps) {
        const { openedModal: prevModal } = prevProps;
        const { openedModal, user, loadUserSalaryInfo } = this.props;
        const becomeOpen = prevModal !== SALARY_PREVIEW_MODAL && openedModal === SALARY_PREVIEW_MODAL;
        const userExist = !!user;
        if (becomeOpen && userExist) {
            this.isOpen = true;
            this.isSalesLoading = true;
            await loadUserSalaryInfo(user, this.year, this.month);
            this.isSalesLoading = false;
        }
    }

    render() {
        const { user, classes, userSalary } = this.props;
        return (
            <Dialog
                maxWidth='lg'
                open={this.isOpen}
                onClose={this.closeHandler}>
                <Grid className={classes.header} container>
                    <Grid xs container item wrap='nowrap'>
                        <UserShortInfo user={user} disableClick disableText/>
                    </Grid>
                </Grid>
                <Grid className={classes.titleContainer}>
                    <Typography className={classes.headerText} variant='h5'>
                        ?????????????????? ??????????
                    </Typography>
                    <DateSelectPopper
                        year={this.year}
                        month={this.month}
                        applyHandler={this.applyHandler}
                        changeMonth={this.monthChangeHandler}
                        changeYear={this.yearChangeHandler}
                    />
                    {
                        this.isSalesLoading &&
                        <LoadingMask size={20}/>
                    }
                </Grid>
                <SalaryHeader levelsCount={this.levelsCount}/>
                <UserContent
                    levelsCount={this.levelsCount}
                    previewUser={user}
                    salary={userSalary}
                    onSubmit={this.submitHandler}
                />
                <Snackbar
                    open={this.showSnackbar}
                    onClose={this.snackbarCloseHandler}
                    type={this.snackbar || SNACKBAR_TYPE.SUCCESS}
                    classes={{ root: classes.snackbar }}
                    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                    autoHideDuration={6000}
                    message={
                        this.snackbar === SNACKBAR_TYPE.SUCCESS
                            ? '???????? ?????????????? ??????????????????'
                            : '?????????????? ???????? ???? ??????????????'
                    }
                />
            </Dialog>
        );
    }
}

export default withStyles(styles)(SalaryReviewModal);
