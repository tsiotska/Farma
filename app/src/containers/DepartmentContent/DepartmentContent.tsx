import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { History } from 'history';

import {
    IRoleContent,
    adminContent,
    FFMContent,
    RMContent,
    MAContent
} from './RolesPresets';
import { USER_ROLE, singleDepartmentRoles } from '../../constants/Roles';
import { toJS, computed } from 'mobx';

interface IProps {
    role?: USER_ROLE;
    history?: History;
    currentDepartmentId: number;
}

@inject(({
    appState: {
        userStore: {
            role
        },
        departmentsStore: {
            currentDepartmentId
        }
    }
}) => ({
    role,
    currentDepartmentId

}))
@observer
class DepartmentContent extends Component<IProps> {
    @computed
    get isDepartmentRequired(): boolean {
        return singleDepartmentRoles.includes(this.props.role);
    }

    @computed
    get userContent(): IRoleContent[] {
        switch (this.props.role) {
            case USER_ROLE.ADMIN: return adminContent;
            case USER_ROLE.FIELD_FORCE_MANAGER: return FFMContent;
            case USER_ROLE.REGIONAL_MANAGER: return RMContent;
            case USER_ROLE.MEDICAL_AGENT: return MAContent;
            default: return [];
        }
    }

    @computed
    get redirectPath(): string {
        return this.userContent.length
        ? this.userContent[0].path
        : null;
    }

    render() {
        const { currentDepartmentId } = this.props;

        if (currentDepartmentId === null && this.isDepartmentRequired) return null;

        return (
            <Switch>
                {
                    this.userContent.map(({ path, component }) => (
                        <Route key={path} path={path} component={component} />
                    ))
                }
                {
                    this.redirectPath &&
                    <Redirect to={this.redirectPath} />
                }
            </Switch>
        );
    }
}

export default DepartmentContent;
