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
    medsSalesStat?: IMedsSalesStat[];
    setSalesStatDemand?: (value: boolean) => void;
}

@inject(({
    appState: {
        uiStore: {
            openedModal,
        },
        salesStore: {
            setSalesStatDemand,
            medsSalesStat,
        }
    }
}) => ({
    openedModal,
    setSalesStatDemand,
    medsSalesStat
}))
@observer
class Sales extends Component<IProps> {
    componentDidMount() {
        this.props.setSalesStatDemand(true);
    }

    componentWillUnmount() {
        this.props.setSalesStatDemand(false);
    }

    render() {
        const {
            classes,
            medsSalesStat,
        } = this.props;

        return (
            <MuiPickersUtilsProvider utils={DateTimeUtils}>
                <Grid className={classes.root} direction='column' container>
                    <Grid className={classes.plotContainer} wrap='nowrap' container>
                        <Plot medsSalesStat={medsSalesStat} />
                        <Statistic medsSalesStat={medsSalesStat} />
                    </Grid>
                    <TableStat />
                    {/* <DrugsTable
                        meds={meds}
                        medsDisplayStatuses={medsDisplayStatus}
                        medsStat={salesStat}
                    /> */}
                    <DateRangeModal />
                </Grid>
            </MuiPickersUtilsProvider>
        );
    }
}

export default withStyles(styles)(Sales);
