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
            paddingLeft: 5,
            '& img': {
                width: 32,
                height: 32,
                marginRight: 5
            }
        }
    }
});

interface IProps extends WithStyles<typeof styles> {
    medsIds: number[];
    mantisLength: number;
    rowEndAddornment?: (data: number[]) => number | string;
    rowStartAddornment?: JSX.Element;
    data: any;
}

@observer
class TableRow extends Component<IProps> {
    get data(): number[] {
        const { medsIds, data } = this.props;

        return medsIds.map(x => (
            x in data
            ? data[x]
            : null
        ));
    }

    render() {
        const {
            classes,
            rowEndAddornment,
            rowStartAddornment,
            mantisLength
        } = this.props;

        return (
            <MuiTableRow className={classes.row}>
                <TableCell colSpan={2} className={classes.cell}>
                    { rowStartAddornment }
                </TableCell>

                {
                    this.data.map((x, i) => (
                        <TableCell key={i} className={classes.cell}>
                            {
                                x
                                ? '-'
                                : x.toFixed(mantisLength)
                            }
                        </TableCell>
                    ))
                }
                <TableCell className={classes.cell}>
                    { rowEndAddornment && rowEndAddornment(this.data) }
                </TableCell>
            </MuiTableRow>
        );
    }
}

export default withStyles(styles)(TableRow);
