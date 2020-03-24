import React, { Component } from 'react';
import { createStyles, WithStyles, TableRow as MuiTableRow, TableCell } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IMedSalesInfo } from '../../../interfaces/ISalesStat';

const styles = (theme: any) => createStyles({
    row: {},
    cell: {
        paddingRight: 5,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        height: 48,
        '&:first-of-type': {
            paddingLeft: 5
        }
    }
});

interface IProps extends WithStyles<typeof styles> {
    medsIds: number[];
    medStat: IMedSalesInfo[];
    targetProperty: 'amount' | 'money';
    rowEndAddornment?: (data: number[]) => number | string;
    rowStartAddornment?: JSX.Element;
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
        const { classes, rowEndAddornment, rowStartAddornment, targetProperty } = this.props;
        const mantisLength = targetProperty === 'money'
        ? 2
        : 0;

        if (!this.data.length) return null;

        return (
            <MuiTableRow className={classes.row}>
                {
                    rowStartAddornment &&
                    <TableCell colSpan={2} className={classes.cell}>
                        { rowStartAddornment }
                    </TableCell>
                }
                {
                    this.data.map((x, i) => (
                        <TableCell key={i} className={classes.cell}>
                            {
                                x === null
                                    ? '-'
                                    : x.toFixed(mantisLength)
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
