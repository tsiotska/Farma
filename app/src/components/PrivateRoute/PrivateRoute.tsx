import React from 'react';
import {inject, observer} from 'mobx-react';
import {Redirect, Route, RouteProps} from 'react-router';
import { IUser } from '../../interfaces';
import { computed } from 'mobx';
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
class PrivateRoute extends Route<IProps & any> {
    @computed
    get loadingMask(): any {
        const { loadingPlaceholder: LoadingPlaceholder } = this.props;
        return LoadingPlaceholder
        ? <LoadingPlaceholder />
        : null;
    }

    render() {
        const {
            user,
            isUserLoading,
            loadingPlaceholder: LoadingPlaceholder,
            component,
            ...props
        } = this.props;

        return user
        ? <Route {...props} component={component} />
        : <Route {...props} render={
            () => isUserLoading
                    ? this.loadingMask
                    : <Redirect to={LOGIN_ROUTE} />
            }
        />;
    }
}

export default PrivateRoute;
