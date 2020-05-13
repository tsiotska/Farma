import React, { Component } from 'react';
import { withStyles, createStyles, WithStyles, Grid, Paper, Typography } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import Plot from '../Plot';
import Header from './Header';
import { IMedsSalesStat } from '../../interfaces/ISalesStat';
import { IMedicine } from '../../interfaces/IMedicine';
import { computed, toJS } from 'mobx';
import { IAsyncStatus } from '../../stores/AsyncStore';
import MedsStatistic from '../MedsStatistic';
import { IDepartment } from '../../interfaces/IDepartment';

const styles = (theme: any) => createStyles({
    root: {
        padding: '30px 20px'
    },
    departmentName: {
        fontFamily: 'Source Sans Pro SemiBold',
        color: theme.palette.primary.gray.secondary,
        fontSize: theme.typography.pxToRem(16),
        marginBottom: 12,
        textTransform: 'capitalize'
    },
    medStat: {
        margin: '0 12px'
    }
});

interface IProps extends WithStyles<typeof styles> {
    meds?: Map<number, IMedicine[]>;
    chartSalesStat?: IMedsSalesStat[];
    departments?: IDepartment[];
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
            getAsyncStatus,
            departments
        }
    }
}) => ({
    getAsyncStatus,
    loadAllMeds,
    chartSalesStat,
    loadMedsStat,
    meds,
    departments
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
    get medStatClasses() {
        const { classes } = this.props;
        return { root: classes.medStat };
    }

    @computed
    get medsList(): any {
        const { meds, chartSalesStat, departments, classes } = this.props;
        const res: any[] = [];
        meds.forEach((items, department) => {
            const targetDepartment = departments.find(({ id }) => id === department);

            const prepend = targetDepartment
                ? <Typography className={classes.departmentName}>{targetDepartment.name}</Typography>
                : null;

            res.push(
                <MedsStatistic
                    classes={this.medStatClasses}
                    key={department}
                    prepend={prepend}
                    departmentId={department}
                    meds={items}
                    chartSalesStat={chartSalesStat}
                />
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
        const { chartSalesStat, classes } = this.props;

        return (
            <Paper className={classes.root}>
                <Grid direction='column' container>
                    <Plot
                        chartSalesStat={chartSalesStat}
                        meds={this.meds}
                        header={<Header />}
                    />
                    <Grid justify='center' container>
                        { this.medsList }
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}

export default withStyles(styles)(AdminPage);
