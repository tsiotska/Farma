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
import { ArrowLeft, ArrowRight, Add } from '@material-ui/icons';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IBonusInfo, IAgentInfo, IDrugSale } from '../../interfaces/IBonusInfo';
import TabItem from './TabItem';
import { IAsyncStatus } from '../../stores/AsyncStore';
import { computed, toJS, observable, reaction } from 'mobx';
import ExcelIcon from '../../components/ExcelIcon';
import TransferBlock from './TransferBlock';
import { uaMonthsNames } from '../Sales/DateTimeUtils/DateTimeUtils';
import TableHeader from './TableHeader';
import Table from './Table';
import { USER_ROLE } from '../../constants/Roles';
import ExcelLoadPopper from './ExcelLoadPoppper';
import { ADD_DOC_MODAL, ADD_BONUS_MODAL } from '../../constants/Modals';
import AddDocsModal from './AddDocsModal';
import AddBonusModal from './AddBonusModal';
import MonthPicker from './MonthPicker';
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
    },
    addDocButton: {}
});

interface IProps extends WithStyles<typeof styles> {
    loadBonuses?: () => void;
    getAsyncStatus?: (key: string) => IAsyncStatus;
    previewBonus?: IBonusInfo;
    role?: USER_ROLE;
    bonusesYear?: number;
    updateBonuses?: () => void;
    openModal?: (modalName: string) => void;
    previewUser?: IUser;
    setPreviewBonus?: (previewBonus: IBonusInfo) => void;
}

@inject(({
    appState: {
        userStore: {
            loadBonuses,
            getAsyncStatus,
            previewBonus,
            role,
            bonusesYear,
            updateBonuses,
            previewUser,
            setPreviewBonus
        },
        uiStore: {
            openModal
        }
    }
}) => ({
    loadBonuses,
    previewBonus,
    getAsyncStatus,
    role,
    openModal,
    bonusesYear,
    updateBonuses,
    previewUser,
    setPreviewBonus
}))
@observer
class Marks extends Component<IProps> {
    readonly currentYear = new Date().getFullYear();
    reactionDisposer: any;
    @observable excelPopperAnchor: HTMLElement = null;

    @computed
    get isBonusesLoading(): boolean {
        return this.props.getAsyncStatus('loadBonuses').loading;
    }

    @computed
    get isBonusDataLoading(): boolean {
        return this.props.getAsyncStatus('loadBonusesData').loading;
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
    get showLpuColumn(): boolean {
        return this.props.role === USER_ROLE.MEDICAL_AGENT;
    }

    openExcelPopper = ({ target }: any) => {
        this.excelPopperAnchor = target;
    }

    closeExcelPopper = () => {
        this.excelPopperAnchor = null;
    }

    openAddDocModal = () => this.props.openModal(ADD_DOC_MODAL);

    componentDidMount() {
        this.props.loadBonuses();
        this.reactionDisposer = reaction(
            () => this.props.role,
            () => {
                const { loadBonuses, setPreviewBonus } = this.props;
                setPreviewBonus(null);
                loadBonuses();
            }
        );
    }

    componentWillUnmount() {
        const { updateBonuses, role } = this.props;
        this.reactionDisposer();
        if (role === USER_ROLE.MEDICAL_AGENT) updateBonuses();
    }

    render() {
        const {
            classes,
            bonusesYear,
            updateBonuses,
            previewBonus,
            role,
            previewUser
        } = this.props;

        return (
            <Grid className={classes.root} direction='column' container>
                <Typography variant='h5' className={classes.title}>
                    Бали за {bonusesYear} рік
                </Typography>
                <MonthPicker isLoading={this.isBonusesLoading || this.isBonusDataLoading} />
                {/* {
                    (this.isBonusDataLoading || this.isBonusesLoading) &&
                    <LinearProgress />
                } */}
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
                    <TableHeader showLpu={this.showLpuColumn} />
                    {
                        !!previewBonus &&
                        <Table
                            isLoading={this.isBonusesLoading || this.isBonusDataLoading}
                            parentUser={previewUser}
                        />
                    }
                </Paper>
                <AddBonusModal />
            </Grid>
        );
    }
}

export default withStyles(styles)(Marks);
