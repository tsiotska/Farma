import React, { Component } from 'react';
import { createStyles, WithStyles } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { Route, Switch, Redirect } from 'react-router-dom';

import {
    SALES_ROUTE,
    MARKS_ROUTE,
    SALARY_ROUTE,
    WORKERS_ROUTE,
    MEDICINES_ROUTE,
    PHARMACY_ROUTE,
    ROOT_ROUTE
} from '../../constants/Router';
import Medicines from '../Medicines';
import Sales from '../Sales';
import Marks from '../Marks';
import Salary from '../Salary';
import Workers from '../Workers';
import Pharmacy from '../Pharmacy';

const styles = (theme: any) => createStyles({});

interface IProps extends WithStyles<typeof styles> {
    currentPath: string;
}

@observer
class DepartmentContent extends Component<IProps> {
    get currentPath(): string {
        return this.props.currentPath || ROOT_ROUTE;
    }

    render() {
        return (
            <Switch>
                <Route path={`${this.currentPath}${SALES_ROUTE}`} component={Sales} />
                <Route path={`${this.currentPath}${MARKS_ROUTE}`} component={Marks} />
                <Route path={`${this.currentPath}${SALARY_ROUTE}`} component={Salary} />
                <Route path={`${this.currentPath}${WORKERS_ROUTE}`} component={Workers} />
                <Route path={`${this.currentPath}${MEDICINES_ROUTE}`} component={Medicines} />
                <Route path={`${this.currentPath}${PHARMACY_ROUTE}`} component={Pharmacy} />
                <Route path={ROOT_ROUTE}><Redirect to={`${this.currentPath}${SALES_ROUTE}`} /></Route>
            </Switch>
        );
    }
}

export default withStyles(styles)(DepartmentContent);
