import React, { Component } from 'react';
import { createStyles, WithStyles, TableContainer, TableBody, Table as MuiTable } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IAgentInfo } from '../../../interfaces/IBonusInfo';
import { toJS } from 'mobx';
import TableRow from '../TableRow';

const styles = (theme: any) => createStyles({});

interface IProps extends WithStyles<typeof styles> {
    agents: IAgentInfo[];
    showLpu: boolean;
}

@observer
class Table extends Component<IProps> {
    render() {
        const { agents, classes, showLpu } = this.props;
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
