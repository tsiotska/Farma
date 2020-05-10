import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { AppBar, Typography, IconButton } from '@material-ui/core';
import { IDepartment } from '../../interfaces/IDepartment';
import SalaryReviewModal from './SalaryReviewModal';
import { ADMIN_ROUTE, SETTINGS_ROUTE, SETTINGS_ROUTES, DEPARTMENT_ROUTE, NOTIFICATIONS_ROUTE } from '../../constants/Router';
import { matchPath, RouteComponentProps } from 'react-router-dom';
import Settings from '-!react-svg-loader!../../../assets/icons/settings.svg';
import { computed } from 'mobx';
import { ArrowBack } from '@material-ui/icons';
import cx from 'classnames';
import AddWorkerModal from './AddWorkerModal';
import EditWorkerModal from './EditWorkerModal';

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
        padding: 6
    },
    title: {
        display: 'flex',
        alignItems: 'center'
    },
    backButton: {
        marginRight: 5,
        borderRadius: 2
    }
});

interface IProps extends WithStyles<typeof styles>, RouteComponentProps<any> {
    currentDepartment?: IDepartment;
    isAdmin?: boolean;
}

@inject(({
    appState: {
        departmentsStore: {
            currentDepartment
        },
        userStore: {
            isAdmin
        }
    }
}) => ({
    currentDepartment,
    isAdmin
}))
@observer
export class Header extends Component<IProps, {}> {
    @computed
    get departmentName(): string {
        const { currentDepartment } = this.props;
        return currentDepartment
        ? currentDepartment.name
        : null;
    }

    @computed
    get showSettingsBtn(): boolean {
        const { history: { location: {pathname}} } = this.props;
        return !!matchPath(pathname, {
            path: ADMIN_ROUTE,
            exact: true
        });
    }

    @computed
    get isSettingsRoute(): boolean {
        // get showBackButton(): boolean {
        const { history: { location: { pathname }}} = this.props;
        return SETTINGS_ROUTES.some(route => !!matchPath(pathname, route));
    }

    @computed
    get title(): string {
        const { history: { location: { pathname }}} = this.props;
        if (!!matchPath(pathname, DEPARTMENT_ROUTE)) return this.departmentName;
        if (!!matchPath(pathname, ADMIN_ROUTE)) return 'Адмін панель';
        if (!!matchPath(pathname, NOTIFICATIONS_ROUTE)) return 'Сповіщення';
        return null;
    }

    settingsClickHandler = () => this.props.history.push(SETTINGS_ROUTE);

    backClickHandler = () => this.props.history.push(ADMIN_ROUTE);

    render() {
        const { classes } = this.props;

        return (
            <>
                <AppBar
                    elevation={0}
                    color='primary'
                    position='relative'
                    className={classes.root}>
                    <Typography className={classes.title} variant='h5'>
                        {
                            this.isSettingsRoute &&
                            <IconButton onClick={this.backClickHandler} className={cx(classes.backButton, classes.settingsButton)}>
                                <ArrowBack width={22} height={22} />
                            </IconButton>
                        }
                        { this.title }
                    </Typography>
                    {
                        this.showSettingsBtn &&
                        <IconButton onClick={this.settingsClickHandler} className={classes.settingsButton}>
                            <Settings width={22} height={22} />
                        </IconButton>
                    }
                </AppBar>
                <SalaryReviewModal />
                <AddWorkerModal showLocationsBlock={!this.isSettingsRoute} />
                <EditWorkerModal  showLocationsBlock={!this.isSettingsRoute} />
            </>
        );
    }
}

export default withStyles(styles)(Header);
