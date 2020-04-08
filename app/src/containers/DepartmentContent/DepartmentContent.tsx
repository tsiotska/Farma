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
import { USER_ROLE, singleDepartmentRoles, multiDepartmentRoles } from '../../constants/Roles';
import { toJS, computed } from 'mobx';
import { IUser } from '../../interfaces';
import { ADMIN_ROUTE, LOGIN_ROUTE } from '../../constants/Router';
import AdminPage from '../AdminPage';
import Login from '../Login';
import PrivateRoute from '../../components/PrivateRoute';

interface IProps {
    user?: IUser;
    role?: USER_ROLE;
    isAdmin?: boolean;
    history?: History;
    currentDepartmentId?: number;
}

@inject(({
    appState: {
        userStore: {
            role,
            isAdmin,
            user
        },
        departmentsStore: {
            currentDepartmentId
        }
    }
}) => ({
    user,
    role,
    isAdmin,
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
        const { role } = this.props;

        switch (role) {
            case USER_ROLE.ADMIN: return adminContent;
            case USER_ROLE.FIELD_FORCE_MANAGER: return FFMContent;
            case USER_ROLE.REGIONAL_MANAGER: return RMContent;
            case USER_ROLE.MEDICAL_AGENT: return MAContent;
            default: return [];
        }
    }

    @computed
    get redirectPath(): string {
        const { isAdmin, currentDepartmentId } = this.props;
        return this.userContent.length
        ? this.userContent[0].path.replace(':departmentId', `${currentDepartmentId}`)
        : isAdmin
            ? ADMIN_ROUTE
            : LOGIN_ROUTE;
    }

    render() {
        const { currentDepartmentId, isAdmin } = this.props;

        if (this.isDepartmentRequired && currentDepartmentId === null) return null;

        return (
            <Switch>
                {
                    this.userContent.map(({ path, component }) => (
                        <PrivateRoute key={path} path={path} component={component} />
                    ))
                }
                {
                    isAdmin &&
                    <PrivateRoute path={ADMIN_ROUTE} component={AdminPage} />
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
