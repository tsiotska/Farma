import React, { Component } from 'react';
import { createStyles, WithStyles, TableRow as MuiTableRow, TableCell } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { computed } from 'mobx';
import cx from 'classnames';
import { IMedicine } from '../../../interfaces/IMedicine';

const styles = (theme: any) => createStyles({
    row: {
        '&.ignored': {
            opacity: 0.5
        }
    },
    cell: {
        paddingRight: 5,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        height: 48,
        '&:first-of-type': {
            paddingLeft: 5,
            [theme.breakpoints.up('md')]: {
                width: 220,
            },
            '& img': {
                width: 32,
                height: 32,
                marginRight: 5,
                marginLeft: 5
            }
        },
        '&:last-of-type': {
            width: ({ scrollBarWidth = 0}: any) => 100 - scrollBarWidth
        },
        '&.displayNone': {
            display: 'none'
        }
    }
});

interface IProps extends WithStyles<typeof styles> {
    meds: IMedicine[];
    mantisLength: number;
    rowEndAddornment?: (data: number[]) => number | string;
    rowStartAddornment?: JSX.Element;
    data: { [key: number]: number };
    scrollBarWidth?: number;
    ignoredMeds: number[];
    isIgnored?: boolean;
}

@observer
class TableRow extends Component<IProps> {
    @computed
    get data(): number[] {
        const { meds, data } = this.props;

        return meds.filter(({ deleted }) => deleted !== true).map(({ id }) => (
            id in data
                ? data[id]
                : null
        ));

        // return meds.map(({ id }) => (
            // id in data
            //     ? data[id]
            //     : null
        // ));
    }

    render() {
        const {
            classes,
            rowEndAddornment,
            rowStartAddornment,
            mantisLength,
            ignoredMeds,
            isIgnored
        } = this.props;

        return (
            <MuiTableRow className={cx(classes.row, { ignored: isIgnored })}>
                <TableCell colSpan={2} className={classes.cell}>
                    { rowStartAddornment }
                </TableCell>
                {
                    this.data.map((x, i) => (
                        <TableCell key={i} className={cx(classes.cell, { displayNone: ignoredMeds.includes(i) })}>
                            {
                                x
                                ? x.toFixed(mantisLength)
                                : '-'
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
