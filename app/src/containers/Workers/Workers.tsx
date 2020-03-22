import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Tabs, Tab } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IDepartment } from '../../interfaces/IDepartment';
import { observable, toJS } from 'mobx';
import { withRouter } from 'react-router-dom';
import { History } from 'history';
import { parse, stringify } from 'query-string';
import { IPosition } from '../../interfaces/IPosition';
import { IWorker } from '../../interfaces/IWorker';
import List from './List';
import { IAsyncStatus } from '../../stores/AsyncStore';

const styles = (theme: any) => createStyles({
    indicator: {
        backgroundColor: theme.palette.primary.blue
    },
    tabs: {
        minHeight: 0
    },
    tab: {
        fontSize: theme.typography.pxToRem(20),
        textTransform: 'capitalize',
        minHeight: 0,
        padding: '0 10px'
    }
});

interface IProps extends WithStyles<typeof styles> {
    currentDepartment?: IDepartment;
    loadWorkers?: () => void;
    loadFiredWorkers?: () => void;
    history?: History;
    positions?: Map<number, IPosition>;
    workers?: IWorker[];
    firedWorkers?: IWorker[];
    getAsyncStatus?: (key: string) => IAsyncStatus;
}

type TabValue = 'all' | 'fired';

@inject(({
    appState: {
        departmentsStore: {
            currentDepartment,
            loadWorkers,
            loadFiredWorkers,
            positions,
            workers,
            firedWorkers,
            getAsyncStatus
        },
    }
}) => ({
    currentDepartment,
    loadWorkers,
    loadFiredWorkers,
    positions,
    workers,
    firedWorkers,
    getAsyncStatus
}))
@withRouter
@observer
class Workers extends Component<IProps> {
    @observable tab: TabValue = 'all';

    loadData = () => {
        const { loadWorkers, loadFiredWorkers } = this.props;
        const action = this.tab === 'all'
            ? loadWorkers
            : loadFiredWorkers;
        action();
    }

    tabChangeHandler = (event: any, value: TabValue) => {
        const { history } = this.props;

        this.tab = value;

        const searchParams = this.tab === 'all'
            ? {}
            : { fired: null };

        history.push({
            pathname: history.location.pathname,
            search: stringify(searchParams)
        });
    }

    componentDidUpdate(prevProps: IProps) {
        const { currentDepartment: actualDep, getAsyncStatus } = this.props;
        const { currentDepartment: prevDep } = prevProps;

        const requestName = this.tab === 'all'
            ? 'loadWorkers'
            : 'loadFiredWorkers';

        const { loading, success } = getAsyncStatus(requestName);

        const shouldLoadData = loading === false
            && success === false
            || actualDep !== prevDep;

        if (shouldLoadData) this.loadData();
    }

    componentDidMount() {
        const { history: { location: { search } } } = this.props;
        const queryParams = parse(search);

        this.tab = 'fired' in queryParams
            ? 'fired'
            : 'all';

        this.loadData();
    }

    render() {
        const { classes, workers, firedWorkers, positions } = this.props;

        return (
            <Grid direction='column' container>
                <Tabs
                    classes={{
                        root: classes.tabs,
                        indicator: classes.indicator
                    }}
                    onChange={this.tabChangeHandler}
                    value={this.tab}>
                    <Tab className={classes.tab} value='all' label='Сотрудники' />
                    <Tab className={classes.tab} value='fired' label='Уволеные сотрудники' />
                </Tabs>
                <List
                    positions={positions}
                    workers={
                        this.tab === 'fired'
                            ? firedWorkers
                            : workers
                    }
                    fired={this.tab === 'fired'}
                />
            </Grid>
        );
    }
}

export default withStyles(styles)(Workers);
