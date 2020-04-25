import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    TableRow as MuiTableRow,
    TableCell,
    Grid,
    Divider
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { computed } from 'mobx';
import cx from 'classnames';
import { IAgentInfo } from '../../../interfaces/IBonusInfo';
import { IMedicine } from '../../../interfaces/IMedicine';

const styles = (theme: any) => createStyles({
    root: {
    },
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
        verticalAlign: 'center',
        border: 'none',
        borderBottom: '10px solid white',
        backgroundColor: '#F7F7F9'
    },
    divider: {
        minWidth: 30,
        width: '50%'
    },
    divider2: {
        backgroundColor: '#797979'
    },
    span: {

    },
    lastPayment: {
        // width: '100%',
        // borderStyle: 'solid',
        // borderColor: 'black',
        // borderWidth: '1px 1px 0',
        textAlign: 'center'
    },
    lastDeposit: {
        // width: '100%',
        // border: '1px solid black',
        textAlign: 'center'
    },
    paymentsContainer: {
        border: '1px  solid black',
        width: 'auto',
        minWidth: 30
    }
});

interface IProps extends WithStyles<typeof styles> {
    agent: IAgentInfo;
    showLpu: boolean;
    meds?: IMedicine[];
    agentName: string;
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
                <Grid direction='column' alignItems='center' container>
                    <span className={classes.span}>{mark ? mark.payments : 0}</span>
                    <Divider className={classes.divider} />
                    <span className={classes.span}>{mark ? mark.deposit : 0}</span>
                </Grid>
            </TableCell>;
          })
        : <TableCell />;
    }

    render() {
        const {
            classes,
            showLpu,
            agentName,
            agent: {
                id,
                lastDeposit,
                lastPayment,
                marks
            }
        } = this.props;

        return (
            <MuiTableRow className={classes.root}>
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
                    { agentName }
                </TableCell>
                { this.medsContent }
                <TableCell
                    align='center'
                    padding='none'
                    className={cx(classes.cell, classes.column)}>
                    <Grid direction='column' alignItems='center' container>
                        <span className={classes.span}>0</span>
                        <Divider className={classes.divider} />
                        <span className={classes.span}>0</span>
                    </Grid>
                </TableCell>
                <TableCell
                    align='center'
                    padding='none'
                    className={cx(classes.cell, classes.column)}>
                    <Grid direction='column' alignItems='center' container>
                        <span className={classes.span}>0</span>
                        <Divider className={classes.divider} />
                        <span className={classes.span}>0</span>
                    </Grid>
                </TableCell>
                <TableCell
                    padding='none'
                    className={cx(classes.cell, classes.column)}>
                    <Grid
                        justify='center'
                        alignItems='center'
                        container>
                            <Grid
                                container
                                direction='column'
                                className={classes.paymentsContainer}>
                                <span className={classes.lastPayment}>
                                    {lastPayment}
                                </span>
                                <Divider className={classes.divider2} />
                                <span className={classes.lastDeposit}>
                                    {lastDeposit}
                                </span>
                            </Grid>
                    </Grid>
                </TableCell>
            </MuiTableRow>
        );
    }
}

export default withStyles(styles)(TableRow);
