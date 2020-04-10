import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import withTranslation from '../../components/hoc/withTranslations';

import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { AppBar, Typography, Paper, IconButton } from '@material-ui/core';
import { History } from 'history';
import ProfilePreview from '../../components/ProfilePreview';
import DepartmentNav from '../../components/DepartmentNav';
import { IDepartment } from '../../interfaces/IDepartment';
import { IUser } from '../../interfaces';
import SalaryReviewModal from './SalaryReviewModal';
import { IRoleContent } from '../Master/Master';
import { NAVIGATION_ROUTES, SALES_ROUTE, ADMIN_ROUTE, SETTINGS_ROUTE } from '../../constants/Router';
import { Route, matchPath } from 'react-router-dom';
import Settings from '-!react-svg-loader!../../../assets/icons/settings.svg';

const styles = (theme: any) => createStyles({
    root: {
        flexDirection: 'row',
        height: 70,
        display: 'flex',
        alignItems: 'center',
        padding: 20,
        textTransform: 'capitalize'
    },
    navContainer: {
        height: 128,
        position: 'relative',
        overflow: 'hidden'
    },
    settingsButton: {
        marginLeft: 'auto',
        padding: 6
    }
});

interface IProps extends WithStyles<typeof styles> {
    history?: History;
    currentDepartment?: IDepartment;
    navHistory?: IUser[];
    isAdmin?: boolean;
}

@inject(({
    appState: {
        departmentsStore: {
            currentDepartment
        },
        userStore: {
            navHistory,
            isAdmin
        }
    }
}) => ({
    currentDepartment,
    navHistory,
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

    get showSettingsBtn(): boolean {
        const { history: { location: {pathname}} } = this.props;
        return !!matchPath(pathname, ADMIN_ROUTE);
    }

    get title(): string {
        return this.departmentName || 'Адмін панель';
    }

    settingsClickHandler = () => this.props.history.push(SETTINGS_ROUTE);

    render() {
        const { classes, navHistory,  } = this.props;

        return (
            <>
                <AppBar
                    elevation={0}
                    color='primary'
                    position='relative'
                    className={classes.root}>
                    <Typography variant='h5'>
                        { this.title }
                    </Typography>
                    {
                        this.showSettingsBtn &&
                        <IconButton onClick={this.settingsClickHandler} className={classes.settingsButton}>
                            <Settings width={22} height={22} />
                        </IconButton>
                    }
                </AppBar>
                {
                    navHistory.length !== 0 &&
                    <div className={classes.navContainer}>
                    {
                        navHistory.map((user, i, arr) => (
                            <ProfilePreview
                                key={user.id}
                                user={user}
                                index={i}
                                scaleIndex={arr.length - i - 1}
                            />
                        ))
                    }
                    </div>
                }
                <SalaryReviewModal />
            </>
        );
    }
}

export default withStyles(styles)(Header);
