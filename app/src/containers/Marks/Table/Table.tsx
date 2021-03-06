import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    TableContainer,
    TableBody,
    Table as MuiTable,
    Paper, TableCell, Grid, Typography, TableHead, TableRow
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IAgentInfo, IDrugSale, IBonusInfo, IMark } from '../../../interfaces/IBonusInfo';
import { computed, observable, toJS, when, reaction } from 'mobx';
import Row from '../Row';
import { IUser } from '../../../interfaces';
import { IDoctor } from '../../../interfaces/IDoctor';
import { USER_ROLE } from '../../../constants/Roles';
import TotalRow from '../TotalRow';
import { IUserLikeObject } from '../../../stores/DepartmentsStore';
import AddDocsModal from '../AddDocsModal';
import { ADD_DOC_MODAL } from '../../../constants/Modals';
import TableSubheader from '../TableSubheader';
import { IMarkFraction } from '../../../stores/UserStore';
import { IMedicine } from '../../../interfaces/IMedicine';
import cx from 'classnames';
import DoctorListItem from '../../Doctors/Doctors';
import { ISortBy, SORT_ORDER } from '../../../stores/UIStore';

const styles = (theme: any) => createStyles({
        container: {
            overflow: 'visible'
        },
        fixedTable: {
            position: 'fixed',
            overflow: 'visible',
            padding: '0 20px',
            bottom: 10,
        },
        medItem: {
            transform: 'rotate(-45deg)',
            whiteSpace: 'nowrap',
            transformOrigin: 'left -50%',
            margin: '0 auto -10px 25%',
            fontSize: theme.typography.pxToRem(15),
            color: '#aaa'
        },
        column: {
            width: 70,
            '&:last-of-type': {
                width: 85
            }
        },
        cell: {
            verticalAlign: 'bottom',
            border: 'none',
            paddingBottom: '5px !important',
            '&:first-child': {
                width: 324
            },
            '&:last-of-type':
                {
                    paddingRight: 8
                }
            ,
            '&.invalid':
                {
                    color: '#EE6969'
                }
        },
        table: {
            tableLayout: 'fixed'
        },
        tableRow: {
            height: 100
        },
    })
;

interface IProps extends WithStyles<typeof styles> {
    isLoading: boolean;
    parentUser: IUserInfo & IUserLikeObject;
    isNested: boolean;
    previewBonus: any;

    totalSold?: (position?: number) => { [key: number]: number };
    changedMarks?: Map<number, Map<number, IMark>>;
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
    setPreviewBonusTotal?: (packs: IMarkFraction, marks: IMarkFraction) => void;
    clearPreviewBonusTotal?: () => void;
    meds?: IMedicine[];
    removeBonusAgent?: (id: number, parentId: number) => boolean;
    previewDoctorId?: number;
    setPreviewDoctor?: (id: number) => void;
    sortSettings?: ISortBy;
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
                     currentDepartmentId,
                     currentDepartmentMeds: meds,
                     previewDoctorId,
                     setPreviewDoctor
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
                     bonusUsers,
                     setPreviewBonusTotal,
                     clearPreviewBonusTotal,
                     removeBonusAgent
                 },
                 uiStore: {
                     openModal,
                     sortSettings
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
    openModal,
    setPreviewBonusTotal,
    clearPreviewBonusTotal,
    removeBonusAgent,
    meds,
    previewDoctorId,
    setPreviewDoctor,
    sortSettings
}))
@observer
class Table extends Component<IProps> {
    readonly totalRowHeight: number = 48;
    reactionDisposer: any;
    initializationTimeout: any;
    pageReactionDisposer: any;

    @observable totalRowPosition: 'initial' | 'fixed' = 'fixed';
    @observable tableWidth: number = 0;
    @observable leftOffset: number = 0;
    @observable agents: IUserInfo[] = [];
    @observable agentsLoaded: boolean = false;
    @observable target: number = null;

    @computed
    get agentsInfo(): IAgentInfo[] {
        const { previewBonus } = this.props;
        return previewBonus ? previewBonus.agents : [];
    }

    @computed
    get sales(): Map<number, IDrugSale> {
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
        const { parentUser: { position } } = this.props;
        return position === USER_ROLE.MEDICAL_AGENT;
    }

    @computed
    get expandHandler(): (user: IUserLikeObject, isExpanded: boolean) => void {
        return this.userIsMedicalAgent
            ? null
            : this.expandChangeHandler;
    }

    @computed
    get tooltips(): { [key: number]: number } {
        const { totalSold } = this.props;
        const sold = totalSold();
        return [...this.sales.values()].reduce(
            (total, curr) => {
                total[curr.id] = curr.amount - (sold[curr.id] || 0);
                return total;
            },
            {}
        );
    }

