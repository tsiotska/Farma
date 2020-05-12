import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    TableRow,
    TableCell,
    Grid,
    Divider
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IMedicine } from '../../../interfaces/IMedicine';
import cx from 'classnames';
import { IAgentInfo, IMark } from '../../../interfaces/IBonusInfo';
import { computed, reaction, toJS } from 'mobx';
import { IMarkFraction } from '../../../stores/UserStore';

const styles = (theme: any) => createStyles({
    root: {
        height: 48
    },
    firstColumn: {
        width: 284
        // width: ({ position, showLpu }: any) => position === 'fixed'
        // ? showLpu
        //     ? 284 / 2
        //     : 284
        // : 'auto',
    },
    column: {
        width: 70,
        '&:last-of-type': {
            paddingRight: 5
        }
    },
    cell: {
        verticalAlign: 'center',
        border: 'none',
        textAlign: 'center',
        '&:first-of-type': {
            textAlign: 'left'
        }
    },
    divider: {
        minWidth: 30,
        width: '50%'
    },
    gridItem: {
        width: 'auto'
    }
});

interface IProps extends WithStyles<typeof styles> {
    agents: IAgentInfo[];
    position: 'initial' | 'fixed';
    showLpu: boolean;

    changedMarks?: Map<number, Map<number, IMark>>;
    meds?: IMedicine[];
    setPreviewBonusTotal?: (packs: IMarkFraction, marks: IMarkFraction) => void;
    clearPreviewBonusTotal?: () => void;
}

@inject(({
    appState: {
        userStore: {
            setPreviewBonusTotal,
            clearPreviewBonusTotal,
            changedMarks
        },
        departmentsStore: {
            currentDepartmentMeds: meds
        }
    }
}) => ({
    meds,
    changedMarks,
    setPreviewBonusTotal,
    clearPreviewBonusTotal
}))
@observer
class TotalRow extends Component<IProps> {
    reactionDisposer: any;

    @computed
    get flattenMedsInfo(): IMark[] {
        const { agents, changedMarks } = this.props;
        console.log('agents: ', toJS(agents));
        return agents.reduce((acc, curr) => {
            const { marks, id } = curr;
            const changedAgentMarks = changedMarks.get(id);

            if (!changedAgentMarks) {
                return [...acc, ...marks.values()];
            }

            const filteredAgentValues = [...marks.values()]
                .filter(x => changedAgentMarks.has(x.drugId) === false);

            return [...acc, ...changedAgentMarks.values(), ...filteredAgentValues];
        }, []);
    }

    @computed
    get summedMeds(): {[key: number]: IMarkFraction} {
        return this.flattenMedsInfo.reduce((acc, curr) => {
            const { drugId, deposit, mark, payments } = curr;

            if (drugId in acc) {
                acc[drugId].payments += payments * mark;
                acc[drugId].deposit += deposit * mark;
            } else {
                acc[drugId] = {
                    payments: payments * mark,
                    deposit: deposit * mark,
                };
            }

            return acc;
        }, {});
    }

    @computed
    get summedPacks(): IMarkFraction {
        return this.flattenMedsInfo.reduce((acc, curr) => {
            const { deposit, payments } = curr;
            acc.payments += payments;
            acc.deposit += deposit;
            return acc;
        }, {
            payments: 0,
            deposit: 0
        });
    }

    @computed
    get summedTotal(): IMarkFraction {
        return this.flattenMedsInfo.reduce((acc, curr) => {
            const { deposit, payments, mark } = curr;
            acc.payments += payments * mark;
            acc.deposit += deposit * mark;
            return acc;
        }, {
            payments: 0,
            deposit: 0
        });
    }

    @computed
    get summedBonuses(): IMarkFraction {
        return this.props.agents.reduce((acc, curr) => {
            const { lastDeposit, lastPayment } = curr;

            acc.payments += lastPayment;
            acc.deposit += lastDeposit;

            return acc;
        }, {
            payments: 0,
            deposit: 0
        });
    }

    componentDidMount() {
        const { setPreviewBonusTotal } = this.props;
        this.reactionDisposer = reaction(
            () => ([ this.summedPacks, this.summedTotal ]),
            ([ summedPacks, summedTotal ]: [ IMarkFraction, IMarkFraction ]) => {
                setPreviewBonusTotal(summedPacks, summedTotal);
            },
            { fireImmediately: true }
        );
    }

    componentWillUnmount() {
        if (this.reactionDisposer) this.reactionDisposer();
        this.props.clearPreviewBonusTotal();
    }

    render() {
        const {classes, meds, position, showLpu} = this.props;

        const colSpan = position === 'fixed'
        ? 1
        : showLpu
            ? 2
            : 1;

        return (
            <TableRow className={classes.root}>
                <TableCell
                    align='center'
                    padding='none'
                    colSpan={colSpan}
                    className={cx(classes.cell, classes.firstColumn)}>
                    В сумі
                </TableCell>
                {
                    meds.map(x => {
                        const data = this.summedMeds[x.id];
                        const deposit = data
                            ? data.deposit
                            : 0;
                        const payments = data
                            ? data.payments
                            : 0;
                        return (
                            <TableCell
                                key={x.id}
                                align='center'
                                padding='none'
                                className={classes.cell}>
                                    <Grid
                                        alignItems='center'
                                        direction='column'
                                        container>
                                        <span>
                                            { payments }
                                        </span>
                                        <Divider className={classes.divider} />
                                        <span>
                                            { deposit }
                                        </span>
                                    </Grid>
                            </TableCell>
                        );
                    })
                }
                <TableCell
                    className={cx(classes.cell, classes.column)}
                    align='center'
                    padding='none'>
                    <Grid
                        alignItems='center'
                        direction='column'
                        container>
                        <span>
                            { this.summedPacks.payments }
                        </span>
                        <Divider className={classes.divider} />
                        <span>
                            { this.summedPacks.deposit }
                        </span>
                    </Grid>
                </TableCell>
                <TableCell
                    className={cx(classes.cell, classes.column)}
                    align='center'
                    padding='none'>
                    <Grid
                        alignItems='center'
                        direction='column'
                        container>
                        <span>
                            { this.summedBonuses.payments }
                        </span>
                        <Divider className={classes.divider} />
                        <span>
                            { this.summedBonuses.deposit }
                        </span>
                    </Grid>
                </TableCell>
                <TableCell
                    className={cx(classes.cell, classes.column)}
                    align='right'
                    padding='none'>
                    <Grid container justify='flex-end'>
                            <Grid
                                className={classes.gridItem}
                                alignItems='center'
                                direction='column'
                                container>
                                <span>
                                    { this.summedTotal.payments }
                                </span>
                                <Divider className={classes.divider} />
                                <span>
                                    { this.summedTotal.deposit }
                                </span>
                            </Grid>
                    </Grid>
                </TableCell>
            </TableRow>
        );
    }
}

export default withStyles(styles)(TotalRow);
