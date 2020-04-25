import React, { Component } from 'react';
import { createStyles, WithStyles, TableContainer, TableBody, Table as MuiTable } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IAgentInfo, IDrugSale } from '../../../interfaces/IBonusInfo';
import { toJS, computed } from 'mobx';
import TableRow from '../TableRow';
import { IUser } from '../../../interfaces';
import { IDoctor } from '../../../interfaces/IDoctor';
import { USER_ROLE } from '../../../constants/Roles';

const styles = (theme: any) => createStyles({});

interface IProps extends WithStyles<typeof styles> {
    agents: IAgentInfo[];
    showLpu: boolean;
    locationsAgents?: Map<number, IUser>;
    doctors?: IDoctor[];
    role?: USER_ROLE;
    sales: Map<number, IDrugSale>;
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

        return (
            <TableContainer>
                <MuiTable padding='none'>
                    <TableBody>
                        {
                            agents.map(x => {
                                const agent = this.targetAgents.get(x.id);

                                return (
                                    <TableRow
                                        key={x.id}
                                        agent={x}
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
                        {/* <TotalRow /> */}
                    </TableBody>
                </MuiTable>
            </TableContainer>
        );
    }
}

export default withStyles(styles)(Table);
