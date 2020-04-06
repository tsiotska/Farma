import React, { Component } from 'react';
import { createStyles, WithStyles, Drawer, Button, Avatar, Badge } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import cx from 'classnames';
import { History, Location } from 'history';
import { withRouter, matchPath } from 'react-router-dom';
import { NotificationsNoneOutlined, HomeOutlined, Add } from '@material-ui/icons';
import { IDepartment } from '../../../interfaces/IDepartment';
import Config from '../../../../Config';
import { IUser } from '../../../interfaces';
import { USER_ROLE, singleDepartmentRoles, multiDepartmentRoles } from '../../../constants/Roles';
import { toJS } from 'mobx';
import SideNavButton from '../SideNavButton';
import { ADMIN_ROUTE, SALES_ROUTE } from '../../../constants/Router';
import { ADD_DEPARTMENT_MODAL } from '../../../constants/Modals';
import DateRangeModal from '../../Sales/DateRangeModal';

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
    isAdmin?: boolean;
    history?: History;
    location?: Location;
    logout?: () => void;
    departments?: IDepartment[];
    currentDepartmentId?: number;
    setCurrentDepartment?: (value: number | string | IDepartment) => void;
    renewHistory?: (ffm: IUser) => void;
    clearHistory?: () => void;
    openModal?: (modalName: string) => void;
}

@inject(({
    appState: {
        userStore: {
            user,
            logout,
            isAdmin,
            renewHistory,
            clearHistory
        },
        departmentsStore: {
            departments,
            setCurrentDepartment,
            currentDepartmentId
        },
        uiStore: {
            openModal
        }
    }
}) => ({
    user,
    logout,
    isAdmin,
    departments,
    setCurrentDepartment,
    currentDepartmentId,
    renewHistory,
    clearHistory,
    openModal
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

    get isHomeRouteActive(): boolean {
        const { history: { location: { pathname }} } = this.props;
        return !!matchPath(pathname, ADMIN_ROUTE);
    }

    get notificationsCount(): number {
        return 2;
    }

    isActive = (id: number): boolean => {
        const { currentDepartmentId } = this.props;

        return currentDepartmentId === id;
    }

    departmentClickHandler = ({ id, ffm }: IDepartment) => () => {
        const {
            history,
            isAdmin,
            setCurrentDepartment,
            renewHistory,
            currentDepartmentId
        } = this.props;

        if (id === currentDepartmentId) return;

        history.push(SALES_ROUTE.replace(':departmentId', `${id}`));
        setCurrentDepartment(id);
        if (isAdmin) renewHistory(ffm);
    }

    addDepartmentClickHandler = () => this.props.openModal(ADD_DEPARTMENT_MODAL);

    homeClickHandler = () => {
        const { history, clearHistory, setCurrentDepartment } = this.props;
        setCurrentDepartment(null);
        clearHistory();
        history.push(ADMIN_ROUTE);
    }

    render() {
        const { classes, logout, isAdmin } = this.props;

        return (
            <Drawer classes={{ root: classes.root, paper: classes.paper }} variant='permanent'>
                {
                    isAdmin &&
                    <SideNavButton
                        className={cx(
                            classes.iconWrapper,
                            { active: this.isHomeRouteActive }
                        )}
                        clickHandler={this.homeClickHandler}
                        disabled={false}
                        tooltip='home'>
                            <HomeOutlined className={classes.iconSm} fontSize='small' />
                    </SideNavButton>
                }
                {
                    this.userDepartments.map(department => (
                        <SideNavButton
                            key={department.id}
                            clickHandler={this.departmentClickHandler(department)}
                            disabled={isAdmin && !department.ffm}
                            tooltip={department.name}
                            className={cx(
                                classes.iconWrapper,
                                { active: this.isActive(department.id) }
                            )}>
                            <img src={`${Config.ASSETS_URL}/${department.image}`} className={classes.iconSm} />
                        </SideNavButton>
                    ))
                }
                {
                    isAdmin &&
                    <SideNavButton clickHandler={this.addDepartmentClickHandler} className={classes.iconWrapper}>
                        <Add className={classes.iconSm} fontSize='small' />
                    </SideNavButton>
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
                <DateRangeModal />
            </Drawer>
        );
    }
}

export default withStyles(styles)(SideNav);
