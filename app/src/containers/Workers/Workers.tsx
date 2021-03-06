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
import { IDoctor } from '../../interfaces/IDoctor';
import UnconfirmedDoctorsList from './UnconfirmedDoctorsList/UnconfirmedDoctorsList';
import { ADD_WORKER_MODAL } from '../../constants/Modals';
import DeletePopover from '../../components/DeletePopover';
import { SNACKBAR_TYPE } from '../../constants/Snackbars';
import Snackbar from '../../components/Snackbar';
import { IWithRestriction } from '../../interfaces';
import { withRestriction } from '../../components/hoc/withRestriction';
import { PERMISSIONS } from '../../constants/Permissions';
import DoctorListItem from '../Doctors/Doctors';
import { IDeletePopoverSettings } from '../../stores/UIStore';

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
        borderColor: theme.palette.primary.green.main,
        backgroundColor: 'white',
        border: '1px solid',
        textTransform: 'none',
        minWidth: 150,
        '&:hover': {
            backgroundColor: '#f3f3f3',
        }
    }
});

interface IProps extends WithStyles<typeof styles>, IWithRestriction {
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
    loadUnconfirmedDoctors: () => IDoctor[];
    pureAgentConfirm?: (doctor: IDoctor) => boolean;
    openModal?: (modalName: string, payload: any) => void;
    openDelPopper?: (settings: IDeletePopoverSettings) => void;
    removeDoctor?: (doc: IDoctor) => boolean;
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
            resetWorkers,
            removeDoctor,
            loadUnconfirmedDoctors,
            pureAgentConfirm
        },
        userStore: {
            role
        },
        uiStore: {
            openModal,
            openDelPopper
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
    role,
    loadUnconfirmedDoctors,
    pureAgentConfirm,
    openModal,
    openDelPopper,
    removeDoctor
}))
@withRestriction([ PERMISSIONS.ADD_USER ])
@withRouter
@observer
class Workers extends Component<IProps> {
    @observable tab: TabValue = 'all';
    @observable unconfirmedDoctors: IDoctor[] = null;
    @observable snackbarType: SNACKBAR_TYPE = SNACKBAR_TYPE.SUCCESS;
    @observable snackbarMessage: string = null;

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

    loadData = async () => {
        const { loadWorkers, loadFiredWorkers, loadUnconfirmedDoctors } = this.props;
        const action = this.tab === 'all'
            ? loadWorkers
            : loadFiredWorkers;
        action();
        this.unconfirmedDoctors = await loadUnconfirmedDoctors();
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

    snackbarCloseHandler = () => {
        this.snackbarMessage = null;
    }

    confirmHandler = async (doc: IDoctor) => {
        const { pureAgentConfirm, loadUnconfirmedDoctors } = this.props;
        const isConfirmed = await pureAgentConfirm(doc);
        this.snackbarType = isConfirmed
            ? SNACKBAR_TYPE.SUCCESS
            : SNACKBAR_TYPE.ERROR;
        this.snackbarMessage = isConfirmed
            ? '???????????? ????????????????????????'
            : '?????????????????????? ???????????? ???? ??????????????';
        if (isConfirmed) {
            this.unconfirmedDoctors = await loadUnconfirmedDoctors();
        }
    }

    deleteHandler = (workerRemoved: boolean) => {
        this.snackbarType = workerRemoved
            ? SNACKBAR_TYPE.SUCCESS
            : SNACKBAR_TYPE.ERROR;
        this.snackbarMessage = workerRemoved
            ? '?????????????????? ?????????????? ??????????????????'
            : '???????????????? ???????????????????? ???? ??????????????';
    }

    deleteUnconfirmedHandler = (doc: IDoctor) => async (confirmed: boolean) => {
        const { openDelPopper, removeDoctor } = this.props;
        openDelPopper(null);
        if (!confirmed) return;
        const docRemoved = await removeDoctor(doc);
        this.snackbarType = docRemoved
            ? SNACKBAR_TYPE.SUCCESS
            : SNACKBAR_TYPE.ERROR;
        this.snackbarMessage = docRemoved
            ? '?????????????????? ?????????????? ??????????????????'
            : '???????????????? ???????????????????? ???? ??????????????';
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
            isAllowed,
            role
        } = this.props;

        return (
            <Grid className={classes.root} direction='column' container>
                {
                    (this.unconfirmedDoctors && this.unconfirmedDoctors.length > 0) &&
                    <UnconfirmedDoctorsList
                        unconfirmedDoctors={this.unconfirmedDoctors}
                        confirmHandler={this.confirmHandler}
                        deleteHandler={this.deleteUnconfirmedHandler}
                    />
                }
                <Grid wrap='nowrap' container alignItems='center'>
                    <Tabs
                        classes={{
                            root: classes.tabs,
                            indicator: classes.indicator
                        }}
                        onChange={this.tabChangeHandler}
                        value={this.tab}>
                        <Tab className={classes.tab} value='all' label='????????????????????' />
                        <Tab className={classes.tab} value='fired' label='?????????????????? ????????????????????' />
                    </Tabs>
                    {
                        (this.tab === 'all' && isAllowed) &&
                        <Button
                            onClick={this.addWorkerClickHandler}
                            className={classes.addWorkerButton}>
                            ???????????? ????????????????????
                        </Button>
                    }
                </Grid>
                <List
                    positions={positions}
                    fired={this.tab === 'fired'}
                    expandable={this.isFFM && this.tab === 'all'}
                    onDelete={this.deleteHandler}
                    locationTitle={
                        role === USER_ROLE.FIELD_FORCE_MANAGER
                            ? LOCATION_TITLE.REGION
                            : LOCATION_TITLE.CITY
                    }
                    workers={
                        this.tab === 'fired'
                            ? firedWorkers
                            : workers
                    }
                    headerAppend={
                        <IconButton className={classes.excelButton} onClick={this.loadExcel}>
                            <ExcelIcon size={24}/>
                        </IconButton>
                    }
                />
                <DeletePopover
                    name='deleteDoc'
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                />
                <Snackbar
                    open={!!this.snackbarMessage}
                    type={this.snackbarType}
                    onClose={this.snackbarCloseHandler}
                    message={this.snackbarMessage}
                />
            </Grid>
        );
    }
}

export default withStyles(styles)(Workers);
