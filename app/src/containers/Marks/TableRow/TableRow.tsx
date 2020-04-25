import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    TableRow as MuiTableRow,
    TableCell,
    Grid,
    Divider,
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { computed, toJS } from 'mobx';
import cx from 'classnames';
import { IAgentInfo, IDrugSale } from '../../../interfaces/IBonusInfo';
import { IMedicine } from '../../../interfaces/IMedicine';
import HoverableCell from '../HoverableCell';

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
    },
    tooltip: {
        border: '1px solid #27A7DD',
        borderRadius: '4px',
        backgroundColor: 'white',
        color: 'black',
        // margin: 0,
        marginTop: -2
    }
});

interface IProps extends WithStyles<typeof styles> {
    agent: IAgentInfo;
    showLpu: boolean;
    agentName: string;
    lpuName: string;
    meds?: IMedicine[];
    tooltips: { [key: number]: string };
    itemRef?: any;
}

@inject(({
    appState: {
        departmentsStore: {
            currentDepartmentMeds: meds
        },
    }
}) => ({
    meds,
}))
@observer
class TableRow extends Component<IProps> {
    @computed
    get medsContent(): JSX.Element[] | JSX.Element {
        const { classes, meds, tooltips, agent: { marks }} = this.props;

        return meds.length
        ? meds.map(({ id }) => {
            const mark = marks.get(id);

            return (
                <HoverableCell
                    key={id}
                    mark={mark}
                    tooltip={tooltips[id] || ''}
                    classes={{
                        cell: classes.cell,
                        tooltip: classes.tooltip,
                        divider: classes.divider,
                        span: classes.span,
                    }}
                />
            );
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
        const { meds, agent: { marks }} = this.props;

        return meds.length
            ? meds.reduce((total, { id }) => {
                const mark = marks.get(id);

                if (mark) {
                    total[0] += mark.payments * mark.mark;
                    total[1] += mark.deposit * mark.mark;
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
            lpuName,
            itemRef,
            agent: {
                lastDeposit,
                lastPayment,
            }
        } = this.props;

        return (
            <MuiTableRow ref={itemRef} className={classes.root}>
                {
                    showLpu &&
                    <TableCell
                        padding='none'
                        className={cx(classes.cell, classes.wideColumn)}>
                        { lpuName }
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