    @computed
    get preparedAgents(): IUserInfo[] {
        const { parentUser: { position }, sortSettings } = this.props;
        if (position === USER_ROLE.MEDICAL_AGENT) {
            const filteredAgents = this.agentsInfo.length
                ? this.agents.filter(x => this.agentsInfo.some(y => y.id === x.id))
                : [];
            if (!filteredAgents) return filteredAgents;

            const order = sortSettings ? sortSettings.order : null;
            const sortPropName = sortSettings ? sortSettings.propName : null;

            const callback = order === SORT_ORDER.ASCENDING
                ? (a: IUserInfo, b: IUserInfo) => a[sortPropName].localeCompare(b[sortPropName])
                : (a: IUserInfo, b: IUserInfo) => b[sortPropName].localeCompare(a[sortPropName]);

            return (sortPropName && order)
                ? filteredAgents.slice().sort(callback)
                : filteredAgents;
        }
        return this.agents.slice(0, 50);
    }

    get isEmpty(): boolean {
        return this.agentsLoaded && !this.preparedAgents.length;
    }

    @computed
    get fixedTableStyles(): any {
        return {
            width: this.tableWidth,
            left: this.leftOffset,
        };
    }

    @computed
    get flattenMedsInfo(): IMark[] {
        const { changedMarks } = this.props;
        return this.agentsInfo.reduce((acc, { marks, id }) => {
            const changedAgentMarks = changedMarks.get(id);

            if (!changedAgentMarks) {
                return [...acc, ...marks.values()];
            }

            const filteredAgentValues = [...marks.values()]
                .filter(x => changedAgentMarks.has(x.drugId) === false);

            return [
                ...acc,
                ...changedAgentMarks.values(),
                ...filteredAgentValues
            ];
        }, []);
    }

    @computed
    get summedTotal(): IMarkFraction {
        return this.flattenMedsInfo.reduce((acc, curr) => {
            const { deposit, payments, mark } = curr;
            acc.payments += payments * mark;
            acc.deposit += deposit * mark;
            return acc;
        }, {
            payments: 0,
            deposit: 0
        });
    }

