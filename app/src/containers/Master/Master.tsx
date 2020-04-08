import React from 'react';
import { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Router, Route, Switch, withRouter } from 'react-router-dom';
import { History } from 'history';
import { createStyles, WithStyles, withStyles } from '@material-ui/core';

import { NAVIGATION_ROUTES, LOGIN_ROUTE, ROOT_ROUTE, ADMIN_ROUTE, ADMIN_ROUTES } from '../../constants/Router';

import Header from '../Header';
import SideNav from './SideNav';
import PrivateRoute from '../../components/PrivateRoute';
import DepartmentContent from '../DepartmentContent';
import Login from '../Login';
import AddDepartmentModal from './AddDepartmentModal';

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
}

@observer
export class Master extends Component<IProps, null> {
    render() {
        const { classes } = this.props;
        return (
            <main className={classes.root}>
                <div className={classes.contentWrapper}>
                    <Switch>
                        <PrivateRoute
                            path={ADMIN_ROUTES}
                            component={Header}
                            loadingPlaceholder={() => <p>Loading...</p>}
                        />
                        <Route path={LOGIN_ROUTE} component={Login} />
                        <PrivateRoute path={ROOT_ROUTE} component={<DepartmentContent />} />
                    </Switch>
                </div>
                <PrivateRoute path={ADMIN_ROUTES} component={SideNav} />
                <AddDepartmentModal />
            </main>
        );
    }
}

export default withStyles(styles)(Master);
