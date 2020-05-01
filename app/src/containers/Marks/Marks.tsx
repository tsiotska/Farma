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
import { ArrowLeft, ArrowRight } from '@material-ui/icons';
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
import ExcelLoadPopper from './ExcelLoadPoppper';
import { ADD_DOC_MODAL } from '../../constants/Modals';
import AddDocsModal from './AddDocsModal';

const styles = (theme: any) => createStyles({
    root: {
        padding: '0 20px'
    },
    title: {
        marginBottom: 20
    },
    paper: {
        padding: 20
    },
    iconButton: {
        borderRadius: 2,
        minHeight: 64
    },
    addDocButton: {

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
    bonusesYear?: number;
    setBonusesYear?: (value: number, shouldPostData: boolean) => void;
    updateBonuses?: () => void;
    openModal?: (modalName: string) => void;
}

@inject(({
    appState: {
        userStore: {
            loadBonuses,
            bonuses,
            getAsyncStatus,
            previewBonus,
            role,
            bonusesYear,
            setBonusesYear,
            updateBonuses,

        },
        departmentsStore: {
            loadLocationsAgents,
            loadDoctors
        },
        uiStore: {
            openModal
        }
    }
}) => ({
    loadBonuses,
    bonuses,
    previewBonus,
    getAsyncStatus,
    loadLocationsAgents,
    loadDoctors,
    role,
    openModal,
    bonusesYear,
    setBonusesYear,
    updateBonuses,
}))
@observer
class Marks extends Component<IProps> {
    readonly currentYear = new Date().getFullYear();

    @observable excelPopperAnchor: HTMLElement = null;
    @observable changedAgents: IAgentInfo[] = [];

    @computed
    get isBonusesLoading(): boolean {
        return this.props.getAsyncStatus('loadBonuses').loading;
    }

    @computed
    get isBonusDataLoading(): boolean {
        return this.props.getAsyncStatus('loadBonusesData').loading;
    }

    @computed
    get previewBonusMonth(): number {
        const { previewBonus } = this.props;
        return previewBonus
            ? previewBonus.month
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

    incrementYear = () => {
        const { setBonusesYear, bonusesYear, role } = this.props;
        setBonusesYear(bonusesYear, role === USER_ROLE.MEDICAL_AGENT);
    }

    decrementYear = () => {
        const { setBonusesYear, bonusesYear, role } = this.props;
        setBonusesYear(bonusesYear - 1, role === USER_ROLE.MEDICAL_AGENT);
    }

    openExcelPopper = ({ target }: any) => {
        this.excelPopperAnchor = target;
    }

    closeExcelPopper = () => {
        this.excelPopperAnchor = null;
    }

    openAddDocModal = () => this.props.openModal(ADD_DOC_MODAL);

    componentDidUpdate({ role: prevRole }: IProps) {
        const { role: currentRole, loadDoctors, loadLocationsAgents, loadBonuses } = this.props;

        if (prevRole === currentRole) return;

        if (currentRole === USER_ROLE.MEDICAL_AGENT) {
            loadDoctors();
        } else {
            loadLocationsAgents();
        }
        loadBonuses();
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

    componentWillUnmount() {
        const { updateBonuses, role, setBonusesYear } = this.props;
        if (role === USER_ROLE.MEDICAL_AGENT) updateBonuses();
        setBonusesYear(new Date().getFullYear(), role === USER_ROLE.MEDICAL_AGENT);
    }

    render() {
        const {
                bonuses,
                classes,
                bonusesYear,
                updateBonuses,
                role,
            } = this.props;

        return (
            <Grid className={classes.root} direction='column' container>
                <Typography variant='h5' className={classes.title}>
                    Бали за {bonusesYear} рік
                </Typography>
                <Grid container alignItems='center'>
                    <IconButton
                        onClick={this.decrementYear}
                        disabled={!bonuses || !bonuses.length}
                        className={classes.iconButton}>
                        <ArrowLeft fontSize='small' />
                    </IconButton>
                    {
                        bonuses && bonuses.map(bonusInfo => (
                            <TabItem
                                key={bonusInfo.month}
                                bonus={bonusInfo}
                                selected={this.previewBonusMonth === bonusInfo.month}
                            />
                        ))
                    }
                    <IconButton
                        disabled={bonusesYear >= this.currentYear}
                        onClick={this.incrementYear}
                        className={classes.iconButton}>
                        <ArrowRight fontSize='small' />
                    </IconButton>
                </Grid>

                {
                    (this.isBonusDataLoading || this.isBonusesLoading) &&
                    <LinearProgress />
                }
                <Paper className={classes.paper}>
                    <Grid alignItems='center' justify='space-between' container>
                        <Typography variant='h5'>
                            Бали { this.monthName && ` за ${this.monthName}` }
                        </Typography>
                        {
                            role !== USER_ROLE.MEDICAL_AGENT &&
                            <>
                            <IconButton onClick={
                                this.excelPopperAnchor
                                    ? this.closeExcelPopper
                                    : this.openExcelPopper
                                }>
                                <ExcelIcon />
                            </IconButton>
                            <ExcelLoadPopper
                                anchor={this.excelPopperAnchor}
                                closeHandler={this.closeExcelPopper}
                            />
                            </>
                        }
                    </Grid>
                    <Grid alignItems='flex-end' justify='space-between' container>
                        <TransferBlock updateBonuses={updateBonuses} />
                        {
                            role === USER_ROLE.MEDICAL_AGENT &&
                            <Button
                                className={classes.addDocButton}
                                onClick={this.openAddDocModal}>
                                Додати лікаря
                            </Button>
                        }
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
                <AddDocsModal />
            </Grid>
        );
    }
}

export default withStyles(styles)(Marks);
