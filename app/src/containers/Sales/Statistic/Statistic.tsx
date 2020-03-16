import React, { Component } from 'react';
import { createStyles, WithStyles, Grid } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import Header from './Header';
import { ISalesStat } from '../../../interfaces/ISalesStat';
import ListHeader from './ListHeader';
import List from './List';

const styles = (theme: any) => createStyles({
    root: {
        maxWidth: 400
    }
});

interface IProps extends WithStyles<typeof styles> {
    salesStat: ISalesStat[];
}

@observer
class Statistic extends Component<IProps> {
    render() {
        const { classes, salesStat } = this.props;

        return (
            <Grid className={classes.root} direction='column' container>
                <Header />
                <ListHeader />
                <List salesStat={salesStat} />
            </Grid>
        );
    }
}

export default withStyles(styles)(Statistic);
