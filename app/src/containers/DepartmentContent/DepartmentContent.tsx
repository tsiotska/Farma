import React, { Component } from 'react';
import { createStyles, WithStyles } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import { ROOT_ROUTE, LOGIN_ROUTE } from '../../constants/Router';

import { IRoleContent, adminContent, FFMContent, RMContent, MAContent } from './RolesPresets';
import { USER_ROLE } from '../../constants/Roles';
import PrivateRoute from '../../components/PrivateRoute';

const styles = (theme: any) => createStyles({});

interface IProps extends WithStyles<typeof styles> {
    role?: USER_ROLE;
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
            case USER_ROLE.ADMIN: return adminContent;
            case USER_ROLE.FIELD_FORCE_MANAGER: return FFMContent;
            case USER_ROLE.REGIONAL_MANAGER: return RMContent;
            case USER_ROLE.MEDICAL_AGENT: return MAContent;
            default: return [];
        }
    }

    get redirectPath(): string {
        return this.userContent[0]
        ? this.userContent[0].path
        : LOGIN_ROUTE;
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
                <PrivateRoute path={ROOT_ROUTE}>
                    <Redirect to={this.redirectPath} />
                </PrivateRoute>
            </Switch>
        );
    }
}

export default withStyles(styles)(DepartmentContent);
