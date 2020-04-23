import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    Typography,
    Grid
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { computed } from 'mobx';
import { IMedicine } from '../../../interfaces/IMedicine';
import cx from 'classnames';

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
    table: {
        tableLayout: 'fixed'
    },
    container: {
        overflow: 'visible'
    },
    medItem: {
        transform: 'rotate(-45deg)',
        whiteSpace: 'nowrap',
        transformOrigin: 'left -50%',
        marginBottom: -10
    },
    cell: {
        verticalAlign: 'bottom'
    }
});

interface IProps extends WithStyles<typeof styles> {
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
class TableHeader extends Component<IProps> {
    @computed
    get showLPUColumn(): boolean {
        return true;
    }

    render() {
        const { classes, meds } = this.props;

        return (
            <TableContainer className={classes.container}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            {
                                this.showLPUColumn &&
                                <TableCell
                                    padding='none'
                                    className={cx(classes.cell, classes.wideColumn)}>
                                    ЛПУ/Аптека
                                </TableCell>
                            }
                            <TableCell
                                padding='none'
                                className={cx(classes.cell, {
                                    [classes.doubleWidthColumn]: !this.showLPUColumn,
                                    [classes.wideColumn]: this.showLPUColumn,
                                })}>
                                ПІБ
                            </TableCell>
                            {
                                meds.length
                                ? meds.map(x => (
                                    <TableCell
                                        key={x.id}
                                        padding='none'
                                        className={classes.cell}>
                                        <Grid
                                            direction='column'
                                            container>
                                            <Typography className={classes.medItem}>
                                                { x.name }
                                            </Typography>
                                            <Typography>
                                                10/20
                                            </Typography>
                                        </Grid>
                                    </TableCell>
                                ))
                                : <TableCell />
                            }
                            <TableCell
                                padding='none'
                                className={cx(classes.cell, classes.column)}>
                                    уп
                            </TableCell>
                            <TableCell
                                padding='none'
                                className={cx(classes.cell, classes.column)}>
                                    бонуси
                            </TableCell>
                            <TableCell
                                padding='none'
                                className={cx(classes.cell, classes.column)}>
                                    всього
                            </TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
            </TableContainer>
        );
    }
}

export default withStyles(styles)(TableHeader);
