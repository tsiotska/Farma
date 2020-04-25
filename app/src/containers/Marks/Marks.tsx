import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Typography, LinearProgress, Paper, IconButton, Button } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IBonusInfo, IAgentInfo, IDrugSale } from '../../interfaces/IBonusInfo';
import TabItem from './TabItem';
import { IAsyncStatus } from '../../stores/AsyncStore';
import { computed, toJS } from 'mobx';
import ExcelIcon from '../../components/ExcelIcon';
import TransferBlock from './TransferBlock';
import { uaMonthsNames } from '../Sales/DateTimeUtils/DateTimeUtils';
import TableHeader from './TableHeader';
import Table from './Table';
import { IUser } from '../../interfaces';

const styles = (theme: any) => createStyles({
    root: {
        padding: '0 20px'
    },
    title: {
        marginBottom: 20
    },
    paper: {
        padding: 20
    }
});

interface IProps extends WithStyles<typeof styles> {
    loadBonuses?: () => void;
    bonuses?: IBonusInfo[];
    getAsyncStatus?: (key: string) => IAsyncStatus;
    loadLocationsAgents?: () => void;
    previewBonus?: IBonusInfo;
}

@inject(({
    appState: {
        userStore: {
            loadBonuses,
            bonuses,
            getAsyncStatus,
            previewBonus,
        },
        departmentsStore: {
            loadLocationsAgents,
        }
    }
}) => ({
    loadBonuses,
    bonuses,
    previewBonus,
    getAsyncStatus,
    loadLocationsAgents,
}))
@observer
class Marks extends Component<IProps> {
    @computed
    get isBonusesLoading(): boolean {
        return this.props.getAsyncStatus('').loading;
    }

    @computed
    get isBonusDataLoading(): boolean {
        return this.props.getAsyncStatus('').loading;
    }

    @computed
    get previewBonusId(): number {
        const { previewBonus } = this.props;
        return previewBonus
            ? previewBonus.id
            : null;
    }

    @computed
    get monthName(): string {
        const { previewBonus } = this.props;
        const month = previewBonus
            ? previewBonus.month
            : null;
        return uaMonthsNames[month];
    }

    @computed
    get agents(): IAgentInfo[] {
        const { previewBonus } = this.props;
        // return [
        //     {
        //         id: 1,
        //         lastPayment: 3,
        //         lastDeposit: 5,
        //         marks: new Map(),
        //     }
        // ];
        return previewBonus
            ? previewBonus.agents
            : [];
    }

    @computed
    get sales(): Map<number, IDrugSale>  {
        const { previewBonus } = this.props;
        return previewBonus
            ? previewBonus.sales
            : new Map();
    }

    @computed
    get showLpuColumn(): boolean {
        return true;
    }

    async componentDidMount() {
        this.props.loadBonuses();
        this.props.loadLocationsAgents();
    }

    render() {
        const { bonuses, classes } = this.props;
        console.log('bonuses: ', toJS(bonuses));
        return (
            <Grid className={classes.root} direction='column' container>
                <Typography variant='h5' className={classes.title}>
                    Бонуси
                </Typography>

                {
                    bonuses && <Grid container alignItems='center'>
                        {
                            bonuses.map(bonusInfo => (
                                <TabItem
                                    key={bonusInfo.id}
                                    bonus={bonusInfo}
                                    selected={this.previewBonusId === bonusInfo.id}/>
                            ))
                        }
                    </Grid>
                }
                {
                    (this.isBonusDataLoading || this.isBonusesLoading) &&
                    <LinearProgress />
                }
                <Paper className={classes.paper}>
                    <Grid alignItems='center' justify='space-between' container>
                        <Typography variant='h5'>
                            Виплати { this.monthName && ` за ${this.monthName}` }
                        </Typography>
                        <IconButton>
                            <ExcelIcon />
                        </IconButton>
                    </Grid>
                    <Grid alignItems='flex-end' justify='space-between' container>
                        <TransferBlock />
                        <Button>
                            Додати лікаря
                        </Button>
                    </Grid>
                    <TableHeader showLpu={this.showLpuColumn} sales={this.sales} />
                    <Table showLpu={this.showLpuColumn} agents={this.agents} />
                </Paper>
            </Grid>
        );
    }
}

export default withStyles(styles)(Marks);
