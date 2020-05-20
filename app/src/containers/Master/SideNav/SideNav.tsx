import React, { Component } from 'react';
import { createStyles, WithStyles, Drawer, Button, Avatar, Badge } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import cx from 'classnames';
import { History, Location } from 'history';
import { withRouter, matchPath } from 'react-router-dom';
import { NotificationsNoneOutlined, Add } from '@material-ui/icons';
import { IDepartment } from '../../../interfaces/IDepartment';
import Config from '../../../../Config';
import { IUser, IWithRestriction } from '../../../interfaces';
import { USER_ROLE, singleDepartmentRoles, multiDepartmentRoles } from '../../../constants/Roles';
import { toJS, computed } from 'mobx';
import SideNavButton from '../SideNavButton';
import { ADMIN_ROUTE, SALES_ROUTE, NOTIFICATIONS_ROUTE } from '../../../constants/Router';
import { ADD_DEPARTMENT_MODAL } from '../../../constants/Modals';
import DateRangeModal from '../../Sales/DateRangeModal';
import HomeIcon from '-!react-svg-loader!../../../../assets/icons/home.svg';
import logOutIcon from '../../../../assets/icons/logout.png';
import { withRestriction } from '../../../components/hoc/withRestriction';
import { PERMISSIONS } from '../../../constants/Permissions';

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
    },
    active: {
        backgroundColor: theme.palette.primary.green.main,
        '&:hover': {
            backgroundColor: theme.palette.primary.green.main,
        }
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
        width: 70,
        height: 70,
        borderRadius: 0,
        margin: '8px auto',
        '&.marginTopAuto': {
            marginTop: 'auto'
        }
    },
    avatar: {
        width: 50,
        height: 50
    },
    logoutIcon: {
        width: 22,
        height: 24
    }
});

interface IProps extends WithStyles<typeof styles>, IWithRestriction {
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
    notificationsCount?: number;
}

@inject(({
    appState: {
        userStore: {
            user,
            logout,
            isAdmin,
            renewHistory,
            clearHistory,
            notificationsCount
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
    openModal,
    notificationsCount
}))
@withRouter
@withRestriction([ PERMISSIONS.ADD_BRANCH ])
@observer
class SideNav extends Component<IProps> {
    @computed
    get userRole(): USER_ROLE {
        const { user } = this.props;
        return user
        ? user.position
        : USER_ROLE.UNKNOWN;
    }

    @computed
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

    @computed
    get isHomeRouteActive(): boolean {
        const { history: { location: { pathname }} } = this.props;
        return !!matchPath(pathname, ADMIN_ROUTE);
    }

    @computed
    get isNotificationsRouteActive(): boolean {
        const { history: { location: { pathname }} } = this.props;
        return !!matchPath(pathname, NOTIFICATIONS_ROUTE);
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

    notificationsClickHandler = () => {
        const { history, setCurrentDepartment } = this.props;
        history.push(NOTIFICATIONS_ROUTE);
        setCurrentDepartment(null);
    }

    render() {
        const {
            classes,
            logout,
            isAdmin,
            notificationsCount,
            isAllowed
        } = this.props;

        return (
            <Drawer classes={{ root: classes.root, paper: classes.paper }} variant='permanent'>
                {
                    isAdmin &&
                    <SideNavButton
                        className={cx(
                            classes.iconWrapper,
                            { [classes.active]: this.isHomeRouteActive }
                        )}
                        clickHandler={this.homeClickHandler}
                        disabled={false}
                        tooltip='home'>
                            <HomeIcon />
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
                                { [classes.active]: this.isActive(department.id) }
                            )}>
                            <img src={`${Config.ASSETS_URL}/${department.image}`} className={classes.iconSm} />
                        </SideNavButton>
                    ))
                }
                {
                    isAllowed &&
                    <SideNavButton clickHandler={this.addDepartmentClickHandler} className={classes.iconWrapper}>
                        <Add className={classes.iconSm}/>
                    </SideNavButton>
                }
                <Button onClick={this.notificationsClickHandler} className={cx(classes.action, { marginTopAuto: true, [classes.active]: this.isNotificationsRouteActive })}>
                    <Badge badgeContent={this.isNotificationsRouteActive ? 0 : notificationsCount} color='error'>
                        <NotificationsNoneOutlined />
                    </Badge>
                </Button>
                <Button onClick={logout} className={classes.action}>
                    <img className={classes.logoutIcon} src={logOutIcon} />
                </Button>
                <DateRangeModal />
            </Drawer>
        );
    }
}

export default withStyles(styles)(SideNav);
