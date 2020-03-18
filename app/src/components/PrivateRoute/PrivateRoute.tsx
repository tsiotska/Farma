import React from 'react';
import {inject, observer} from 'mobx-react';
import {Redirect, Route, RouteProps} from 'react-router';
import { IUser } from '../../interfaces';
import { toJS } from 'mobx';
import { LOGIN_ROUTE } from '../../constants/Router';

interface IProps extends RouteProps {
    user?: IUser;
    isUserLoading?: boolean;
    loadingPlaceholder?: any;
}

@inject(({
    appState: {
        userStore: {
            user,
            isUserLoading
        }
    }
}) => ({
    user,
    isUserLoading
}))
@observer
class PrivateRoute extends Route<IProps> {
    render() {
        const {
            user,
            isUserLoading,
            loadingPlaceholder: LoadingPlaceholder,
            component,
            ...props
        } = this.props;

        if (user) return <Route {...props} component={component} />;

        const loadingMask = LoadingPlaceholder
        ? <LoadingPlaceholder />
        : null;

        return <Route
            {...props}
            render={
                () => isUserLoading
                ? loadingMask
                : <Redirect to={LOGIN_ROUTE} />
            }
        />;
    }
}

export default PrivateRoute;
