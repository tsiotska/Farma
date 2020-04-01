import React, { Component } from 'react';
import { createStyles, WithStyles, Grid } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import Statistic from './Statistic';
import Plot from './Plot';
import DateRangeModal from './DateRangeModal';
import DateTimeUtils from './DateTimeUtils';
import { IDepartment } from '../../interfaces/IDepartment';
import TableStat from './TableStat';
import { IMedsSalesStat } from '../../interfaces/ISalesStat';
import { IUser } from '../../interfaces';
import { reaction, observable } from 'mobx';
import { USER_ROLE } from '../../constants/Roles';
import { IAsyncStatus } from '../../stores/AsyncStore';

const styles = (theme: any) => createStyles({
    root: {
        padding: '0 20px'
    },
    plotContainer: {
        marginBottom: theme.spacing(4),
        '& > *:last-child': {
            marginLeft: 20
        },
        [theme.breakpoints.down('sm')]: {
            padding: '0 20px',
            flexDirection: 'column',
            alignItems: 'center',
            '& > *:last-child': {
                maxWidth: 'none',
                marginLeft: 0
            },
        }
    }
});

interface IProps extends WithStyles<typeof styles> {
    chartSalesStat?: IMedsSalesStat[];
    currentDepartmentId?: number;
    role?: USER_ROLE;
    loadLocationsAgents?: () => void;
    loadLocations?: () => void;
    loadAllStat?: () => void;
    setPharmacyDemand?: (demand: boolean) => void;
}

@inject(({
    appState: {
        salesStore: {
            chartSalesStat,
            loadAllStat
        },
        userStore: {
            role
        },
        departmentsStore: {
            currentDepartmentId,
            loadLocationsAgents,
            loadLocations,
            setPharmacyDemand
        }
    }
}) => ({
    chartSalesStat,
    role,
    currentDepartmentId,
    loadLocationsAgents,
    loadLocations,
    loadAllStat,
    setPharmacyDemand
}))
@observer
class Sales extends Component<IProps> {
    @observable fetchedRole: USER_ROLE;
    @observable fetchedDepartmentId: number;
    disposeRoleReaction: any;
    disposeDepartmentReaction: any;

    componentDidMount() {
        this.disposeDepartmentReaction = reaction(
            () => this.props.currentDepartmentId,
            this.departmentChangeHandler,
            { fireImmediately: true }
        );
        this.disposeRoleReaction = reaction(
            () => this.props.role,
            this.roleChangeHandler,
            { fireImmediately: true }
        );
    }

    departmentChangeHandler = (departmentId: number) => {
        const {
            role,
            loadLocationsAgents,
            loadAllStat
        } = this.props;

        if (this.fetchedRole === role && this.fetchedDepartmentId === departmentId) return;

        loadLocationsAgents();
        loadAllStat();
        this.fetchedDepartmentId = departmentId;
        this.fetchedRole = role;
    }

    roleChangeHandler = (role: USER_ROLE) => {
        const {
            currentDepartmentId,
            loadLocations,
            loadLocationsAgents,
            loadAllStat,
            setPharmacyDemand
        } = this.props;

        loadLocations();

        if (this.fetchedRole === role && this.fetchedDepartmentId === currentDepartmentId) return;

        const shouldLoadPharmacies = role === USER_ROLE.MEDICAL_AGENT;
        setPharmacyDemand(shouldLoadPharmacies);

        loadLocationsAgents();
        loadAllStat();
        this.fetchedRole = role;
        this.fetchedDepartmentId = currentDepartmentId;
    }

    componentWillUnmount() {
        this.disposeRoleReaction();
        this.disposeDepartmentReaction();
    }

    render() {
        const { classes, chartSalesStat } = this.props;

        return (
            <MuiPickersUtilsProvider utils={DateTimeUtils}>
                <Grid className={classes.root} direction='column' container>
                    <Grid className={classes.plotContainer} wrap='nowrap' container>
                        <Plot chartSalesStat={chartSalesStat} />
                        <Statistic chartSalesStat={chartSalesStat} />
                    </Grid>
                    <TableStat />
                    <DateRangeModal />
                </Grid>
            </MuiPickersUtilsProvider>
        );
    }
}

export default withStyles(styles)(Sales);
