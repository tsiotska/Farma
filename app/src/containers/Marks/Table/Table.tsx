import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    TableContainer,
    TableBody,
    Table as MuiTable,
    Paper,
    Collapse
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IAgentInfo, IDrugSale, IBonusInfo } from '../../../interfaces/IBonusInfo';
import { computed, observable, toJS, when, reaction } from 'mobx';
import TableRow from '../TableRow';
import { IUser } from '../../../interfaces';
import { IDoctor } from '../../../interfaces/IDoctor';
import { USER_ROLE } from '../../../constants/Roles';
import TotalRow from '../TotalRow';
import { IUserLikeObject } from '../../../stores/DepartmentsStore';
import AddDocsModal from '../AddDocsModal';

const styles = (theme: any) => createStyles({
    fixedTable: {
        position: 'fixed',
        tableLayout: 'fixed',
        padding: '0 20px',
        bottom: 0,
    }
});

interface IProps extends WithStyles<typeof styles> {
    isLoading: boolean;
    parentUser: IUserInfo & IUserLikeObject;

    totalSold?: { [key: number]: number };
    loadConfirmedDoctors?: (targetUser: IUserLikeObject) => IDoctor[];
    getLocationsAgents?: (depId: number, role: USER_ROLE) => IUser[];
    currentDepartmentId?: number;
    role?: USER_ROLE;
    previewBonus?: IBonusInfo;
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
            previewBonus
        }
    }
}) => ({
    loadConfirmedDoctors,
    getLocationsAgents,
    currentDepartmentId,
    role,
    totalSold,
    previewBonus
}))
@observer
class Table extends Component<IProps> {
    readonly totalRowHeight: number = 48;
    reactionDisposer: any;

    @observable totalRowPosition: 'initial' | 'fixed' = 'fixed';
    @observable tableWidth: number = 0;
    @observable leftOffset: number = 0;
    @observable expandedAgent: number = null;
    @observable agents: IUserInfo[] = [];

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
        return !!this.agents.length;
    }

    @computed
    get userIsMedicalAgent(): boolean {
        const { parentUser: { position }} = this.props;
        return position === USER_ROLE.MEDICAL_AGENT;
    }

    @computed
    get expandHandler(): (id: number, isExpanded: boolean) => void {
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

    @computed
    get fixedTableStyles(): any {
        return {
            width: this.tableWidth,
            left: this.leftOffset,
        };
    }

    get preparedAgents(): IUserInfo[] {
        const { role } = this.props;
        if (role === USER_ROLE.MEDICAL_AGENT) {
            return this.agentsInfo.length
                ? this.agents.filter(x => this.agentsInfo.some(y => y.id === x.id))
                : [];
        }
        return this.agents.slice(0, 50);
    }

    expandChangeHandler = (id: number, isExpanded: boolean) => {
        this.expandedAgent = isExpanded ? id : null;
    }

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
        } = this.props;
        const { position } = parentUser;

        await when(() => this.props.isLoading === false);
        const newAgents = position === USER_ROLE.MEDICAL_AGENT
            ? await loadConfirmedDoctors(parentUser)
            : await getLocationsAgents(currentDepartmentId, position);
        this.agents = newAgents || [];
        this.reactionDisposer = reaction(
            () => this.props.role,
            () => { this.agents = []; }
        );
    }

    componentWillUnmount() {
        this.reactionDisposer();
    }

    render() {
        const { classes, role } = this.props;

        const lastIndex = this.agentsInfo.length - 1;

        return (
            <>
            <TableContainer>
                <MuiTable padding='none'>
                    <TableBody>
                        {
                            this.preparedAgents.map((x, i) => (
                                <TableRow
                                    key={x.id}
                                    agentInfo={(this.agentsInfo || []).find(({ id }) => id === x.id)}
                                    agent={x}
                                    showLpu={this.userIsMedicalAgent}
                                    tooltips={this.tooltips}
                                    expanded={this.expandedAgent === x.id}
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
            <AddDocsModal
                docs={
                    role === USER_ROLE.MEDICAL_AGENT
                        ? (this.agents as IDoctor[])
                        : []
                }
            />
            </>
        );
    }
}

export default withStyles(styles)(Table);
