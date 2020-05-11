import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    TableRow as MuiTableRow,
    TableCell,
    Grid,
    Divider,
    Collapse,
    Typography
} from '@material-ui/core';
import { KeyboardArrowDown } from '@material-ui/icons';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { computed, toJS, observable } from 'mobx';
import cx from 'classnames';
import { IAgentInfo, IDrugSale } from '../../../interfaces/IBonusInfo';
import { IMedicine } from '../../../interfaces/IMedicine';
import HoverableCell from '../HoverableCell';

const styles = (theme: any) => createStyles({
    root: {
        textTransform: 'capitalize'
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
        verticalAlign: 'middle',
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
        marginTop: -2
    },
    input: {
        minWidth: 0,
        '& > *': {
            textAlign: 'center'
        }
    },
    expandIcon: {
        transition: '0.3s',
        '&.rotate': {
            transform: 'rotate(180deg)'
        }
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
    expanded?: boolean | null; // true/false - isExpanded, null - not expandable
    expandHandler?: (id: number, isExpanded: boolean) => void;
}

@inject(({
    appState: {
        userStore: {
            filteredMeds: meds
        },
    }
}) => ({
    meds,
}))
@observer
class TableRow extends Component<IProps> {
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

    @computed
    get medsContent(): JSX.Element[] | JSX.Element {
        const {
            classes,
            meds,
            tooltips,
            agent
        } = this.props;

        return meds.length
        ? meds.map(({ id }) => {

            return (
                <HoverableCell
                    key={id}
                    agent={agent}
                    medId={id}
                    tooltip={tooltips[id] || ''}
                    classes={{
                        cell: classes.cell,
                        tooltip: classes.tooltip,
                        divider: classes.divider,
                        input: classes.input
                    }}
                />
            );
          })
        : <TableCell />;
    }

    @computed
    get columnsCount(): number {
        const { meds, showLpu } = this.props;
        return 4 + meds.length + (showLpu ? 1 : 0);
    }

    get isExpandable(): boolean {
        const { expandHandler, expanded } = this.props;
        return !!expandHandler && typeof expanded === 'boolean';
    }

    expandHandler = () => {
        const { expandHandler, expanded, agent } = this.props;
        if (this.isExpandable) expandHandler(agent.id, !expanded);
    }

    render() {
        const {
            classes,
            showLpu,
            agentName,
            lpuName,
            itemRef,
            expanded,
            agent: {
                lastDeposit,
                lastPayment,
            }
        } = this.props;

        return (
            <>
            <MuiTableRow ref={itemRef} className={classes.root}>
                {
                    showLpu &&
                    <TableCell
                        onClick={this.expandHandler}
                        padding='none'
                        className={cx(classes.cell, classes.wideColumn)}>
                        <Grid container>
                            {
                                this.isExpandable &&
                                <KeyboardArrowDown
                                    className={cx(classes.expandIcon, { rotate: expanded === true })}
                                    fontSize='small' />
                            }
                            { lpuName }
                        </Grid>
                    </TableCell>
                }
                <TableCell
                    onClick={this.expandHandler}
                    padding='none'
                    className={cx(
                        classes.cell, {
                        [classes.doubleWidthColumn]: !showLpu,
                        [classes.wideColumn]: showLpu,
                    })}>
                    {
                        this.isExpandable === true && showLpu === false &&
                        <KeyboardArrowDown
                            className={cx(classes.expandIcon, { rotate: expanded === true })}
                            fontSize='small' />
                    }
                    { agentName }
                </TableCell>
                { this.medsContent }
                <TableCell
                    align='center'
                    padding='none'
                    className={cx(classes.cell, classes.column)}>
                    <Grid direction='column' alignItems='center' container>
                        <span>
                            {this.packs[0]}
                        </span>
                        <Divider className={classes.divider} />
                        <span>
                            {this.packs[1]}
                        </span>
                    </Grid>
                </TableCell>
                <TableCell
                    align='center'
                    padding='none'
                    className={cx(classes.cell, classes.column)}>
                    <Grid direction='column' alignItems='center' container>
                        <span>{lastPayment}</span>
                        <Divider className={classes.divider} />
                        <span>{lastDeposit}</span>
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
            {
                this.isExpandable &&
                <MuiTableRow>
                    <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={this.columnsCount}>
                        <Collapse in={expanded} timeout='auto' unmountOnExit>
                            <Typography>
                                hello
                            </Typography>
                        </Collapse>
                    </TableCell>
                </MuiTableRow>
            }
            </>
        );
    }
}

export default withStyles(styles)(TableRow);
