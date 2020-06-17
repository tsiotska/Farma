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
import { IBonusInfo, IAgentInfo, IDrugSale, IMark } from '../../interfaces/IBonusInfo';
import TabItem from './TabItem';
import { IAsyncStatus } from '../../stores/AsyncStore';
import { computed, toJS, observable, reaction } from 'mobx';
import ExcelIcon from '../../components/ExcelIcon';
import TransferBlock from './TransferBlock';
import { uaMonthsNames } from '../../components/DateTimeUtils/DateTimeUtils';
import TableHeader from './TableHeader';
import Table from './Table';
import { USER_ROLE } from '../../constants/Roles';
import ExcelLoadPopper from './ExcelLoadPoppper';
import { ADD_DOC_MODAL, ADD_BONUS_MODAL } from '../../constants/Modals';
import AddBonusModal from './AddBonusModal';
import MonthPicker from './MonthPicker';
import { IUser } from '../../interfaces';
import { IUserLikeObject } from '../../stores/DepartmentsStore';
import DeletePopover from '../../components/DeletePopover';

const styles = (theme: any) => createStyles({
    root: {
        padding: '0 20px',
        paddingBottom: 120
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
        color: theme.palette.primary.green.main,
        borderColor: theme.palette.primary.green.main,
        backgroundColor: 'white',
        border: '1px solid',
        minWidth: 150,
        '&:hover': {
            backgroundColor: '#f3f3f3',
        }
    }
});

interface IProps extends WithStyles<typeof styles> {
    bonuses: Partial<Record<USER_ROLE, IBonusInfo[]>>;
    previewBonusMonth: number;

    role?: USER_ROLE;
    bonusesYear?: number;
    previewUser?: IUser;
    updateBonus?: (bonus: IBonusInfo, sale: boolean) => void;
    loadBonuses?: (user: IUserLikeObject) => void;
    getAsyncStatus?: (key: string) => IAsyncStatus;
    openModal?: (modalName: string) => void;
    loadBonusesData?: (user: IUserLikeObject) => void;
    clearChangedMarks?: () => void;
    changedMarks?: Map<number, Map<number, IMark>>;
    setPreviewBonusMonth?: (month: number, status: boolean) => void;
}

@inject(({
             appState: {
                 userStore: {
                     loadBonuses,
                     getAsyncStatus,
                     // previewBonus,
                     role,
                     bonusesYear,
                     previewUser,
                     // setPreviewBonus
                     loadBonusesData,
                     previewBonusMonth,
                     bonuses,
                     clearChangedMarks,
                     updateBonus,
                     changedMarks,
                     setPreviewBonusMonth
                 },
                 uiStore: {
                     openModal
                 }
             }
         }) => ({
    previewBonusMonth,
    loadBonuses,
    loadBonusesData,
    // previewBonus,
    bonuses,
    getAsyncStatus,
    role,
    openModal,
    bonusesYear,
    updateBonus,
    previewUser,
    clearChangedMarks,
    changedMarks,
    setPreviewBonusMonth
}))
@observer
class Marks extends Component<IProps> {
    readonly currentYear = new Date().getFullYear();
    reactionDisposer: any;
    monthReaction: any;
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
        const { previewBonusMonth } = this.props;
        return uaMonthsNames[previewBonusMonth];
    }

    @computed
    get isUserMedicalAgent(): boolean {
        return this.props.role === USER_ROLE.MEDICAL_AGENT;
    }

    get previewBonus(): IBonusInfo {
        const { bonuses, previewBonusMonth, previewUser } = this.props;
        // console.log(previewUser.position);
        const targetBonus = previewUser.position in bonuses
            ? bonuses[previewUser.position].find(x => x.month === previewBonusMonth)
            : null;
        return targetBonus || null;
    }

    openExcelPopper = ({ target }: any) => {
        this.excelPopperAnchor = target;
    }

    closeExcelPopper = () => {
        this.excelPopperAnchor = null;
    }

    openAddDocModal = () => this.props.openModal(ADD_DOC_MODAL);

    async componentDidMount() {
        const { loadBonuses, loadBonusesData } = this.props;
        await loadBonuses(this.props.previewUser);
        await loadBonusesData(this.props.previewUser);
        this.reactionDisposer = reaction(
            () => this.props.previewUser,
            async (user: IUserLikeObject) => {
                await loadBonuses(user);
                loadBonusesData(user);
            }
        );
        this.monthReaction = reaction(
            () => this.props.previewBonusMonth,
            () => {
                const { previewUser, clearChangedMarks } = this.props;
                clearChangedMarks();
                loadBonusesData(previewUser);
            }
        );
    }

    componentWillUnmount() {
        if (this.reactionDisposer) this.reactionDisposer();
        if (this.monthReaction) this.monthReaction();
    }

    clickHandler = (month: number, status: boolean) => {
        const { setPreviewBonusMonth } = this.props;
        this.dataAutosaving();
        setPreviewBonusMonth(month, status);
    }

    dataAutosaving = async () => {
        const { role, previewUser, updateBonus, changedMarks } = this.props;
        const condition = role === USER_ROLE.MEDICAL_AGENT
            && (previewUser ? previewUser.position : null) === USER_ROLE.MEDICAL_AGENT
            && changedMarks.size;
        console.log(condition);
        if (condition) {
            console.log(toJS(this.previewBonus));
            await updateBonus(this.previewBonus, false);
        }
    }

    render() {
        const {
            classes,
            bonusesYear,
            role,
            previewUser,
            bonuses,
        } = this.props;

        return (
            <Grid className={classes.root} direction='column' container>
                <Typography variant='h5' className={classes.title}>
                    Бали за {bonusesYear} рік
                </Typography>
                <MonthPicker
                    clickHandler={this.clickHandler}
                    bonuses={bonuses[previewUser.position]}
                    isLoading={this.isBonusesLoading || this.isBonusDataLoading}
                />
                <Paper className={classes.paper}>
                    <Grid alignItems='center' justify='space-between' container>
                        <Typography variant='h5'>
                            Бали {this.monthName && ` за ${this.monthName}`}
                        </Typography>
                        {
                            role !== USER_ROLE.MEDICAL_AGENT &&
                            <>
                                <IconButton onClick={
                                    this.excelPopperAnchor
                                        ? this.closeExcelPopper
                                        : this.openExcelPopper
                                }>
                                    <ExcelIcon/>
                                </IconButton>

                                <ExcelLoadPopper
                                    anchor={this.excelPopperAnchor}
                                    closeHandler={this.closeExcelPopper}
                                />
                            </>
                        }
                    </Grid>
                    <Grid alignItems='flex-end' justify='space-between' container>
                        <TransferBlock parentUser={previewUser} previewBonus={this.previewBonus}/>
                        {
                            role === USER_ROLE.MEDICAL_AGENT &&
                            <Button
                                disabled={!this.previewBonus}
                                className={classes.addDocButton}
                                onClick={this.openAddDocModal}>
                                Додати лікаря
                            </Button>
                        }
                    </Grid>
                    <TableHeader
                        previewBonus={this.previewBonus}
                        isMedicalAgent={this.isUserMedicalAgent}
                        parentUser={previewUser}
                        isNested={false}
                    />
                    {
                        !!this.previewBonus &&
                        <Table
                            previewBonus={this.previewBonus}
                            isLoading={this.isBonusesLoading || this.isBonusDataLoading}
                            parentUser={previewUser}
                            isNested={false}
                        />
                    }
                </Paper>
                <AddBonusModal/>
                <DeletePopover
                    name='deleteBonusAgent'
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                />
            </Grid>
        );
    }
}

export default withStyles(styles)(Marks);
