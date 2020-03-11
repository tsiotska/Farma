import React, { Component } from 'react';
import { createStyles, WithStyles, Grid } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import DrugsTable from '../../components/DrugsTable';
import Statistic from './Statistic';
import Plot from './Plot';
import DateRangeModal from './DateRangeModal';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

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
}

@inject(({
    appState: {
        uiStore: {
            openedModal
        }
    }
}) => ({
    openedModal
}))
@observer
class Sales extends Component<IProps> {
    render() {
        const { classes } = this.props;

        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
