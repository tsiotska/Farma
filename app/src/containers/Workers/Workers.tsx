import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Tabs, Tab, IconButton, Button } from '@material-ui/core';
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
import { ADD_WORKER_MODAL } from '../../constants/Modals';

const styles = (theme: any) => createStyles({
    root: {
        padding: '0 20px'
    },
    indicator: {
        backgroundColor: theme.palette.primary.blue
    },
    tabs: {
        minHeight: 0
    },
    tab: {
        fontSize: theme.typography.pxToRem(20),
        textTransform: 'capitalize',
        minHeight: 38,
        padding: '0 10px'
    },
    excelButton: {
        padding: 4,
        borderRadius: 2,
        marginLeft: 'auto',
        marginRight: 6
    },
    addWorkerButton: {
        marginLeft: 'auto',
        color: theme.palette.primary.green.main,
        border: '1px solid',
        borderColor: theme.palette.primary.green.main,
        backgroundColor: 'white',
        textTransform: 'capitalize',
        fontSize: theme.typography.pxToRem(15),
        padding: '5px 12px'
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
    openModal?: (modalName: string, payload: any) => void;
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
        },
        uiStore: {
            openModal
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
    openModal,
    role
}))
@withRouter
@observer
class Workers extends Component<IProps> {
    @observable tab: TabValue = 'all';

    get isFFM(): boolean {
        return this.props.role === USER_ROLE.FIELD_FORCE_MANAGER;
    }

    addWorkerClickHandler = () => {
        const { role, openModal, positions } = this.props;
        const allowedPositions = role === USER_ROLE.FIELD_FORCE_MANAGER
            ? [ USER_ROLE.REGIONAL_MANAGER, USER_ROLE.MEDICAL_AGENT ]
            : [ USER_ROLE.MEDICAL_AGENT ];
        const filteredPositions: IPosition[] = [];
        positions.forEach(position => {
            if (allowedPositions.includes(position.id)) {
                filteredPositions.push(position);
            }
        });
        openModal(ADD_WORKER_MODAL, filteredPositions);
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
            <Grid className={classes.root} direction='column' container>
                <Grid wrap='nowrap' container alignItems='center'>
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
                    {
                        this.tab === 'all' &&
                        <Button onClick={this.addWorkerClickHandler} className={classes.addWorkerButton}>
                            Додати Працівника
                        </Button>
                    }
                </Grid>
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
