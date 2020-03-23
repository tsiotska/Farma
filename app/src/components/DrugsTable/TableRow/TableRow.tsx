import React, { Component } from 'react';
import { createStyles, WithStyles, TableRow as MuiTableRow, TableCell } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IMedSalesStat } from '../../../interfaces/ILocaleSalesStat';

const styles = (theme: any) => createStyles({
    row: {},
    cell: {}
});

interface IProps extends WithStyles<typeof styles> {
    medsIds: number[];
    medStat: IMedSalesStat[];
    targetProperty: 'amount' | 'money';
    rowEndAddornment?: (data: number[]) => number | string;
}

@observer
class TableRow extends Component<IProps> {
    get data(): number[] {
        const { medsIds, medStat, targetProperty } = this.props;
        const ids = medStat.map(x => x.medId);

        let i: number = 0;
        return medsIds.map(x => {
            const ind = ids.indexOf(x, i);

            if (ind !== -1) i = ind;

            const value = ind === -1
                ? null
                : medStat[ind][targetProperty];

            return value;
        });
    }

    render() {
        const { classes, rowEndAddornment, medStat, medsIds } = this.props;

        if (!this.data.length) return null;

        return (
            <MuiTableRow className={classes.row}>
                {
                    this.data.map((x, i) => (
                        <TableCell key={i} className={classes.cell}>
                            {
                                x === null
                                    ? '-'
                                    : x.toFixed(2)
                            }
                        </TableCell>
                    ))
                }
                {
                    rowEndAddornment &&
                    <TableCell className={classes.cell}>
                        { rowEndAddornment(this.data) }
                    </TableCell>
                }
            </MuiTableRow>
        );
    }
}

export default withStyles(styles)(TableRow);
