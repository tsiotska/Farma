import * as React from 'react';
import { Component } from 'react';
import { Provider } from 'mobx-react';
import { SnackbarProvider } from 'notistack';
import {createBrowserHistory} from 'history';

import {
    CssBaseline,
    MuiThemeProvider
} from '@material-ui/core';

import Master from '../Master';
import RootStore from '../../stores';

import theme from '../../theme';

const browserHistory = createBrowserHistory();

/**
 * Class representing application root component
 * @class
 */
export class App extends Component<{}, null> {
    public render() {
        return (
            <Provider appState={new RootStore()}>
                <MuiThemeProvider theme={theme} >
                    <CssBaseline />
                    <SnackbarProvider maxSnack={3}>
                        <Master initialHistory={browserHistory}/>
                    </SnackbarProvider>
                </MuiThemeProvider>
            </Provider>
        );
    }
}

export default App;
