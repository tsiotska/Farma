import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    TableContainer,
    TableBody,
    Table as MuiTable,
    Paper,
    Collapse,
    LinearProgress,
    Typography,
    Button,
    Grid,
    IconButton
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IAgentInfo, IDrugSale, IBonusInfo, IMark } from '../../../interfaces/IBonusInfo';
import { computed, observable, toJS, when, reaction } from 'mobx';
import TableRow from '../TableRow';
import { IUser } from '../../../interfaces';
import { IDoctor } from '../../../interfaces/IDoctor';
import { USER_ROLE } from '../../../constants/Roles';
import TotalRow from '../TotalRow';
import { IUserLikeObject } from '../../../stores/DepartmentsStore';
import AddDocsModal from '../AddDocsModal';
import { Close } from '@material-ui/icons';
import { ADD_DOC_MODAL } from '../../../constants/Modals';

const styles = (theme: any) => createStyles({
    fixedTable: {
        position: 'fixed',
        tableLayout: 'fixed',
        padding: '0 20px',
        bottom: 0,
    },
    emptyText: {
        marginBottom: 12
    },
    progress: {
        marginBottom: 12
    },
    submitButton: {
    },
    cancelChanges: {
        borderRadius: 2,
        padding: 8,
        marginLeft: 8
    },
    addDocButton: {
        marginLeft: 'auto',
        color: theme.palette.primary.green.main,
        borderColor: theme.palette.primary.green.main,
        backgroundColor: 'white',
        border: '1px solid',
        minWidth: 150,
        marginRight: 12,
        '&:hover': {
            backgroundColor: '#f3f3f3',
        }
    }
});

interface IProps extends WithStyles<typeof styles> {
    isLoading: boolean;
    parentUser: IUserInfo & IUserLikeObject;
    isNested: boolean;
    previewBonus: IBonusInfo;

    totalSold?: { [key: number]: number };
    changedMarks?: Map<number,  Map<number, IMark>>;
    currentDepartmentId?: number;
    role?: USER_ROLE;
    bonusUsers?: IUserLikeObject[];

    loadConfirmedDoctors?: (targetUser: IUserLikeObject) => IDoctor[];
    getLocationsAgents?: (depId: number, user: IUserLikeObject) => IUser[];
    loadBonuses?: (user: IUserLikeObject) => Promise<void>;
    loadBonusesData?: (user: IUserLikeObject) => Promise<void>;
    clearChangedMarks?: () => void;
    updateBonus?: (bonus: IBonusInfo, sale: boolean) => void;
    addBonusUser?: (user: IUserLikeObject) => void;
    removeBonusUser?: (user: IUserLikeObject) => void;
    openModal?: (modalName: string) => void;
}

export interface IUserInfo {
    id: number;
    name: string;
    LPUName?: string;
}

@inject(({
    appState: {
        departmentsStore: {
            loadConfirmedDoctors,
            getLocationsAgents,
            currentDepartmentId
        },
        userStore: {
            role,
            totalSold,
            loadBonuses,
            loadBonusesData,
            clearChangedMarks,
            changedMarks,
            updateBonus,
            addBonusUser,
            removeBonusUser,
            bonusUsers
        },
        uiStore: {
            openModal
        }
    }
}) => ({
    loadConfirmedDoctors,
    getLocationsAgents,
    currentDepartmentId,
    loadBonuses,
    loadBonusesData,
    role,
    totalSold,
    clearChangedMarks,
    changedMarks,
    updateBonus,
    addBonusUser,
    removeBonusUser,
    bonusUsers,
    openModal
}))
@observer
class Table extends Component<IProps> {
    readonly totalRowHeight: number = 48;
    reactionDisposer: any;
    initializationTimeout: any;

    @observable totalRowPosition: 'initial' | 'fixed' = 'fixed';
    @observable tableWidth: number = 0;
    @observable leftOffset: number = 0;
    @observable agents: IUserInfo[] = [];
    @observable agentsLoaded: boolean = false;

