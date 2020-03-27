import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Typography } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { Line } from 'react-chartjs-2';
import {
    eachMonthOfInterval,
    eachYearOfInterval,
    eachDayOfInterval,
    lightFormat,
    differenceInCalendarMonths,
    getDate
} from 'date-fns';
import { observable } from 'mobx';
import DataRangeButton from '../DataRangeButton';
import {
    IPeriodSalesStat,
    IDaySalesStat,
    IMonthSalesStat,
    IYearSalesStat,
    IMedsSalesStat
} from '../../../interfaces/ISalesStat';
import { IMedicine } from '../../../interfaces/IMedicine';
import { DisplayMode } from '../../../stores/SalesStore';
import { uaMonthsNames } from '../DateTimeUtils/DateTimeUtils';
import { IAsyncStatus } from '../../../stores/AsyncStore';
import LoadingMask from '../../../components/LoadingMask';

const styles = (theme: any) => createStyles({
    header: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: theme.spacing(2)
    },
    root: {
        overflow: 'hidden',
        paddingBottom: 50,
        maxHeight: 500,
        minHeight: 250,
        height: '33vw'
    }
});

interface IProps extends WithStyles<typeof styles> {
    chartSalesStat: IMedsSalesStat[];
    dateFrom?: Date;
    dateTo?: Date;
    meds?: Map<number, IMedicine>;
    displayMode?: DisplayMode;
    medsDisplayStatus?: Map<number, boolean>;
    getAsyncStatus?: (key: string) => IAsyncStatus;
}

type LabelType = 'year' | 'month' | 'day' | 'unknown';

@inject(({
    appState: {
        salesStore: {
            dateFrom,
            dateTo,
            displayMode,
            medsDisplayStatus,
            getAsyncStatus
        },
        departmentsStore: {
            meds
        }
    }
}) => ({
    dateFrom,
    dateTo,
    meds,
    displayMode,
    medsDisplayStatus,
    getAsyncStatus
}))
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
        pointBorderColor: 'white',
    };

    get isLoading(): boolean {
        return this.props.getAsyncStatus('loadMedsStat').loading;
    }

    get data(): any {
        return {
            labels: this.getLabels(),
            datasets: this.getDataSets()
        };
    }

    get labelType(): LabelType {
        const { chartSalesStat } = this.props;

        if (chartSalesStat === null) return 'unknown';

        for (const saleStat of chartSalesStat) {
            for (const timeSpanStat of saleStat.periods) {
                const { day, year, month } = (timeSpanStat as any);
                if (day !== undefined) return 'day';
                if (month !== undefined) return 'month';
                if (year !== undefined) return 'year';
            }
        }
        return 'unknown';
    }

    get eachIntervalDay(): Date[] {
        const { dateFrom: start, dateTo: end } = this.props;
        if (!start || !end) return [];

        switch (this.labelType) {
            case 'day': return eachDayOfInterval({ start, end });
            case 'month': return eachMonthOfInterval({ start, end });
            case 'year': return eachYearOfInterval({ start, end });
            default: return [];
        }
    }

    getDataSets = (): any[] => {
        const {
            chartSalesStat,
            meds,
            displayMode,
            medsDisplayStatus
        } = this.props;

        if (!chartSalesStat || !meds || this.labelType === 'unknown') return [];

        const comparer = this.getDateComparer();
        const propName = displayMode === 'currency'
        ? 'money'
        : 'amount';

        return chartSalesStat.map(x => {
            const medicine = meds.get(x.medId);

            if (!medicine || !medsDisplayStatus.get(x.medId)) return;

            let i: number = 0;
            const data = this.eachIntervalDay.map((day: Date) => {
                const period = comparer(day, x.periods, i);

                if (period) {
                    i += 1;
                    return period[propName];
                }

                return 0;
            });

            return {
                label: medicine.name,
                data,
                borderColor: medicine.color,
                pointBackgroundColor: medicine.color,

                pointHoverBackgroundColor: medicine.color,
                ...this.defaultLineParams
            };
        }).filter(x => !!x);
    }

    getDateComparer = (): (day: Date, periods: IPeriodSalesStat[], from: number) => IPeriodSalesStat => {
        switch (this.labelType) {
            case 'day': return this.dayComparer;
            case 'month': return this.monthComparer;
            case 'year': return this.yearComparer;
        }
    }

    getLabels = (): string[] => {
        switch (this.labelType) {
            case 'day': return this.getDayLabels();
            case 'month': return this.getMonthLabels();
            case 'year': return this.getYearLabels();
            default: return [];
        }
    }

    dayComparer = (day: Date, periods: IDaySalesStat[], from: number): IDaySalesStat => {
        const dayOfMonth = getDate(day);

        for (let i = from; i < periods.length; ++i) {
            if (periods[i].day === dayOfMonth) return periods[i];
        }
    }

    monthComparer = (day: Date, periods: IMonthSalesStat[], from: number): IMonthSalesStat => {
        const month = day.getMonth();

        for (let i = from; i < periods.length; ++i) {
            if (periods[i].month === month) return periods[i];
        }
    }

    yearComparer = (day: Date, periods: IYearSalesStat[], from: number): IYearSalesStat => {
        const year = day.getFullYear();

        for (let i = from; i < periods.length; ++i) {
            if (periods[i].year === year) return periods[i];
        }
    }

    getDayLabels = (): string[] => this.eachIntervalDay.map(day => lightFormat(day, 'dd.MM'));

    getMonthLabels = (): string[] => differenceInCalendarMonths(this.props.dateFrom, this.props.dateTo) <= 12
    ? this.eachIntervalDay.map(day => lightFormat(day, 'MM'))
    : this.eachIntervalDay.map(day => lightFormat(day, 'MM.yyyy'))

    getYearLabels = (): string[] => this.eachIntervalDay.map(day => lightFormat(day, 'yyyy'));

    titleRenderer = (tooltips: any[]) => {
        const initialLabel = tooltips[0].label;
        const monthNumber = +initialLabel;
        const actualMonthNumber = monthNumber === 0
        ? 11
        : monthNumber - 1;
        return uaMonthsNames[actualMonthNumber] || initialLabel;
    }

    render() {
        const { classes } = this.props;

        return (
            <Grid className={classes.root} wrap='nowrap' direction='column' container>
                <Typography className={classes.header} variant='h5'>
                    Реализація препаратів за
                    <DataRangeButton />
                </Typography>
                {
                    this.isLoading
                    ? <LoadingMask />
                    : <Line
                        data={this.data}
                        legend={{ display: false }}
                        options={{
                            maintainAspectRatio: false,
                            tooltips: { callbacks: {
                                title: this.titleRenderer
                            } },
                        }}
                      />
                }
            </Grid>
        );
    }
}

export default withStyles(styles)(Plot);
