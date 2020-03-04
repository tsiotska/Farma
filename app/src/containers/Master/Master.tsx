import React from 'react';
import { Component } from 'react';
import { observer } from 'mobx-react';
import { Route, Router, Switch, Redirect } from 'react-router-dom';
import { History } from 'history';
import { createStyles, WithStyles, withStyles } from '@material-ui/core';

import {
    NAVIGATION_ROUTES,
    CARDIO_ROUTE,
    UROLOGY_ROUTE,
    ROOT_ROUTE
} from '../../constants/Router';

import Header from '../Header';
import SideNav from './SideNav';
import Cardio from '../Cardio';
import Urology from '../Urology';
import ProfilePreview from '../../components/ProfilePreview';

const styles = (theme: any) => createStyles({
    root: {
        minHeight: '100vh',
        backgroundColor: theme.palette.primary.main,
        display: 'flex',
        justifyContent: 'center',
    },
    contentWrapper: {
        width: '100%',
        maxWidth: 1220,
        [`@media (max-width:${ theme.breakpoints.width('lg') +  theme.overrides.MuiDrawer.paper.width + 5}px)`]: {
            maxWidth: 'none',
            marginLeft: theme.overrides.MuiDrawer.paper.width,
        }
    },
});

interface IProps extends WithStyles<typeof styles> {
    initialHistory: History;
}

@observer
export class Master extends Component<IProps, null> {
    render() {
        const { classes, initialHistory } = this.props;

        return (
            <main className={classes.root}>
                <Router history={initialHistory}>
                    <div className={classes.contentWrapper}>
                            <Route path={NAVIGATION_ROUTES} component={Header} />
                            <Route path={NAVIGATION_ROUTES} component={ProfilePreview} />
                            <Switch>
                                <Route path={UROLOGY_ROUTE} component={Urology} />
                                <Route path={CARDIO_ROUTE} component={Cardio} />
                                <Route path={ROOT_ROUTE} render={() => <Redirect to={UROLOGY_ROUTE} />} />
                            </Switch>
                    </div>
                    <SideNav />
                </Router>
            </main>
        );
    }
}

export default withStyles(styles)(Master);
