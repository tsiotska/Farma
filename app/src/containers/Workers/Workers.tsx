import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Tabs, Tab, IconButton } from '@material-ui/core';
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
import { USER_ROLE } from '../../constants/Roles';
import { LOCATION_TITLE } from './List/List';
import ExcelIcon from '../../components/ExcelIcon';

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
    },
    excelButton: {
        padding: 4,
        borderRadius: 2,
        marginLeft: 'auto',
        marginRight: 6
    }
});

interface IProps extends WithStyles<typeof styles> {
    currentDepartment?: IDepartment;
    resetWorkers?: () => void;
    loadWorkers?: () => void;
    loadWorkersExcel?: () => void;
    loadFiredWorkers?: () => void;
    history?: History;
    positions?: Map<number, IPosition>;
    workers?: IWorker[];
    firedWorkers?: IWorker[];
    getAsyncStatus?: (key: string) => IAsyncStatus;
    role?: USER_ROLE;
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
            getAsyncStatus,
            loadWorkersExcel,
            resetWorkers
        },
        userStore: {
            role
        }
    }
}) => ({
    currentDepartment,
    loadWorkers,
    loadFiredWorkers,
    loadWorkersExcel,
    positions,
    workers,
    firedWorkers,
    getAsyncStatus,
    resetWorkers,
    role
}))
@withRouter
@observer
class Workers extends Component<IProps> {
    @observable tab: TabValue = 'all';

    get isFFM(): boolean {
        return this.props.role === USER_ROLE.FIELD_FORCE_MANAGER;
    }

    loadExcel = () => this.props.loadWorkersExcel();

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

        this.loadData();
    }

    componentDidUpdate(prevProps: IProps) {
        const { resetWorkers, role, currentDepartment: actualDep } = this.props;
        const { role: prevRole, currentDepartment: prevDep } = prevProps;

        const shouldLoadData = actualDep !== prevDep || role !== prevRole;

        if (shouldLoadData) {
            resetWorkers();
            this.loadData();
        }
    }

    componentDidMount() {
        const { resetWorkers, history: { location: { search } } } = this.props;
        const queryParams = parse(search);

        this.tab = 'fired' in queryParams
            ? 'fired'
            : 'all';

        resetWorkers();
        this.loadData();
    }

    render() {
        const {
            classes,
            workers,
            firedWorkers,
            positions,
            role
        } = this.props;

        return (
            <Grid direction='column' container>
                <Tabs
                    classes={{
                        root: classes.tabs,
                        indicator: classes.indicator
                    }}
                    onChange={this.tabChangeHandler}
                    value={this.tab}>
                    <Tab className={classes.tab} value='all' label='Працівники' />
                    <Tab className={classes.tab} value='fired' label='Звільнені працівники' />
                </Tabs>
                <List
                    locationTitle={
                        role === USER_ROLE.FIELD_FORCE_MANAGER
                        ? LOCATION_TITLE.REGION
                        : LOCATION_TITLE.CITY
                    }
                    positions={positions}
                    workers={
                        this.tab === 'fired'
                            ? firedWorkers
                            : workers
                    }
                    fired={this.tab === 'fired'}
                    expandable={this.isFFM && this.tab === 'all'}
                    headerAppend={
                        <IconButton className={classes.excelButton} onClick={this.loadExcel}>
                            <ExcelIcon size={24} />
                        </IconButton>
                    }
                />
            </Grid>
        );
    }
}

export default withStyles(styles)(Workers);
