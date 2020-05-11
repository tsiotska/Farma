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
import { IAgentInfo, IDrugSale } from '../../../interfaces/IBonusInfo';
import { computed, observable, toJS, when } from 'mobx';
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
    agentsInfo: IAgentInfo[];
    sales: Map<number, IDrugSale>;
    totalSold: { [key: number]: number };
    isLoading: boolean;

    parentUser: IUserInfo & IUserLikeObject;
    loadConfirmedDoctors?: (targetUser: IUserLikeObject) => IDoctor[];
    getLocationsAgents?: (depId: number, role: USER_ROLE) => IUser[];
    currentDepartmentId?: number;
    role?: USER_ROLE;
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
            role
        }
    }
}) => ({
    loadConfirmedDoctors,
    getLocationsAgents,
    currentDepartmentId,
    role
}))
@observer
class Table extends Component<IProps> {
    readonly totalRowHeight: number = 48;
    @observable totalRowPosition: 'initial' | 'fixed' = 'fixed';
    @observable tableWidth: number = 0;
    @observable leftOffset: number = 0;
    @observable expandedAgent: number = null;
    @observable agents: IUserInfo[] = [];

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
        const { sales, totalSold } = this.props;

        return [...sales.values()].reduce(
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
        if (position === USER_ROLE.MEDICAL_AGENT) {
            this.agents = await loadConfirmedDoctors(parentUser) || [];
        } else {
            this.agents = await getLocationsAgents(currentDepartmentId, position) || [];
        }
    }

    render() {
        const { agentsInfo, classes, role } = this.props;

        const lastIndex = agentsInfo.length - 1;
        // console.log(toJS(this.agents));
        // console.log(toJS(agentsInfo));
        // console.log('total row: ', this.showTotalRow, this.totalRowPosition);
        return (
            <>
            <TableContainer>
                <MuiTable padding='none'>
                    <TableBody>
                        {
                            Array.isArray(this.agents) &&
                            this.agents.map((x, i) => (
                                <TableRow
                                    key={x.id}
                                    agentInfo={(agentsInfo || []).find(({ id }) => id === x.id)}
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
                                agents={agentsInfo}
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
                                agents={agentsInfo}
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
