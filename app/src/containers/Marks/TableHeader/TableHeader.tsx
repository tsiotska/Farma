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
import { IDrugSale, IBonusInfo } from '../../../interfaces/IBonusInfo';

const styles = (theme: any) => createStyles({
    doubleWidthColumn: {
        width: 284
    },
    wideColumn: {
        width: 284 / 2
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
        margin: '0 auto -10px 25%',
        fontSize: theme.typography.pxToRem(15),
        color: '#aaa'
    },
    cell: {
        verticalAlign: 'bottom',
        border: 'none',
        paddingBottom: '5px !important',
    },
    span: {
        width: '100%',
        '&:first-of-type': {
            textAlign: 'right',
            fontFamily: 'Source Sans Pro SemiBold',
        }
    },
    salesStat: {
        width: '100%', display: 'flex'
    }
});

interface IProps extends WithStyles<typeof styles> {
    showLpu: boolean;
    previewBonus: IBonusInfo;

    totalSold?: { [key: number]: number };
    meds?: IMedicine[];
}

@inject(({
    appState: {
        departmentsStore: {
            currentDepartmentMeds: meds
        },
        userStore: {
            totalSold
        }
    }
}) => ({
    meds,
    totalSold
}))
@observer
class TableHeader extends Component<IProps> {
    get sales(): Map<number, IDrugSale> {
        const { previewBonus } = this.props;
        return previewBonus
            ? previewBonus.sales
            : new Map();
    }

    render() {
        const {
            classes,
            meds,
            showLpu,
            totalSold,
            previewBonus
        } = this.props;

        return (
            <TableContainer className={classes.container}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            {
                                showLpu &&
                                <TableCell
                                    padding='none'
                                    className={cx(classes.cell, classes.wideColumn)}>
                                    ЛПУ
                                </TableCell>
                            }
                            <TableCell
                                padding='none'
                                className={cx(classes.cell, {
                                    [classes.doubleWidthColumn]: !showLpu,
                                    [classes.wideColumn]: showLpu,
                                })}>
                                ПІБ
                            </TableCell>
                            {
                                meds.length
                                ? meds.map(x => {
                                    const saleInfo = this.sales.get(x.id);

                                    return (
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
                                                {
                                                    !!previewBonus &&
                                                    <Typography variant='subtitle1' className={classes.salesStat}>
                                                        <span className={classes.span}>
                                                            { totalSold[x.id] || 0 }
                                                        </span>
                                                        <span>/</span>
                                                        <span className={classes.span}>
                                                            { saleInfo ? saleInfo.amount : 0 }
                                                        </span>
                                                    </Typography>
                                                }
                                            </Grid>
                                        </TableCell>
                                    );
                                })
                                : <TableCell />
                            }
                            <TableCell
                                padding='none'
                                align='center'
                                className={cx(classes.cell, classes.column)}>
                                    уп
                            </TableCell>
                            <TableCell
                                align='center'
                                padding='none'
                                className={cx(classes.cell, classes.column)}>
                                    бонуси
                            </TableCell>
                            <TableCell
                                align='center'
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
