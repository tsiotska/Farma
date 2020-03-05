import React, { Component } from 'react';
import { createStyles, WithStyles } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { Route, Switch, Redirect } from 'react-router-dom';

import { ROOT_ROUTE } from '../../constants/Router';

import { IRoleContent, adminContent, FFMContent, RMContent, MAContent } from './RolesPresets';
import { ADMIN, FIELD_FORCE_MANAGER, MEDICAL_AGENT, REGIONAL_MANAGER } from '../../constants/Roles';

const styles = (theme: any) => createStyles({});

interface IProps extends WithStyles<typeof styles> {
    currentPath: string;
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
    get currentPath(): string {
        return this.props.currentPath || ROOT_ROUTE;
    }

    get userContent(): IRoleContent[] {
        switch (this.props.role) {
            case ADMIN: return adminContent;
            case FIELD_FORCE_MANAGER: return FFMContent;
            case REGIONAL_MANAGER: return RMContent;
            case MEDICAL_AGENT: return MAContent;
            default: return [];
        }
    }

    get redirectRoute(): string {
        return this.userContent.length
        ? this.userContent[0].path
        : ROOT_ROUTE;
    }

    render() {
        return (
            <Switch>
                {
                    this.userContent.map(({ path, component }) => (
                        <Route
                            key={path}
                            path={`${this.currentPath}${path}`}
                            component={component}
                        />
                    ))
                }
                <Route path={ROOT_ROUTE}>
                    <Redirect to={`${this.currentPath}${this.redirectRoute}`} />
                </Route>
            </Switch>
        );
    }
}

export default withStyles(styles)(DepartmentContent);
