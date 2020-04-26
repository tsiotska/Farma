import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    Grid,
    Typography,
    LinearProgress,
    Paper,
    IconButton,
    Button
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IBonusInfo, IAgentInfo, IDrugSale } from '../../interfaces/IBonusInfo';
import TabItem from './TabItem';
import { IAsyncStatus } from '../../stores/AsyncStore';
import { computed, toJS, observable } from 'mobx';
import ExcelIcon from '../../components/ExcelIcon';
import TransferBlock from './TransferBlock';
import { uaMonthsNames } from '../Sales/DateTimeUtils/DateTimeUtils';
import TableHeader from './TableHeader';
import Table from './Table';
import { USER_ROLE } from '../../constants/Roles';

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
    role?: USER_ROLE;
    loadDoctors?: () => void;
}

@inject(({
    appState: {
        userStore: {
            loadBonuses,
            bonuses,
            getAsyncStatus,
            previewBonus,
            role
        },
        departmentsStore: {
            loadLocationsAgents,
            loadDoctors
        }
    }
}) => ({
    loadBonuses,
    bonuses,
    previewBonus,
    getAsyncStatus,
    loadLocationsAgents,
    loadDoctors,
    role
}))
@observer
class Marks extends Component<IProps> {
    @observable changedAgents: IAgentInfo[] = [];

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
    get totalSoldCount(): {[key: number]: number} {
        const { previewBonus } = this.props;

        if (!previewBonus) return {};

        const agentsMarks = previewBonus.agents.map(({ marks }) => (
            [...marks.values()]
        )).reduce((total, curr) => {
                total.push(...curr);
                return total;
            }, []
        );

        const obj: any = agentsMarks.reduce(
            (total, curr) => {
                const { deposit, payments, drugId } = curr;
                total[drugId] = (total[drugId] || 0) + deposit + payments;
                return total;
            },
            {}
        );

        return obj;
    }

    @computed
    get showLpuColumn(): boolean {
        return this.props.role === USER_ROLE.MEDICAL_AGENT;
    }

    componentDidUpdate({ role: prevRole }: IProps) {
        const { role: currentRole, loadDoctors, loadLocationsAgents } = this.props;

        if (prevRole === currentRole) return;

        if (currentRole === USER_ROLE.MEDICAL_AGENT) {
            loadDoctors();
        } else {
            loadLocationsAgents();
        }
    }

    componentDidMount() {
        const { role, loadBonuses, loadLocationsAgents, loadDoctors } = this.props;
        loadBonuses();
        if (role === USER_ROLE.MEDICAL_AGENT) {
            loadDoctors();
        } else {
            loadLocationsAgents();
        }
    }

    render() {
        const { bonuses, classes } = this.props;

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
                    <TableHeader
                        showLpu={this.showLpuColumn}
                        sales={this.sales}
                        totalSold={this.totalSoldCount}
                    />
                    <Table
                        sales={this.sales}
                        totalSold={this.totalSoldCount}
                        showLpu={this.showLpuColumn}
                        agents={this.agents} />
                </Paper>
            </Grid>
        );
    }
}

export default withStyles(styles)(Marks);
