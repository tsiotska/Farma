import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    TableRow as MuiTableRow,
    TableCell
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IAgentInfo } from '../../../interfaces/IBonusInfo';
import cx from 'classnames';
import { IMedicine } from '../../../interfaces/IMedicine';
import { computed } from 'mobx';

const styles = (theme: any) => createStyles({
    doubleWidthColumn: {
        width: 290
    },
    wideColumn: {
        width: 170
    },
    column: {
        width: 70
    },
    cell: {
        verticalAlign: 'bottom'
    }
});

interface IProps extends WithStyles<typeof styles> {
    agent: IAgentInfo;
    showLpu: boolean;
    meds?: IMedicine[];
}

@inject(({
    appState: {
        departmentsStore: {
            currentDepartmentMeds: meds
        }
    }
}) => ({
    meds
}))
@observer
class TableRow extends Component<IProps> {
    @computed
    get medsContent(): JSX.Element[] | JSX.Element {
        const { classes, meds, agent: { marks }} = this.props;

        return meds.length
        ? meds.map(({ id }) => {
            const mark = marks.get(id);
            return <TableCell key={id} className={classes.cell}>
                {
                    mark
                    ? `${mark.payments} / ${mark.deposit}`
                    : `0 / 0`
                }
            </TableCell>;
          })
        : <TableCell />;
    }

    render() {
        const {
            classes,
            showLpu,
            agent: {
                id,
                lastDeposit,
                lastPayment,
                marks
            }
        } = this.props;

        return (
            <MuiTableRow>
                {
                    showLpu &&
                    <TableCell
                        padding='none'
                        className={cx(classes.cell, classes.wideColumn)}>
                        -
                    </TableCell>
                }
                <TableCell
                    padding='none'
                    className={cx(
                        classes.cell, {
                        [classes.doubleWidthColumn]: !showLpu,
                        [classes.wideColumn]: showLpu,
                    })}>
                    { id }
                </TableCell>
                { this.medsContent }
                <TableCell
                    padding='none'
                    className={cx(classes.cell, classes.column)}>
                    0
                </TableCell>
                <TableCell
                    padding='none'
                    className={cx(classes.cell, classes.column)}>
                    0
                </TableCell>
                <TableCell
                    padding='none'
                    className={cx(classes.cell, classes.column)}>
                    0
                </TableCell>
            </MuiTableRow>
        );
    }
}

export default withStyles(styles)(TableRow);
