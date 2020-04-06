import React, { Component } from 'react';
import { withStyles, createStyles, WithStyles, Grid } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import Plot from '../Plot';
import Header from './Header';
import { IMedsSalesStat } from '../../interfaces/ISalesStat';

const styles = (theme: any) => createStyles({});

interface IProps extends WithStyles<typeof styles> {
    chartSalesStat?: IMedsSalesStat[];
    loadMedsStat?: () => void;
}

@inject(({
    appState: {
        salesStore: {
            chartSalesStat,
            loadMedsStat
        }
    }
}) => ({
    chartSalesStat,
    loadMedsStat
}))
@observer
class AdminPage extends Component<IProps> {
    componentDidMount() {
        const { loadMedsStat } = this.props;
        loadMedsStat();
    }

    render() {
        const { chartSalesStat } = this.props;

        return (
            <Grid direction='column' container>
                {/* <Plot chartSalesStat={chartSalesStat} header={<Header />} /> */}
            </Grid>
        );
    }
}

export default withStyles(styles)(AdminPage);
