import React, { Component } from 'react';
import { createStyles, WithStyles, Grid } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import Header from './Header';

const styles = (theme: any) => createStyles({
    root: {
        maxWidth: 400
    }
});

interface IProps extends WithStyles<typeof styles> {

}

@observer
class Statistic extends Component<IProps> {
    render() {
        const { classes } = this.props;

        return (
            <Grid className={classes.root} direction='column' container>
                <Header />
            </Grid>
        );
    }
}

export default withStyles(styles)(Statistic);
