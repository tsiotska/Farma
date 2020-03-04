import * as React from 'react';
import { Component } from 'react';
import { Provider } from 'mobx-react';
import { SnackbarProvider } from 'notistack';
import {createBrowserHistory} from 'history';
import {RouterStore, syncHistoryWithStore} from 'mobx-react-router';

import {
    CssBaseline,
    MuiThemeProvider
} from '@material-ui/core';

import Master from '../Master';
import RootStore from '../../stores';

import theme from '../../theme';
import { Router } from 'react-router-dom';

const browserHistory = createBrowserHistory();
const routingStore = new RouterStore();
const history = syncHistoryWithStore(browserHistory, routingStore);
/**
 * Class representing application root component
 * @class
 */
export class App extends Component<{}, null> {
    public render() {
        return (
            <Provider appState={new RootStore(routingStore)}>
                <MuiThemeProvider theme={theme} >
                    <CssBaseline />
                    <SnackbarProvider maxSnack={3}>
                        <Master initialHistory={history}/>
                    </SnackbarProvider>
                </MuiThemeProvider>
            </Provider>
        );
    }
}

export default App;
