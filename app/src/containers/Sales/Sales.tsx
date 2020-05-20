import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Typography } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import Plot from '../Plot';
import TableStat from './TableStat';
import { IMedsSalesStat } from '../../interfaces/ISalesStat';
import { reaction, observable, action, computed, toJS } from 'mobx';
import { USER_ROLE } from '../../constants/Roles';
import DateRangeButton from '../../components/DateRangeButton';
import { IMedicine } from '../../interfaces/IMedicine';
import MedsStatistic from '../MedsStatistic';
import SalesModeSwitch from '../../components/SalesModeSwitch';

const styles = (theme: any) => createStyles({
    root: {
        padding: '0 20px'
    },
    plotContainer: {
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
    currentDepartmentMeds?: IMedicine[];
    currentDepartmentId?: number;
    role?: USER_ROLE;
    loadLocationsAgents?: () => void;
    loadAllStat?: () => void;
    setPharmacyDemand?: (demand: boolean) => void;
    loadSalesExcel?: () => void;
    clearLocationsAgents?: () => void;
}

@inject(({
    appState: {
        salesStore: {
            computedChartSales: chartSalesStat,
            loadAllStat,
            loadSalesExcel
        },
        userStore: {
            role
        },
        departmentsStore: {
            currentDepartmentMeds,
            currentDepartmentId,
            loadLocationsAgents,
            setPharmacyDemand,
            clearLocationsAgents
        }
    }
}) => ({
    chartSalesStat,
    currentDepartmentMeds,
    role,
    currentDepartmentId,
    loadLocationsAgents,
    loadAllStat,
    setPharmacyDemand,
    loadSalesExcel,
    clearLocationsAgents
}))
@observer
class Sales extends Component<IProps> {
    @observable fetchedRole: USER_ROLE;
    @observable fetchedDepartmentId: number;
    reactionDisposer: any;

    @computed
    get medsMap(): Map<number, IMedicine> {
        const { chartSalesStat, currentDepartmentMeds } = this.props;
        const ids = (chartSalesStat || []).map(({ medId }) => medId);
        const meds = currentDepartmentMeds.filter(({ id, deleted }) => ids.includes(id));
        const mapped: Array<[number, IMedicine]> = meds.map(medicine => ([ medicine.id, medicine]));
        return new Map(mapped);
    }

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
        this.props.clearLocationsAgents();
    }

    render() {
        const {
            classes,
            chartSalesStat,
            currentDepartmentMeds,
            currentDepartmentId,
            loadSalesExcel
        } = this.props;

        return (
            <Grid className={classes.root} direction='column' container>
                <Grid alignItems='center' container>
                    <Typography  variant='h5'>
                        Реализація препаратів за
                    </Typography>
                    <DateRangeButton />
                </Grid>
                <Grid className={classes.plotContainer} wrap='nowrap' container>
                    <Plot
                        meds={this.medsMap}
                        chartSalesStat={chartSalesStat}
                    />
                    <MedsStatistic
                        prepend={
                            <SalesModeSwitch
                                title='Одиниці виміру: '
                                loadExcelHandler={loadSalesExcel}
                            />
                        }
                        departmentId={currentDepartmentId}
                        meds={currentDepartmentMeds}
                        chartSalesStat={chartSalesStat}
                    />
                </Grid>
                <TableStat />
            </Grid>
        );
    }
}

export default withStyles(styles)(Sales);
