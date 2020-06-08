import * as React from 'react';
import { Component } from 'react';
import { Provider } from 'mobx-react';

import {
    CssBaseline,
    MuiThemeProvider
} from '@material-ui/core';

import Master from '../Master';
import RootStore from '../../stores';

import theme from '../../theme';
import { HashRouter, Router } from 'react-router-dom';
import History from '../../history';
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
                    <Router history={History}>
                        <Master />
                    </Router>
                </MuiThemeProvider>
            </Provider>
        );
    }
}

export default App;
