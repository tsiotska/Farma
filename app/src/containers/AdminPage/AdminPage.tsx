import React, { Component } from 'react';
import { withStyles, createStyles, WithStyles, Grid } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import Plot from '../Plot';
import Header from './Header';
import { IMedsSalesStat } from '../../interfaces/ISalesStat';
import { IMedicine } from '../../interfaces/IMedicine';
import { computed, toJS } from 'mobx';
import { IAsyncStatus } from '../../stores/AsyncStore';
import MedsStatistic from '../MedsStatistic';

const styles = (theme: any) => createStyles({});

interface IProps extends WithStyles<typeof styles> {
    meds?: Map<number, IMedicine[]>;
    chartSalesStat?: IMedsSalesStat[];
    loadAllMeds?: () => void;
    loadMedsStat?: () => void;
    getAsyncStatus?: (key: string) => IAsyncStatus;
}

@inject(({
    appState: {
        salesStore: {
            chartSalesStat,
            loadMedsStat
        },
        departmentsStore: {
            meds,
            loadAllMeds,
            getAsyncStatus
        }
    }
}) => ({
    getAsyncStatus,
    loadAllMeds,
    chartSalesStat,
    loadMedsStat,
    meds
}))
@observer
class AdminPage extends Component<IProps> {
    @computed
    get meds(): Map<number, IMedicine> {
        const { meds, chartSalesStat } = this.props;
        const ids = (chartSalesStat || []).map(({ medId }) => medId);
        const filteredMeds: IMedicine[] = [];
        meds.forEach(medsList => {
            const filtered = medsList.filter(({ id }) => ids.includes(id));
            filteredMeds.push(...filtered);
        });
        const mapped: Array<[number, IMedicine]> = filteredMeds.map(x => ([ x.id, x ]));
        return new Map(mapped);
    }

    @computed
    get medsList(): any {
        const { meds, chartSalesStat } = this.props;
        const res: any[] = [];
        meds.forEach((items, department) => {
            res.push(
                <MedsStatistic key={department} departmentId={department} meds={items} chartSalesStat={chartSalesStat} />
            );
        });
        return res;
    }

    componentDidMount() {
        const {
            loadMedsStat,
            loadAllMeds,
            getAsyncStatus
        } = this.props;
        const { loading, success } = getAsyncStatus('loadAllMeds');
        if (!loading && !success) loadAllMeds();
        loadMedsStat();
    }

    render() {
        const { chartSalesStat } = this.props;

        return (
            <Grid direction='column' container>
                <Plot
                    chartSalesStat={chartSalesStat}
                    meds={this.meds}
                    header={<Header />}
                />
                <Grid container>
                    { this.medsList }
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(AdminPage);
