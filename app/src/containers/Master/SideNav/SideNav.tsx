import React, { Component } from 'react';
import { createStyles, WithStyles, Drawer, Button, Avatar, Badge } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import cx from 'classnames';
import { CARDIO_ROUTE, UROLOGY_ROUTE } from '../../../constants/Router';
import { History, Location } from 'history';
import { matchPath, withRouter } from 'react-router-dom';
import { NotificationsNoneOutlined } from '@material-ui/icons';

const icon1 = 'https://d1icd6shlvmxi6.cloudfront.net/gsc/FKRQBC/08/ad/eb/08adeb97a686426db061c14be4043b30/images/продажи_ффм/u601.png?token=52fd231568d5d927c3a5ed262c8a973dde2ee4b52aa51617b46689c6ac62bc46';
const icon2 = 'https://d1icd6shlvmxi6.cloudfront.net/gsc/FKRQBC/08/ad/eb/08adeb97a686426db061c14be4043b30/images/продажи_ффм/u603.png?token=8a4621afb78e8c4b61907fb0fb79950502a0cea0900594c2bff19095e9ad08fc';

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
}

@withRouter
@observer
class SideNav extends Component<IProps> {
    get isUrologyRoute(): boolean {
        const { history: { location: { pathname }}} = this.props;
        return !!matchPath(pathname, UROLOGY_ROUTE);
    }

    get isCardioRoute(): boolean {
        const { history: { location: { pathname }}} = this.props;
        return !!matchPath(pathname, CARDIO_ROUTE);
    }

    get notificationsCount(): number {
        return 2;
    }

    createPath = (rootPath: string) => {
        const { location: { pathname } } = this.props;
        const delimiter = '/';

        const [, , ...rest] = pathname.split(delimiter);

        return [rootPath, ...rest].join(delimiter);
    }

    urologyClickHandler = () => this.props.history.push(this.createPath(UROLOGY_ROUTE));

    cardioClickHandler = () => this.props.history.push(this.createPath(CARDIO_ROUTE));

    render() {
        const { classes } = this.props;

        return (
            <Drawer
                classes={{
                    root: classes.root,
                    paper: classes.paper
                }}
                variant='permanent'>
                    <Button onClick={this.urologyClickHandler} className={cx(classes.iconWrapper, { active: this.isUrologyRoute })}>
                        <img src={icon1} className={classes.iconSm} />
                    </Button>
                    <Button onClick={this.cardioClickHandler} className={cx(classes.iconWrapper, { active: this.isCardioRoute })}>
                        <img src={icon2} className={classes.iconMd} />
                    </Button>

                    <Button className={cx(classes.action, { marginTopAuto: true })}>
                        <Badge badgeContent={4} color='error'>
                            <NotificationsNoneOutlined />
                        </Badge>
                    </Button>
                    <Button className={classes.action}>
                        <Avatar className={classes.avatar}>L</Avatar>
                    </Button>
                    <Button className={classes.action}>
                        Out
                    </Button>
            </Drawer>
        );
    }
}

export default withStyles(styles)(SideNav);
