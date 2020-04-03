import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import withTranslation from '../../components/hoc/withTranslations';

import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { AppBar, Typography, Paper } from '@material-ui/core';
import { History } from 'history';
import ProfilePreview from '../../components/ProfilePreview';
import DepartmentNav from '../../components/DepartmentNav';
import { IDepartment } from '../../interfaces/IDepartment';
import { IUser } from '../../interfaces';

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
    }
});

interface IProps extends WithStyles<typeof styles> {
    t?: (key: string) => string;
    history?: History;
    currentDepartment?: IDepartment;
    navHistory?: IUser[];
    isAdmin?: boolean;
}

@withTranslation
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

    get title(): string {
        const { isAdmin } = this.props;

        return isAdmin
        ? 'Адмін панель'
        : this.departmentName;
    }

    render() {
        const { classes, navHistory } = this.props;

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
                <DepartmentNav />
            </>
        );
    }
}

export default withStyles(styles)(Header);