    @computed
    get summedPacks(): IMarkFraction {
        return this.flattenMedsInfo.reduce((acc, curr) => {
            const { deposit, payments } = curr;
            acc.payments += payments;
            acc.deposit += deposit;
            return acc;
        }, {
            payments: 0,
            deposit: 0
        });
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

    totalReactionDisposer: any;

    async componentDidMount() {
        const {
            loadConfirmedDoctors,
            getLocationsAgents,
            parentUser,
            currentDepartmentId,
            isNested,
            loadBonuses,
            loadBonusesData
        } = this.props;

        this.initializationTimeout = window.setTimeout(async () => {
            if (isNested) {
                await loadBonuses(parentUser);
                await loadBonusesData(parentUser);
            }

            await when(() => this.props.isLoading === false);

            this.pageReactionDisposer = reaction(
                () => this.previewDocInd,
                (docId: number) => {
                    if (docId === -1) return;
                    this.target = this.props.previewDoctorId;
                }
            );

            this.reactionDisposer = reaction(
                () => this.props.role,
                async () => {
                    this.agentsLoaded = false;
                    this.agents = [];
                    const newAgents = parentUser.position === USER_ROLE.MEDICAL_AGENT
                        ? await loadConfirmedDoctors(parentUser)
                        : await getLocationsAgents(currentDepartmentId, parentUser);
                    this.agents = newAgents || [];
                    this.agentsLoaded = true;
                }, {
                    fireImmediately: true
                }
            );
            if (isNested === false) {
                this.totalReactionDisposer = reaction(
                    () => ([this.summedPacks, this.summedTotal]),
                    ([summedPacks, summedTotal]) => this.props.setPreviewBonusTotal(
                        summedPacks,
                        summedTotal
                    ),
                    { fireImmediately: true }
                );
            }
        }, 500);
    }

    async componentWillUnmount() {
        if (this.reactionDisposer) this.reactionDisposer();
        if (this.totalReactionDisposer) this.totalReactionDisposer();

        const {
            removeBonusUser,
            clearChangedMarks,
            parentUser,
            previewBonus,
            updateBonus,
            role,
            changedMarks,
            isNested,
            clearPreviewBonusTotal
        } = this.props;

        if (isNested === false) {
            clearPreviewBonusTotal();
        }

        const condition = role === USER_ROLE.MEDICAL_AGENT
            && (parentUser ? parentUser.position : null) === USER_ROLE.MEDICAL_AGENT
            && !this.isEmpty && changedMarks.size;

        if (condition) {
            console.log('good saving...');
            console.log(toJS(previewBonus));
            await updateBonus(previewBonus, false);
        }
        clearChangedMarks();
        removeBonusUser(parentUser);
        window.clearTimeout(this.initializationTimeout);
    }

    removeBonusAgent = async (agentId: number) => {
        const {
            removeBonusAgent, parentUser, loadBonuses, loadBonusesData
        } = this.props;
        const removed = await removeBonusAgent(agentId, parentUser.id);
        if (removed) {
            await loadBonuses(parentUser);
            await loadBonusesData(parentUser);
        }
    }

    clearTarget = () => {
        this.target = null;
    }

    removeHighlight = () => {
        this.props.setPreviewDoctor(null);
    }

    @computed
    get previewDocInd(): number {
        const { previewDoctorId } = this.props;
        if (previewDoctorId === null) return -1;
        return this.preparedAgents
            ? this.preparedAgents.findIndex(({ id }) => id === previewDoctorId)
            : -1;
    }

    @computed
    get getMedsNames() {
        const { meds, classes } = this.props;

        return meds.length
            ? meds.map(x => {
                    return <TableCell padding='none' key={x.id} className={classes.cell}>
                        <Grid direction='column' container>
                            <Typography className={classes.medItem}>
                                {x.name}
                            </Typography>
                        </Grid>
                    </TableCell>;
                }
            )
            : <TableCell/>;
    }

    render() {
        const {
            classes,
            isNested,
            role,
            previewBonus,
            bonusUsers,
            parentUser,
            previewDoctorId,
        } = this.props;
        const { position } = parentUser;
        const lastIndex = this.agentsInfo.length - 1;

        return (
            <>
                <TableSubheader
                    summedTotal={this.summedTotal}
                    isNested={isNested}
                    agents={this.preparedAgents}
                    parentUser={parentUser}
                    agentsLoaded={this.agentsLoaded}
                    previewBonus={previewBonus}
                />
                <TableContainer>
                    <MuiTable padding='none'>
                        <TableBody>
                            {
                                this.preparedAgents && this.preparedAgents.map((x, i) => {
                                    const allowEdit = role === USER_ROLE.MEDICAL_AGENT
                                        ? previewBonus
                                            ? !previewBonus.status
                                            : false
                                        : true;
                                    return (
                                        <Row
                                            key={x.id}
                                            previewBonus={previewBonus}
                                            agentInfo={(this.agentsInfo || []).find(({ id }) => id === x.id)}
                                            isNested={isNested}
                                            agent={(x as IUserInfo & IUserLikeObject)}
                                            isMedicalAgent={this.userIsMedicalAgent}
                                            tooltips={this.tooltips}
                                            expanded={bonusUsers.some(({ id }) => id === x.id)}
                                            expandHandler={this.expandHandler}
                                            allowEdit={allowEdit}
                                            highlight={x.id === previewDoctorId}
                                            removeHighlighting={this.removeHighlight}
                                            rootRef={i === lastIndex
                                                ? this.refHandler
                                                : position === USER_ROLE.MEDICAL_AGENT ? (el: any) => {
                                                    try {
                                                        if (el && x.id === this.target) {
                                                            window.setTimeout(() => {
                                                                    el.scrollIntoView({
                                                                        block: 'center',
                                                                        behavior: 'smooth'
                                                                    });
                                                                    this.clearTarget();
                                                                },
                                                                100);
                                                        }
                                                    } catch (e) {
                                                        console.error(e);
                                                    }
                                                } : null}
                                            removeBonusAgent={this.removeBonusAgent}
                                        />
                                    );
                                })
                            }
                        </TableBody>
                    </MuiTable>
                </TableContainer>
                {
                    (this.showTotalRow && this.totalRowPosition === 'fixed') &&
                    <TableContainer component={Paper} className={classes.fixedTable}
                                    style={this.fixedTableStyles}>
                        <MuiTable className={classes.table} padding='none'>
                            <TableHead>
                                <TableRow className={classes.tableRow}>
                                    <TableCell padding='none' className={classes.cell}/>
                                    {
                                        this.getMedsNames
                                    }
                                    <TableCell
                                        padding='none'
                                        align='center'
                                        className={cx(classes.cell, classes.column)}>
                                        ????
                                    </TableCell>
                                    <TableCell
                                        align='center'
                                        padding='none'
                                        className={cx(classes.cell, classes.column)}>
                                        ????????????
                                    </TableCell>
                                    <TableCell
                                        align='right'
                                        padding='none'
                                        className={cx(classes.cell, classes.column)}>
                                        ????????????
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                        </MuiTable>
                        <MuiTable className={classes.table} padding='none'>
                            <TableBody>
                                <TotalRow
                                    position={this.totalRowPosition}
                                    agents={this.agentsInfo}
                                    showLpu={this.userIsMedicalAgent}
                                    flattenMedsInfo={this.flattenMedsInfo}
                                    summedTotal={this.summedTotal}
                                    summedPacks={this.summedPacks}
                                />
                            </TableBody>
                        </MuiTable>
                    </TableContainer>
                }
                {
                    position === USER_ROLE.MEDICAL_AGENT &&
                    <AddDocsModal
                        previewBonus={previewBonus}
                        docs={this.agents as IDoctor[]}
                    />
                }
            </>
        )
            ;
    }
}

export default withStyles(styles)(Table);
