import React from 'react';
import { Component } from 'react';
import { observer } from 'mobx-react';
import { Router, Route } from 'react-router-dom';
import { History } from 'history';
import { createStyles, WithStyles, withStyles } from '@material-ui/core';

import { NAVIGATION_ROUTES, LOGIN_ROUTE } from '../../constants/Router';

import Header from '../Header';
import SideNav from './SideNav';
import PrivateRoute from '../../components/PrivateRoute';
import DepartmentContent from '../DepartmentContent';
import Login from '../Login';

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
                        <Route path={LOGIN_ROUTE} component={Login} />
                        <PrivateRoute
                            path={NAVIGATION_ROUTES}
                            component={Header}
                            loadingPlaceholder={() => <p>Loading...</p>}
                        />
                        <DepartmentContent />
                    </div>
                    <PrivateRoute path={NAVIGATION_ROUTES} component={SideNav} />
                </Router>
            </main>
        );
    }
}

export default withStyles(styles)(Master);
