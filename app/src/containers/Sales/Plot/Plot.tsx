import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Typography } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import DataRangeButton from '../DataRangeButton';

const styles = (theme: any) => createStyles({
    header: {
        display: 'flex',
        alignItems: 'center'
    }
});

interface IProps extends WithStyles<typeof styles> {

}

@observer
class Plot extends Component<IProps> {
    render() {
        const { classes } = this.props;

        return (
            <Grid direction='column' container>
                <Typography className={classes.header} variant='h5'>
                    Реализация препаратов за
                    <DataRangeButton />
                </Typography>
            </Grid>
        );
    }
}

export default withStyles(styles)(Plot);
