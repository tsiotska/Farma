import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Typography } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { Line } from 'react-chartjs-2';
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
    readonly defaultLineParams: any = {
        fill: false,
        lineTension: 0.1,
        borderCapStyle: 'butt',
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
    };

    readonly data = {
        // labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'My First dataset',
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            // data: [65, 59, 80, 81, 56, 55, 40],
            data: [{x: 0, y: 2}, { x: 1, y: 4}, { x: 2, y: 5}],
            ...this.defaultLineParams
          },
          {
            label: 'My First dataset',
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: 'red',
            pointHoverBackgroundColor: 'green',
            pointHoverBorderColor: 'blue',
            // data: [100, 10, 20, 31, 65, 70],
            data: [{x: 0, y: 5}, { x: 1, y: 7}],
            ...this.defaultLineParams
          }
        ]
    };

    render() {
        const { classes } = this.props;

        return (
            <Grid direction='column' container>
                <Typography className={classes.header} variant='h5'>
                    Реализация препаратов за
                    <DataRangeButton />
                </Typography>
                <Line data={this.data} legend={{ display: false }} />
            </Grid>
        );
    }
}

export default withStyles(styles)(Plot);
