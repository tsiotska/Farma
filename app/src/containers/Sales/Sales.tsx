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
import { reaction } from 'mobx';

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
    setSalesStatDemand?: (value: boolean) => void;
    currentDepartmentId?: number;
    role?: IUser;
    loadLocationsAgents?: () => void;
    loadLocations?: () => void;
}

@inject(({
    appState: {
        uiStore: {
            openedModal,
        },
        salesStore: {
            setSalesStatDemand,
            chartSalesStat,
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
    setSalesStatDemand,
    chartSalesStat,
    role,
    currentDepartmentId,
    loadLocationsAgents,
    loadLocations
}))
@observer
class Sales extends Component<IProps> {
    disposeRoleReaction: any;
    disposeDepartmentReaction: any;

    componentDidMount() {
        this.props.setSalesStatDemand(true);
        this.disposeDepartmentReaction = reaction(
            () => this.props.currentDepartmentId,
            this.props.loadLocationsAgents,
            { fireImmediately: true }
        );
        this.disposeRoleReaction = reaction(
            () => this.props.role,
            this.roleChangeHandler,
            { fireImmediately: true }
        );
    }

    roleChangeHandler = () => {
        this.props.loadLocationsAgents();
        this.props.loadLocations();
    }

    componentWillUnmount() {
        this.props.setSalesStatDemand(false);
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
