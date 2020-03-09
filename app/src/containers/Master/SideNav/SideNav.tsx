import React, { Component } from 'react';
import { createStyles, WithStyles, Drawer, Button, Avatar, Badge, Tooltip } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import cx from 'classnames';
import { History, Location } from 'history';
import { matchPath, withRouter } from 'react-router-dom';
import { NotificationsNoneOutlined } from '@material-ui/icons';
import { IDepartment } from '../../../interfaces/IDepartment';

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
    history?: History;
    location?: Location;
    logout?: () => void;
    departments?: IDepartment[];
}

@inject(({
    appState: {
        userStore: {
            logout
        },
        departmentsStore: {
            departments
        }
    }
}) => ({
    logout,
    departments
}))
@withRouter
@observer
class SideNav extends Component<IProps> {
    get notificationsCount(): number {
        return 2;
    }

    isActive = (path: string): boolean => {
        const { history: { location: { pathname }}} = this.props;
        return !!matchPath(pathname, path);
    }

    createPath = (rootPath: string) => {
        const { location: { pathname } } = this.props;
        const delimiter = '/';

        const [, , ...rest] = pathname.split(delimiter);

        return [rootPath, ...rest].join(delimiter);
    }

    departmentClickHandler = (path: string) => () => this.props.history.push(this.createPath(path));

    render() {
        const { classes, logout, departments } = this.props;

        return (
            <Drawer classes={{ root: classes.root, paper: classes.paper }} variant='permanent'>
                    {
                        departments.map(({ id, name, image, path }) => (
                            <Tooltip key={id} placement='right' title={name}>
                                <Button
                                    onClick={this.departmentClickHandler(path)}
                                    className={cx(
                                        classes.iconWrapper,
                                        { active: this.isActive(path) }
                                    )}>
                                    <img src={image} className={classes.iconSm} />
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
