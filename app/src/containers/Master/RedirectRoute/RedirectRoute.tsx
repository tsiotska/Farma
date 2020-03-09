import React from 'react';
import { observer, inject } from 'mobx-react';
import { IDepartment } from '../../../interfaces/IDepartment';
import { Route, RouteProps, Redirect } from 'react-router-dom';

interface IProps extends RouteProps {
    departments?: IDepartment[];
}

@inject(({
    appState: {
        departmentsStore: {
            departments
        }
    }
}) => ({
    departments
}))
@observer
class RedirectRoute extends Route<IProps> {
    render() {
        const { departments, ...props } = this.props;

        return <Route
            {...props}
            render={
                () => departments && departments.length
                ? <Redirect to={departments[0].path} />
                : <p>Loading...</p>
            }
        />;
    }
}

export default RedirectRoute;
