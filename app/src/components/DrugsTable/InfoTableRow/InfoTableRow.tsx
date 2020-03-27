import React, { Component } from 'react';
import { TableRow, TableCell, Typography } from '@material-ui/core';
import { observer } from 'mobx-react';

interface IProps {
    colSpan: number;
    children?: any;
}

@observer
class InfoTableRow extends Component<IProps> {
    render() {
        const { colSpan, children } = this.props;

        if (!children) return null;

        return (
            <TableRow>
                <TableCell align='center' colSpan={colSpan}>
                    { children }
                </TableCell>
            </TableRow>
        );
    }
}

export default InfoTableRow;
