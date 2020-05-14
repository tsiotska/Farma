import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { AppBar, Typography, IconButton, Grid } from '@material-ui/core';
import { computed } from 'mobx';
import { ArrowBack, EditOutlined, DeleteOutlined } from '@material-ui/icons';
import { matchPath, RouteComponentProps } from 'react-router-dom';
import cx from 'classnames';

import { IDepartment } from '../../interfaces/IDepartment';
import SalaryReviewModal from './SalaryReviewModal';
import {
    ADMIN_ROUTE,
    SETTINGS_ROUTE,
    SETTINGS_ROUTES,
    DEPARTMENT_ROUTE,
    NOTIFICATIONS_ROUTE
} from '../../constants/Router';
import Settings from '-!react-svg-loader!../../../assets/icons/settings.svg';

import AddWorkerModal from './AddWorkerModal';
import EditWorkerModal from './EditWorkerModal';
import Search from './Search';
import { IDeletePopoverSettings } from '../../stores/UIStore';
import DeletePopover from '../../components/DeletePopover';
import EditDepartmentModal from './EditDeparmentModal';
import { EDIT_DEPARTMENT_MODAL } from '../../constants/Modals';

const styles = (theme: any) => createStyles({
    root: {
        flexDirection: 'row',
        height: 70,
        display: 'flex',
        alignItems: 'center',
        padding: 20,
        textTransform: 'capitalize'
    },
    settingsButton: {
        marginLeft: 'auto',
    },
    title: {
        display: 'flex',
        alignItems: 'center'
    },
    backButton: {
        marginRight: 5,
        borderRadius: 2
    },
    iconButton: {
        padding: 6
    }
});

interface IProps extends WithStyles<typeof styles>, RouteComponentProps<any> {
    currentDepartment?: IDepartment;
    isAdmin?: boolean;
    openModal?: (modalName: string, payload: any) => void;
    openDelPopper?: (settings: IDeletePopoverSettings) => void;
}

@inject(({
    appState: {
        departmentsStore: {
            currentDepartment
        },
        userStore: {
            isAdmin
        },
        uiStore: {
            openDelPopper,
            openModal
        }
    }
}) => ({
    currentDepartment,
    openDelPopper,
    openModal,
    isAdmin
}))
@observer
export class Header extends Component<IProps, {}> {
    get departmentName(): string {
        const { currentDepartment } = this.props;
        return currentDepartment
            ? currentDepartment.name
            : null;
    }

    get isAdminRoute(): boolean {
        const { history: { location: {pathname}} } = this.props;
        return !!matchPath(pathname, {
            path: ADMIN_ROUTE,
            exact: true
        });
    }

    get isSettingsRoute(): boolean {
        const { history: { location: { pathname }}} = this.props;
        return SETTINGS_ROUTES.some(route => !!matchPath(pathname, route));
    }

    get isDepartmentRoute(): boolean {
        const { history: { location: { pathname }}} = this.props;
        return !!matchPath(pathname, DEPARTMENT_ROUTE);
    }

    get title(): string {
        const { history: { location: { pathname }}} = this.props;
        if (this.isDepartmentRoute) return this.departmentName;
        if (!!matchPath(pathname, ADMIN_ROUTE)) return 'Адмін панель';
        if (!!matchPath(pathname, NOTIFICATIONS_ROUTE)) return 'Сповіщення';
        return null;
    }

    editClickHandler = () => {
        const { openModal, currentDepartment } = this.props;
        openModal(EDIT_DEPARTMENT_MODAL, currentDepartment);
    }

    settingsClickHandler = () => this.props.history.push(SETTINGS_ROUTE);

    backClickHandler = () => this.props.history.push(ADMIN_ROUTE);

    deleteConfirmHandler = (confirmed: boolean) => {
        console.log('should delete: ', confirmed);
        this.props.openDelPopper(null);
    }

    deleteClickHandler = ({ currentTarget }: any) => this.props.openDelPopper({
        anchorEl: currentTarget,
        callback: this.deleteConfirmHandler,
        name: 'deleteDepartment'
    })

    render() {
        const { classes } = this.props;

        return (
            <>
                <AppBar
                    elevation={0}
                    color='primary'
                    position='relative'
                    className={classes.root}>
                        <Grid container alignItems='center'>
                            <Grid xs container item>
                                <Typography className={classes.title} variant='h5'>
                                    {
                                        this.isSettingsRoute &&
                                        <IconButton onClick={this.backClickHandler} className={cx(classes.backButton, classes.settingsButton)}>
                                            <ArrowBack width={22} height={22} />
                                        </IconButton>
                                    }
                                    { this.title }
                                </Typography>
                            </Grid>
                            <Grid xs={8} item>
                                <Search />
                            </Grid>
                            <Grid xs container item>
                                {
                                    this.isAdminRoute &&
                                    <IconButton onClick={this.settingsClickHandler} className={cx(classes.iconButton, classes.settingsButton)}>
                                        <Settings width={22} height={22} />
                                    </IconButton>
                                }
                                {
                                    this.isDepartmentRoute && <>
                                        <IconButton
                                            onClick={this.editClickHandler}
                                            className={cx(classes.iconButton, classes.settingsButton)}>
                                            <EditOutlined fontSize='small' />
                                        </IconButton>
                                        <IconButton onClick={this.deleteClickHandler} className={cx(classes.iconButton)}>
                                            <DeleteOutlined fontSize='small' />
                                        </IconButton>
                                    </>
                                }
                            </Grid>
                    </Grid>
                </AppBar>
                <SalaryReviewModal />
                <AddWorkerModal showLocationsBlock={!this.isSettingsRoute} />
                <EditWorkerModal showLocationsBlock={!this.isSettingsRoute} />
                <EditDepartmentModal />
                <DeletePopover
                    name='deleteDepartment'
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                />
            </>
        );
    }
}

export default withStyles(styles)(Header);
