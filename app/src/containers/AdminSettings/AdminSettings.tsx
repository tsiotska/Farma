import React, { Component } from 'react';
import { createStyles, withStyles, WithStyles, Grid, Tabs, Tab, Paper } from '@material-ui/core';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { ACCESS_SETTINGS_ROUTE, SETTINGS_ROUTE, USERS_SETTINGS_ROUTE } from '../../constants/Router';
import { NavLink, Link, matchPath, Route, Switch } from 'react-router-dom';
import { History } from 'history';
import AccessSettings from './AccessSettings';
import CommonSettings from './CommonSettings';
import UserSettings from './UserSettings';

const styles = (theme: any) => createStyles({
    paper: {
        padding: '30px 20px'
    },
    indicator: {
        backgroundColor: theme.palette.primary.blue
    },
    tabs: {
        minHeight: 0,
        marginBottom: '3vh'
    },
    tab: {
        fontSize: theme.typography.pxToRem(20),
        textTransform: 'capitalize',
        minHeight: 0,
        padding: '0 10px'
    },
});

interface IProps extends WithStyles<typeof styles> {
    history?: History;
}

enum SETTINGS_TAB {
    COMMON_SETTINGS,
    ACCESS_SETTINGS,
    USER_SETTINGS,
}

@observer
class AdminSettings extends Component<IProps> {
    readonly tabURLs: Record<SETTINGS_TAB, string> = {
        [SETTINGS_TAB.ACCESS_SETTINGS]: ACCESS_SETTINGS_ROUTE,
        [SETTINGS_TAB.USER_SETTINGS]: USERS_SETTINGS_ROUTE,
        [SETTINGS_TAB.COMMON_SETTINGS]: SETTINGS_ROUTE,
    };

    @observable tab: SETTINGS_TAB = SETTINGS_TAB.COMMON_SETTINGS;

    tabChangeHandler = (e: any, value: SETTINGS_TAB) => {
        this.tab = value;
    }

    componentDidMount() {
        const { history: { location} } = this.props;
        for (const [tab, path] of Object.entries(this.tabURLs)) {
            if (!!matchPath(location.pathname, { path, exact: true })) {
                this.tab = +tab;
                return;
            }
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <Paper className={classes.paper}>
                <Grid>
                    <Tabs
                        value={this.tab}
                        onChange={this.tabChangeHandler}
                        classes={{
                            root: classes.tabs,
                            indicator: classes.indicator
                        }}>
                        <Tab component={Link} className={classes.tab} to={SETTINGS_ROUTE} value={SETTINGS_TAB.COMMON_SETTINGS} label='Загальні налаштування' />
                        <Tab component={Link} className={classes.tab} to={ACCESS_SETTINGS_ROUTE} value={SETTINGS_TAB.ACCESS_SETTINGS} label='Права доступу' />
                        <Tab component={Link} className={classes.tab} to={USERS_SETTINGS_ROUTE} value={SETTINGS_TAB.USER_SETTINGS} label='Користувачі' />
                    </Tabs>
                    <Switch>
                        <Route path={USERS_SETTINGS_ROUTE} component={UserSettings} />
                        <Route path={ACCESS_SETTINGS_ROUTE} component={AccessSettings} />
                        <Route path={SETTINGS_ROUTE} component={CommonSettings} />
                    </Switch>
                </Grid>
            </Paper>
        );
    }
}

export default withStyles(styles)(AdminSettings);
