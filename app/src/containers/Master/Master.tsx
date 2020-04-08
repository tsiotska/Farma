import React from 'react';
import { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Router, Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { History } from 'history';
import { createStyles, WithStyles, withStyles } from '@material-ui/core';

import { LOGIN_ROUTE, ROOT_ROUTE, ADMIN_ROUTE, ADMIN_ROUTES, SALES_ROUTE, MARKS_ROUTE, SALARY_ROUTE, WORKERS_ROUTE, MEDICINES_ROUTE, PHARMACY_ROUTE, LPU_ROUTE, NAVIGATION_ROUTES } from '../../constants/Router';

import Header from '../Header';
import SideNav from './SideNav';
import PrivateRoute from '../../components/PrivateRoute';
import Login from '../Login';
import AddDepartmentModal from './AddDepartmentModal';
import { IUser } from '../../interfaces';
import { USER_ROLE } from '../../constants/Roles';
import { computed, toJS } from 'mobx';
import AdminPage from '../AdminPage';
import Sales from '../Sales';
import Marks from '../Marks';
import Salary from '../Salary';
import Workers from '../Workers';
import Medicines from '../Medicines';
import Pharmacy from '../Pharmacy';
import Lpu from '../Lpu';
import DepartmentNav from '../../components/DepartmentNav';

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
    user?: IUser;
    role?: USER_ROLE;
    isAdmin?: boolean;
    history?: History;
    currentDepartmentId?: number;
    isUserFetched?: boolean;
}

export interface IRoleContent {
    path: string;
    component: any;
    title: string;
}

const adminPage = { title: '', path: ADMIN_ROUTE, component: AdminPage };
const sales = { title: 'Продажі', path: SALES_ROUTE, component: Sales };
const marks = { title: 'Бали', path: MARKS_ROUTE, component: Marks };
const salary = { title: 'Заробітня плата', path: SALARY_ROUTE, component: Salary };
const workers = { title: 'Працівники', path: WORKERS_ROUTE, component: Workers };
const meds = { title: 'Препарати', path: MEDICINES_ROUTE, component: Medicines };
const pharmacy = { title: 'Аптеки', path: PHARMACY_ROUTE, component: Pharmacy };
const lpu = { title: 'ЛПУ', path: LPU_ROUTE, component: Lpu };

@inject(({
    appState: {
        userStore: {
            role,
            isAdmin,
            user,
            isUserFetched
        },
        departmentsStore: {
            currentDepartmentId
        }
    }
}) => ({
    user,
    role,
    isAdmin,
    currentDepartmentId,
    isUserFetched
}))
@observer
export class Master extends Component<IProps, null> {
    readonly rolesPresets: Record<USER_ROLE, IRoleContent[]> = {
        [USER_ROLE.SUPER_ADMIN]: [ adminPage],
        [USER_ROLE.ADMIN]: [ adminPage ],
        [USER_ROLE.FIELD_FORCE_MANAGER]: [
            sales,
            marks,
            salary,
            workers,
            meds,
            pharmacy,
            lpu
        ],
        [USER_ROLE.REGIONAL_MANAGER]: [
            sales,
            marks,
            workers,
            pharmacy,
            lpu
        ],
        [USER_ROLE.MEDICAL_AGENT]: [
            sales,
            marks,
            pharmacy,
            lpu
        ],
        [USER_ROLE.PRODUCT_MANAGER]: [],
        [USER_ROLE.UNKNOWN]: [],
    };

    @computed
    get userContent(): IRoleContent[] {
        const { role, user } = this.props;

        const userRole = user
            ? user.position
            : USER_ROLE.UNKNOWN;

        const targetRole = role || userRole;

        return this.rolesPresets[targetRole];
    }

    @computed
    get redirectPath(): string {
        const { currentDepartmentId, user } = this.props;
        if (!user) return LOGIN_ROUTE;
        return this.userContent.length
            ? this.userContent[0].path.replace(':departmentId', `${currentDepartmentId}`)
            : null;
    }

    render() {
        const { classes, isUserFetched } = this.props;

        return (
            <main className={classes.root}>
                <div className={classes.contentWrapper}>
                    <PrivateRoute path={ADMIN_ROUTES} component={Header} />
                    <PrivateRoute path={NAVIGATION_ROUTES} render={() => <DepartmentNav userLinks={this.userContent} />} />
                    <Switch>
                        <Route path={LOGIN_ROUTE} component={Login} />
                        {
                            isUserFetched === false &&
                            <Route>loading...</Route>
                        }
                        {
                            this.userContent.map(({ path, component }) => (
                                <PrivateRoute key={path} path={path} component={component} />
                            ))
                        }
                        {
                            this.redirectPath &&
                            <Redirect to={this.redirectPath} />
                        }

                    </Switch>
                </div>
                <PrivateRoute path={ADMIN_ROUTES} component={SideNav} />
                <AddDepartmentModal />
            </main>
        );
    }
}

export default withStyles(styles)(Master);
