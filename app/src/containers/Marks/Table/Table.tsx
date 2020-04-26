import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    TableContainer,
    TableBody,
    Table as MuiTable,
    TableCell,
    TableRow as MuiTableRow,
    Paper} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IAgentInfo, IDrugSale } from '../../../interfaces/IBonusInfo';
import { toJS, computed, observable } from 'mobx';
import TableRow from '../TableRow';
import { IUser } from '../../../interfaces';
import { IDoctor } from '../../../interfaces/IDoctor';
import { USER_ROLE } from '../../../constants/Roles';
import TotalRow from '../TotalRow';

const styles = (theme: any) => createStyles({});

interface IProps extends WithStyles<typeof styles> {
    agents: IAgentInfo[];
    showLpu: boolean;
    sales: Map<number, IDrugSale>;
    locationsAgents?: Map<number, IUser>;
    doctors?: IDoctor[];
    role?: USER_ROLE;
    totalSold: { [key: number]: number };
}

@inject(({
    appState: {
        departmentsStore: {
            locationsAgents,
            doctors
        },
        userStore: {
            role
        }
    }
}) => ({
    locationsAgents,
    doctors,
    role
}))
@observer
class Table extends Component<IProps> {
    readonly totalRowHeight: number = 48;
    @observable totalRowPosition: 'initial' | 'fixed' = 'fixed';
    @observable tableWidth: number = 0;
    @observable leftOffset: number = 0;

    @computed
    get showTotalRow(): boolean {
        const { agents } = this.props;
        return !!agents.length;
    }

    @computed
    get docsMap(): Map<number, IDoctor> {
        const { doctors } = this.props;

        const mappedDocs: Array<[number, IDoctor]> = doctors.map(x => ([ x.id, x ]));

        return new Map(mappedDocs);
    }

    @computed
    get targetAgents(): Map<number, IDoctor | IUser> {
        const { role, locationsAgents } = this.props;
        return role === USER_ROLE.MEDICAL_AGENT
            ? this.docsMap
            : locationsAgents;
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

    render() {
        const { agents, showLpu } = this.props;

        const lastIndex = agents.length - 1;

        return (
            <>
            <TableContainer>
                <MuiTable padding='none'>
                    <TableBody>
                        {
                            agents.map((x, i) => {
                                const agent = this.targetAgents.get(x.id);

                                return (
                                    <TableRow
                                        key={x.id}
                                        agent={x}
                                        itemRef={
                                            (el: any) => {
                                                if (!el || i !== lastIndex) return;
                                                const lastItemRect = el.getBoundingClientRect();
                                                this.tableWidth = lastItemRect.width + 40;
                                                this.leftOffset = lastItemRect.left - 20;

                                                const lastItemBottom = lastItemRect.bottom;
                                                const availableHeight = window.innerHeight - lastItemBottom;
                                                this.totalRowPosition = availableHeight > this.totalRowHeight
                                                    ? 'initial'
                                                    : 'fixed';
                                            }
                                        }
                                        showLpu={showLpu}
                                        tooltips={this.tooltips}
                                        lpuName={
                                            (agent && 'LPUName' in agent)
                                            ? agent.LPUName
                                            : null
                                        }
                                        agentName={
                                            agent
                                            ? agent.name
                                            : null
                                        }
                                    />
                                );
                            })
                        }
                        {
                            (this.showTotalRow && this.totalRowPosition === 'initial') &&
                            <TotalRow
                                agents={agents}
                                position={this.totalRowPosition}
                                showLpu={showLpu}
                            />
                        }
                    </TableBody>
                </MuiTable>
            </TableContainer>
            {
                (this.showTotalRow && this.totalRowPosition === 'fixed') &&
                <TableContainer
                    component={Paper}
                    style={{
                        width: this.tableWidth,
                        left: this.leftOffset,
                        position: 'fixed',
                        tableLayout: 'fixed',
                        padding: '0 20px',
                        bottom: 0,
                    }}>
                    <MuiTable padding='none'>
                        <TableBody>
                            <TotalRow
                                position={this.totalRowPosition}
                                agents={agents}
                                showLpu={showLpu}
                            />
                        </TableBody>
                    </MuiTable>
                </TableContainer>
            }
            </>
        );
    }
}

export default withStyles(styles)(Table);
