import React, { Component } from 'react';
import { createStyles, WithStyles, Drawer, Button, Avatar, Badge, Tooltip } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import cx from 'classnames';
import { History, Location } from 'history';
import { withRouter } from 'react-router-dom';
import { NotificationsNoneOutlined } from '@material-ui/icons';
import { IDepartment } from '../../../interfaces/IDepartment';
import Config from '../../../../Config';
import { IUser } from '../../../interfaces';
import { USER_ROLE, singleDepartmentRoles, multiDepartmentRoles } from '../../../constants/Roles';

const styles = (theme: any) => createStyles({
    root: {
        flexShrink: 0,
    },
    paper: {
        boxSizing: 'content-box',
        backgroundColor: theme.palette.primary.white,
        borderRight: '1px solid #d7d7d7'
    },
    iconWrapper: {
        width: 70,
        height: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 0,
        minHeight: 0,
        borderRadius: 0,
        '&.active': {
            backgroundColor: theme.palette.primary.green.main
        },
    },
    iconSm: {
        width: 36,
        height: 36
    },
    iconMd: {
        width: 46,
        height: 46
    },
    action: {
        boxSizing: 'content-box',
        minWidth: 0,
        padding: 0,
        width: 50,
        height: 50,
        margin: '8px auto',
        '&.marginTopAuto': {
            marginTop: 'auto'
        }
    },
    avatar: {
        width: 50,
        height: 50
    },
});

interface IProps extends WithStyles<typeof styles> {
    user?: IUser;
    history?: History;
    location?: Location;
    logout?: () => void;
    departments?: IDepartment[];
    currentDepartment?: IDepartment;
    setCurrentDepartment?: (value: string | IDepartment) => void;
}

@inject(({
    appState: {
        userStore: {
            user,
            logout
        },
        departmentsStore: {
            departments,
            setCurrentDepartment,
            currentDepartment
        }
    }
}) => ({
    user,
    logout,
    departments,
    setCurrentDepartment,
    currentDepartment
}))
@withRouter
@observer
class SideNav extends Component<IProps> {
    get userRole(): USER_ROLE {
        const { user } = this.props;
        return user
        ? user.position
        : USER_ROLE.UNKNOWN;
    }

    get userDepartments(): IDepartment[] {
        const { departments, user } = this.props;

        const userDep = user
        ? user.department
        : null;

        if (multiDepartmentRoles.includes(this.userRole)) {
            return departments;
        }
        if (singleDepartmentRoles.includes(this.userRole)) {
            return departments.filter(({ id }) => id === userDep);
        }
        return [];
    }

    get notificationsCount(): number {
        return 2;
    }

    isActive = (name: string): boolean => {
        const { currentDepartment } = this.props;

        return currentDepartment
        ? currentDepartment.name === name
        : false;
    }

    departmentClickHandler = (name: string) => () => this.props.setCurrentDepartment(name);

    componentDidUpdate() {
        const { currentDepartment, setCurrentDepartment } = this.props;

        if (currentDepartment || !this.userDepartments.length) return;

        setCurrentDepartment(this.userDepartments[0]);
    }

    render() {
        const { classes, logout } = this.props;

        return (
            <Drawer classes={{ root: classes.root, paper: classes.paper }} variant='permanent'>
                    {
                        this.userDepartments.map(({ id, name, image }) => (
                            <Tooltip key={id} placement='right' title={name}>
                                <Button
                                    onClick={this.departmentClickHandler(name)}
                                    className={cx(
                                        classes.iconWrapper,
                                        { active: this.isActive(name) }
                                    )}>
                                    <img src={`${Config.ASSETS_URL}/${image}`} className={classes.iconSm} />
                                </Button>
                            </Tooltip>
                        ))
                    }

                    <Button className={cx(classes.action, { marginTopAuto: true })}>
                        <Badge badgeContent={this.notificationsCount} color='error'>
                            <NotificationsNoneOutlined />
                        </Badge>
                    </Button>
                    <Button className={classes.action}>
                        <Avatar className={classes.avatar}>L</Avatar>
                    </Button>
                    <Button onClick={logout} className={classes.action}>
                        Out
                    </Button>
            </Drawer>
        );
    }
}

export default withStyles(styles)(SideNav);
