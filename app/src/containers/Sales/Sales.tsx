import React, { Component } from 'react';
import { createStyles, WithStyles, Grid } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DrugsTable from '../../components/DrugsTable';
import Statistic from './Statistic';
import Plot from './Plot';
import DateRangeModal from './DateRangeModal';
import DateTimeUtils from './DateTimeUtils';
import { IDepartment } from '../../interfaces/IDepartment';

const styles = (theme: any) => createStyles({
    root: {
        padding: '0 20px'
    },
    plotContainer: {
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column'
        }
    }
});

interface IProps extends WithStyles<typeof styles> {
    openedModal?: string;
    currentDepartment?: IDepartment;
    loadStat?: () => void;
}

@inject(({
    appState: {
        uiStore: {
            openedModal,
        },
    }
}) => ({
    openedModal,
}))
@observer
class Sales extends Component<IProps> {
    render() {
        const { classes } = this.props;

        return (
            <MuiPickersUtilsProvider utils={DateTimeUtils}>
                <Grid className={classes.root} direction='column' container>
                    <Grid className={classes.plotContainer} wrap='nowrap' container>
                        <Plot />
                        <Statistic />
                    </Grid>
                    {/* <DrugsTable
                        headers={['qwer', 'qwer1', 'qwer2', 'qwer3']}
                        data={[[4, 2, 5, 2]]}
                    /> */}
                    <DateRangeModal />
                </Grid>
            </MuiPickersUtilsProvider>
        );
    }
}

export default withStyles(styles)(Sales);