    @computed
    get agentsInfo(): IAgentInfo[] {
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
    get showTotalRow(): boolean {
        const { isNested } = this.props;
        return !!this.agents.length === true && isNested === false;
    }

    @computed
    get userIsMedicalAgent(): boolean {
        const { parentUser: { position }} = this.props;
        return position === USER_ROLE.MEDICAL_AGENT;
    }

    @computed
    get expandHandler(): (user: IUserLikeObject, isExpanded: boolean) => void {
        return this.userIsMedicalAgent
            ? null
            : this.expandChangeHandler;
    }

    @computed
    get tooltips(): {[key: number]: string} {
        const { totalSold } = this.props;

        return [...this.sales.values()].reduce(
            (total, curr) => {
                total[curr.id] = curr.amount - (totalSold[curr.id] || 0);
                return total;
            },
            {}
        );
    }

    get isEmpty(): boolean {
        return this.agentsLoaded && !this.preparedAgents.length;
    }

    get showButtons(): boolean {
        const { isNested, parentUser: { position }} = this.props;
        return isNested && position === USER_ROLE.MEDICAL_AGENT && !this.isEmpty;
    }

    get preparedAgents(): IUserInfo[] {
        const { parentUser: { position } } = this.props;
        if (position === USER_ROLE.MEDICAL_AGENT) {
            const res = this.agentsInfo.length
                ? this.agents.filter(x => this.agentsInfo.some(y => y.id === x.id))
                : [];
            return res;
        }
        return this.agents.slice(0, 50);
    }

    @computed
    get fixedTableStyles(): any {
        return {
            width: this.tableWidth,
            left: this.leftOffset,
        };
    }

    expandChangeHandler = (user: IUserLikeObject, isExpanded: boolean) => {
        const { addBonusUser, removeBonusUser } = this.props;
        if (isExpanded) addBonusUser(user);
        else removeBonusUser(user);
    }

    updateBonus = () => {
        const { updateBonus, previewBonus } = this.props;
        updateBonus(previewBonus, true);
    }

    openAddDocModal = () => this.props.openModal(ADD_DOC_MODAL);

    refHandler = (el: any) => {
        if (!el) return;
        const lastItemRect = el.getBoundingClientRect();
        this.tableWidth = lastItemRect.width + 40;
        this.leftOffset = lastItemRect.left - 20;

        this.totalRowPosition = window.innerHeight < document.body.offsetHeight
            ? 'fixed'
            : 'initial';
    }

    async componentDidMount() {
        const {
            loadConfirmedDoctors,
            getLocationsAgents,
            parentUser,
            currentDepartmentId,
            isNested,
            loadBonuses,
            loadBonusesData,
        } = this.props;

        this.initializationTimeout = window.setTimeout(async () => {
            if (isNested) {
                await loadBonuses(parentUser);
                await loadBonusesData(parentUser);
            }

            await when(() => this.props.isLoading === false);
            const newAgents = parentUser.position === USER_ROLE.MEDICAL_AGENT
                ? await loadConfirmedDoctors(parentUser)
                : await getLocationsAgents(currentDepartmentId, parentUser);
            this.agents = newAgents || [];
            this.agentsLoaded = true;
            this.reactionDisposer = reaction(
                () => this.props.role,
                () => { this.agents = []; }
            );
        }, 500);
    }

    componentWillUnmount() {
        if (this.reactionDisposer) this.reactionDisposer();
        const {
            removeBonusUser,
            clearChangedMarks,
            parentUser,
            previewBonus,
            updateBonus,
            role,
            changedMarks
        } = this.props;

        const condition = role === USER_ROLE.MEDICAL_AGENT
            && (parentUser ? parentUser.position : null) === USER_ROLE.MEDICAL_AGENT
            && !this.isEmpty
            && changedMarks.size;

        if (condition) {
            updateBonus(previewBonus, false);
        }

        clearChangedMarks();
        removeBonusUser(parentUser);
        window.clearTimeout(this.initializationTimeout);
    }

    render() {
        const {
            classes,
            role,
            isLoading,
            isNested,
            previewBonus,
            parentUser,
            changedMarks,
            clearChangedMarks,
            bonusUsers
        } = this.props;
        const { position } = parentUser;
        const lastIndex = this.agentsInfo.length - 1;
        console.log('parent: ', toJS(parentUser));
        return (
            <>
            { this.agentsLoaded === false && <LinearProgress className={classes.progress} /> }
            {
                isNested &&
                <>
                <Grid container className={classes.emptyText} alignItems='center'>
                    <Typography>
                        { position === USER_ROLE.REGIONAL_MANAGER && 'Медицинські представники' }
                        { position === USER_ROLE.MEDICAL_AGENT && 'Лікарі' }
                    </Typography>
                    {
                        this.showButtons &&
                        <>
                            <Button
                                disabled={!previewBonus}
                                className={classes.addDocButton}
                                onClick={this.openAddDocModal}>
                                Додати лікаря
                            </Button>
                            <Button
                                onClick={this.updateBonus}
                                className={classes.submitButton}
                                variant='contained'
                                disabled={!changedMarks.size}
                                color='primary'>
                                    Зберегти зміни
                            </Button>
                            <IconButton
                                disabled={!changedMarks.size}
                                onClick={clearChangedMarks}
                                className={classes.cancelChanges}>
                                <Close fontSize='small' />
                            </IconButton>
                        </>
                    }
                </Grid>
                {
                    this.isEmpty &&
                    <Typography variant='body2' className={classes.emptyText}>
                        Список { this.userIsMedicalAgent ? 'лікарів' : 'працівників' } пустий
                    </Typography>
                }
                </>
            }
            <TableContainer>
                <MuiTable padding='none'>
                    <TableBody>
                        {
                            this.preparedAgents.map((x, i) => (
                                <TableRow
                                    key={x.id}
                                    agentInfo={(this.agentsInfo || []).find(({ id }) => id === x.id)}
                                    isNested={isNested}
                                    agent={(x as IUserInfo & IUserLikeObject)}
                                    showLpu={this.userIsMedicalAgent}
                                    tooltips={this.tooltips}
                                    expanded={bonusUsers.some(({ id }) => id === x.id)}
                                    allowEdit={previewBonus ? !previewBonus.status : false}
                                    expandHandler={this.expandHandler}
                                    itemRef={
                                        i === lastIndex
                                            ? this.refHandler
                                            : null
                                    }
                                />
                            ))
                        }
                        {
                            (this.showTotalRow && this.totalRowPosition === 'initial') &&
                            <TotalRow
                                agents={this.agentsInfo}
                                position={this.totalRowPosition}
                                showLpu={this.userIsMedicalAgent}
                            />
                        }
                    </TableBody>
                </MuiTable>
            </TableContainer>
            {
                (this.showTotalRow && this.totalRowPosition === 'fixed') &&
                <TableContainer
                    component={Paper}
                    className={classes.fixedTable}
                    style={this.fixedTableStyles}>
                    <MuiTable padding='none'>
                        <TableBody>
                            <TotalRow
                                position={this.totalRowPosition}
                                agents={this.agentsInfo}
                                showLpu={this.userIsMedicalAgent}
                            />
                        </TableBody>
                    </MuiTable>
                </TableContainer>
            }
            {
                position === USER_ROLE.MEDICAL_AGENT &&
                <AddDocsModal
                    previewBonus={previewBonus}
                    docs={
                        this.agents as IDoctor[]
                        // role === USER_ROLE.MEDICAL_AGENT
                        //     ? (this.agents as IDoctor[])
                        //     : []
                    }
                />
            }
            </>
        );
    }
}

export default withStyles(styles)(Table);
