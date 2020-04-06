import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Typography } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import Statistic from './Statistic';
import Plot from '../Plot';
import DateRangeModal from './DateRangeModal';
import DateTimeUtils from './DateTimeUtils';
import TableStat from './TableStat';
import { IMedsSalesStat } from '../../interfaces/ISalesStat';
import { reaction, observable, action } from 'mobx';
import { USER_ROLE } from '../../constants/Roles';
import DateRangeButton from '../../components/DateRangeButton';

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
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: theme.spacing(2)
    },
});

interface IProps extends WithStyles<typeof styles> {
    chartSalesStat?: IMedsSalesStat[];
    currentDepartmentId?: number;
    role?: USER_ROLE;
    loadLocationsAgents?: () => void;
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
            setPharmacyDemand
        }
    }
}) => ({
    chartSalesStat,
    role,
    currentDepartmentId,
    loadLocationsAgents,
    loadAllStat,
    setPharmacyDemand
}))
@observer
class Sales extends Component<IProps> {
    @observable fetchedRole: USER_ROLE;
    @observable fetchedDepartmentId: number;
    reactionDisposer: any;

    componentDidMount() {
        this.reactionDisposer = reaction(
            () => [this.props.role, this.props.currentDepartmentId],
            this.updateData,
            { fireImmediately: true }
        );
    }

    @action.bound
    updateData = ([role, departmentId]: [USER_ROLE, number]) => {
        const {
            loadLocationsAgents,
            loadAllStat,
            setPharmacyDemand
        } = this.props;

        const roleChanged = role !== this.fetchedRole;
        const departmentIdChanged = departmentId !== this.fetchedDepartmentId;

        if (roleChanged) {
            setPharmacyDemand(role === USER_ROLE.MEDICAL_AGENT);
            loadLocationsAgents();
            loadAllStat();
        } else if (departmentIdChanged) {
            loadLocationsAgents();
            loadAllStat();
        }

        this.fetchedDepartmentId = departmentId;
        this.fetchedRole = role;
    }

    componentWillUnmount() {
        this.reactionDisposer();
    }

    render() {
        const { classes, chartSalesStat } = this.props;

        return (
            <Grid className={classes.root} direction='column' container>
                <Grid className={classes.plotContainer} wrap='nowrap' container>
                    <Plot
                        chartSalesStat={chartSalesStat}
                        header={
                            <Typography className={classes.header} variant='h5'>
                                Реализація препаратів за
                                <DateRangeButton />
                            </Typography>
                        }
                    />
                    <Statistic chartSalesStat={chartSalesStat} />
                </Grid>
                <TableStat />
            </Grid>
        );
    }
}

export default withStyles(styles)(Sales);
