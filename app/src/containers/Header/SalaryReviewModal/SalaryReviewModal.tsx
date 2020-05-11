import React, { Component } from 'react';
import {
    withStyles,
    createStyles,
    WithStyles,
    Grid,
    Typography,
    Popover,
    SnackbarOrigin,
    IconButton
} from '@material-ui/core';
import { observer, inject, } from 'mobx-react';
import Dialog from '../../../components/Dialog';
import { SALARY_PREVIEW_MODAL } from '../../../constants/Modals';
import ProfilePreview from '../../../components/ProfilePreview';
import UserShortInfo from '../../../components/UserShortInfo';
import { IUser } from '../../../interfaces';
import { toJS, observable, computed } from 'mobx';
import UserContent from './UserContent';
import { ISalaryInfo } from '../../../interfaces/ISalaryInfo';
import { USER_ROLE } from '../../../constants/Roles';
import SalaryHeader from './SalaryHeader';
import { SNACKBAR_TYPE } from '../../../constants/Snackbars';
import Snackbar from '../../../components/Snackbar';
import DateSelect from '../../../components/DateSelect';
import { Add, ArrowLeft, ArrowRight } from '@material-ui/icons';
import TabItem from '../../Marks/Marks';

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
});

interface IProps extends WithStyles<typeof styles> {
    user?: IUser;
    openedModal?: string;
    userSalary?: Map<number, ISalaryInfo>;
    openModal?: (modalName: string) => void;
    loadUserSalaryInfo?: (user: IUser, year: number, month: number) => void;
    submitSalaryChanges?: () => boolean;
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
    @observable anchorEl: any = false;

    handleClick = (event: React.FormEvent<EventTarget>): void => {
        this.anchorEl = this.anchorEl ? null : event.currentTarget;
    }

    closeDateWindow = (): void => {
        this.anchorEl = null;
    }

    @computed
    get open() {
        return Boolean(this.anchorEl);
    }

    @computed
    get id() {
        return this.anchorEl ? 'simple-popper' : undefined;
    }

    yearChangeHandler = (value: number) => {
        this.year = value;
    }

    monthChangeHandler = (value: number) => {
        this.month = value;
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
        const { submitSalaryChanges } = this.props;
        const updatedSuccessfully = await submitSalaryChanges();
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
                <Typography className={classes.headerText} variant='h5'>
                    Заробітня плата
                </Typography>

                <Grid container alignItems='center'>
                    <IconButton
                        disabled
                        className={classes.iconButton}>
                        <ArrowLeft fontSize='small' />
                    </IconButton>
                    <IconButton
                        onClick={this.handleClick}
                       /* disabled={this.isSalesLoading || this.isSalesLoading}*/
                        className={classes.iconButton}>
                        <Add fontSize='small' />
                    </IconButton>
                    <IconButton
                        disabled
                        className={classes.iconButton}>
                        <ArrowRight fontSize='small' />
                    </IconButton>
                </Grid>

                <Popover
                    id={this.id}
                    open={this.open}
                    anchorEl={this.anchorEl}
                    onClose={this.closeDateWindow}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <DateSelect
                        year={this.year}
                        month={this.month}
                        changeYear={this.yearChangeHandler}
                        changeMonth={this.monthChangeHandler}
                    />
                </Popover>

                <SalaryHeader levelsCount={this.levelsCount}/>
                <UserContent
                    levelsCount={this.levelsCount}
                    user={user}
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
                            ? 'Дані успішно оновленно'
                            : 'Оновити дані не вдалося'
                    }
                />
            </Dialog>
        );
    }
}

export default withStyles(styles)(SalaryReviewModal);
