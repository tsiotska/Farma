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
}

@observer
class TableRow extends Component<IProps> {
    readonly defaultValue: string = '-';

    get statIds(): number[] {
        return this.props.medStat.map(x => x.medId);
    }

    render() {
        const {
            medsIds,
            classes,
            medStat,
            targetProperty
        } = this.props;

        let i: number = 0;
        return (
            <MuiTableRow className={classes.row}>
                {
                    medsIds.map(x => {
                        const value = this.statIds.includes(x , i)
                        ? medStat[i][targetProperty]
                        : this.defaultValue;

                        if (value !== this.defaultValue) ++i;

                        return  <TableCell key={x} className={classes.cell}>
                            { value }
                        </TableCell>;
                    })
                }
            </MuiTableRow>
        );
    }
}

export default withStyles(styles)(TableRow);
