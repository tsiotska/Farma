import React, { Component } from 'react';
import { createStyles, WithStyles, TableContainer, TableBody, Table as MuiTable } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IAgentInfo } from '../../../interfaces/IBonusInfo';
import { toJS } from 'mobx';
import TableRow from '../TableRow';
import { IUser } from '../../../interfaces';

const styles = (theme: any) => createStyles({});

interface IProps extends WithStyles<typeof styles> {
    agents: IAgentInfo[];
    showLpu: boolean;
    locationsAgents?: Map<number, IUser>;
}

@inject(({
    appState: {
        departmentsStore: {
            locationsAgents
        }
    }
}) => ({
    locationsAgents
}))
@observer
class Table extends Component<IProps> {
    render() {
        const { agents, classes, showLpu, locationsAgents } = this.props;
        console.log('agents: ', toJS(agents));
        return (
            <TableContainer>
                <MuiTable padding='none'>
                    <TableBody>
                        {
                            agents.map(x => (
                                <TableRow
                                    key={x.id}
                                    showLpu={showLpu}
                                    agent={x}
                                    agentName={
                                        locationsAgents.has(x.id)
                                        ? locationsAgents.get(x.id).name
                                        : null
                                    }
                                />
                            ))
                        }
                    </TableBody>
                </MuiTable>
            </TableContainer>
        );
    }
}

export default withStyles(styles)(Table);
