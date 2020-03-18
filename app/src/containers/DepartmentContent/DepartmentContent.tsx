import React, { Component } from 'react';
import { createStyles, WithStyles } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { Route, Switch, Redirect } from 'react-router-dom';

import { ROOT_ROUTE, LOGIN_ROUTE } from '../../constants/Router';

import { IRoleContent, adminContent, FFMContent, RMContent, MAContent } from './RolesPresets';
import { ADMIN, FIELD_FORCE_MANAGER, MEDICAL_AGENT, REGIONAL_MANAGER } from '../../constants/Roles';
import PrivateRoute from '../../components/PrivateRoute';

const styles = (theme: any) => createStyles({});

interface IProps extends WithStyles<typeof styles> {
    role?: string;
}

@inject(({
    appState: {
        userStore: {
            role
        }
    }
}) => ({
    role
}))
@observer
class DepartmentContent extends Component<IProps> {
    get userContent(): IRoleContent[] {
        switch (this.props.role) {
            case ADMIN: return adminContent;
            case FIELD_FORCE_MANAGER: return FFMContent;
            case REGIONAL_MANAGER: return RMContent;
            case MEDICAL_AGENT: return MAContent;
            default: return [];
        }
    }

    render() {
        return (
            <Switch>
                {
                    this.userContent.map(({ path, component }) => (
                        <PrivateRoute
                            key={path}
                            path={path}
                            component={component}
                        />
                    ))
                }
                {
                    this.userContent.length &&
                    <PrivateRoute path={ROOT_ROUTE}>
                        <Redirect to={this.userContent[0].path} />
                    </PrivateRoute>
                }
                <Route path={ROOT_ROUTE}>
                    <Redirect to={LOGIN_ROUTE} />
                </Route>
            </Switch>
        );
    }
}

export default withStyles(styles)(DepartmentContent);
