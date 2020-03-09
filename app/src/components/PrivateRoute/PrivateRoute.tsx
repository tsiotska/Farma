import React from 'react';
import {inject, observer} from 'mobx-react';
import {Redirect, Route, RouteProps} from 'react-router';
import {ROOT_ROUTE} from '../../constants/Router';

interface IProps extends RouteProps {
    isLogined?: boolean;
    showLoader?: boolean;
    setRedirect?: (path: string) => void;
}

@inject(({
    appState: {
        userStore: {
            isLogined,
            setRedirect,
            showLoader
        }
    }
}) => ({
    isLogined,
    setRedirect,
    showLoader
}))
@observer
class PrivateRoute extends Route<IProps> {
    render() {
        const {
            isLogined,
            setRedirect,
            showLoader,
            ...props
        } = this.props;

        const { location: { search, pathname }} = props;

        const redirectPath = isLogined
            ? ''
            : ROOT_ROUTE;

        if (redirectPath) setRedirect(`${pathname}${search}`);

        return redirectPath && !showLoader
            ? <Route {...props} component={() => <Redirect to={redirectPath} />} />
            : <Route {...props} />;
    }
}

export default PrivateRoute;
