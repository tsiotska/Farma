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
    alignCenter: {
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
    agentName: string;
    meds?: IMedicine[];
    drugsMarks?: Map<number, number>;
}

@inject(({
    appState: {
        departmentsStore: {
            currentDepartmentMeds: meds
        },
        userStore: {
            drugsMarks
        }
    }
}) => ({
    meds,
    drugsMarks
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

    @computed
    get packs(): [number, number] {
        const { meds, agent: { marks }} = this.props;
        return meds.length
            ? meds.reduce((total, { id }) => {
                const mark = marks.get(id);

                if (mark) {
                    total[0] += mark.payments;
                    total[1] += mark.deposit;
                }

                return total;
              }, [0, 0])
            : [0, 0];
    }

    @computed
    get total(): [number, number] {
        const { meds, drugsMarks, agent: { marks }} = this.props;

        return meds.length
            ? meds.reduce((total, { id }) => {
                const mark = marks.get(id);
                const multiplier = drugsMarks.get(id);

                if (mark) {
                    total[0] += mark.payments * multiplier;
                    total[1] += mark.deposit * multiplier;
                }

                return total;
              }, [0, 0])
            : [0, 0];
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
                        <span className={classes.span}>
                            {this.packs[0]}
                        </span>
                        <Divider className={classes.divider} />
                        <span className={classes.span}>
                            {this.packs[1]}
                        </span>
                    </Grid>
                </TableCell>
                <TableCell
                    align='center'
                    padding='none'
                    className={cx(classes.cell, classes.column)}>
                    <Grid direction='column' alignItems='center' container>
                        <span className={classes.span}>{lastPayment}</span>
                        <Divider className={classes.divider} />
                        <span className={classes.span}>{lastDeposit}</span>
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
                                <span className={classes.alignCenter}>
                                    {this.total[0]}
                                </span>
                                <Divider className={classes.divider2} />
                                <span className={classes.alignCenter}>
                                    {this.total[1]}
                                </span>
                            </Grid>
                    </Grid>
                </TableCell>
            </MuiTableRow>
        );
    }
}

export default withStyles(styles)(TableRow);
