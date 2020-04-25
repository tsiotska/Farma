import React, { Component } from 'react';
import { createStyles, WithStyles, TableRow, TableCell } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IMedicine } from '../../../interfaces/IMedicine';
import cx from 'classnames';

const styles = (theme: any) => createStyles({
    root: {
        position: ({ position }: any) => position || 'initial',
        bottom: 0
    },
    firstColumn: {
    },
    column: {
        width: 70
    },
    cell: {
        verticalAlign: 'center',
        border: 'none',
        textAlign: 'center'
    }
});

interface IProps extends WithStyles<typeof styles> {
    meds?: IMedicine[];
    position: 'initial' | 'fixed';
    showLpu: boolean;
}

@inject(({
    appState: {
        departmentsStore: {
            currentDepartmentMeds: meds
        },
    }
}) => ({
    meds,
}))
@observer
class TotalRow extends Component<IProps> {
    render() {
        const {classes, meds, showLpu} = this.props;

        return (
            <TableRow className={classes.root}>
                <TableCell
                    colSpan={showLpu ? 2 : 1}
                    className={cx(classes.cell, classes.firstColumn)}>
                    hello
                </TableCell>
                {
                    meds.map(x => (
                        <TableCell key={x.id} className={classes.cell}>
                            { x.id }
                        </TableCell>
                    ))
                }
                <TableCell className={cx(classes.cell, classes.column)}>1</TableCell>
                <TableCell className={cx(classes.cell, classes.column)}>1</TableCell>
                <TableCell className={cx(classes.cell, classes.column)}>1</TableCell>
            </TableRow>
        );
    }
}

export default withStyles(styles)(TotalRow);
