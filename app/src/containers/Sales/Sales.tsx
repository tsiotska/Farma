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
    openedModal?: string;
    currentDepartment?: IDepartment;
    chartSalesStat?: IMedsSalesStat[];
    currentDepartmentId?: number;
    role?: USER_ROLE;
    loadLocationsAgents?: () => void;
    loadLocations?: () => void;
    loadAllStat?: () => void;
}

@inject(({
    appState: {
        uiStore: {
            openedModal,
        },
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
            loadLocations
        }
    }
}) => ({
    openedModal,
    chartSalesStat,
    role,
    currentDepartmentId,
    loadLocationsAgents,
    loadLocations,
    loadAllStat
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
        if (this.fetchedRole === this.props.role && this.fetchedDepartmentId === departmentId) return;
        this.props.loadLocationsAgents();
        this.props.loadAllStat();
        this.fetchedDepartmentId = departmentId;
        this.fetchedRole = this.props.role;
    }

    roleChangeHandler = (role: USER_ROLE) => {
        this.props.loadLocations();
        if (this.fetchedRole === role && this.fetchedDepartmentId === this.props.currentDepartmentId) return;
        this.props.loadLocationsAgents();
        this.props.loadAllStat();
        this.fetchedRole = role;
        this.fetchedDepartmentId = this.props.currentDepartmentId;
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
