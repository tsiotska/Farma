import React, { Component } from 'react';
import { createStyles, WithStyles, Typography, Grid } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import DrugsTable from '../../components/DrugsTable';

const styles = (theme: any) => createStyles({
    root: {
        padding: '0 20px'
    }
});

interface IProps extends WithStyles<typeof styles> {

}

@observer
class Sales extends Component<IProps> {
    render() {
        const { classes } = this.props;

        return (
            <Grid className={classes.root} direction='column' container>
                <Typography variant='h5'>
                    Продажи
                </Typography>
                <DrugsTable
                    headers={['qwer', 'qwer1', 'qwer2', 'qwer3']}
                    data={[[4, 2, 5, 2]]}
                />
            </Grid>
        );
    }
}

export default withStyles(styles)(Sales);
