import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    TableRow as MuiTableRow,
    TableCell,
    Grid,
    Divider,
    Collapse,
    Typography,
    Paper
} from '@material-ui/core';
import { KeyboardArrowDown } from '@material-ui/icons';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { computed, toJS, observable } from 'mobx';
import cx from 'classnames';
import { IAgentInfo, IDrugSale, IMark, IBonusInfo } from '../../../interfaces/IBonusInfo';
import { IMedicine } from '../../../interfaces/IMedicine';
import HoverableCell from '../HoverableCell';
import Table, { IUserInfo } from '../Table/Table';
import { IUserLikeObject } from '../../../stores/DepartmentsStore';
import { USER_ROLE } from '../../../constants/Roles';

const styles = (theme: any) => createStyles({
    root: {
        textTransform: 'capitalize'
    },
    column: {
        width: 70
    },
    cell: {
        verticalAlign: 'middle',
        border: 'none',
        borderBottom: '10px solid white',
        backgroundColor: '#F7F7F9',
        padding: 5,
        // '&.clickable': {
        //     cursor: 'pointer'
        // }
    },
    clickable: {
        cursor: 'pointer',
        transition: '0.3s',
        '&:hover': {
            background: '#ececec'
        }
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
        margin: 5,
        '&.rotate': {
            transform: 'rotate(180deg)'
        }
    },
    nestedContainer: {
        paddingBottom: 0,
        paddingTop: 0,
        '&.nest': {
            paddingLeft: 16
        }
        // paddingLeft: this.nestLevel ? 16 : 0
    },
    subheader: {
        marginBottom: 12
    }
});

interface IProps extends WithStyles<typeof styles> {
    agentInfo: IAgentInfo;
    showLpu: boolean;
    agent: IUserInfo & IUserLikeObject;
    meds?: IMedicine[];
    tooltips: { [key: number]: string };
    itemRef?: any;
    expanded?: boolean | null; // true/false - isExpanded, null - not expandable
    expandHandler?: (id: number, isExpanded: boolean) => void;
    bonuses?: Partial<Record<USER_ROLE, IBonusInfo[]>>;
    previewBonusMonth?: number;
    role?: USER_ROLE;
    isNested: boolean;
    previewBonusChangeHandler?: (
        propName: 'payments' | 'deposit',
        agent: IUserLikeObject,
        agentInfo: IAgentInfo,
        medId: number,
        value: number
    ) => void;
}

@inject(({
    appState: {
        departmentsStore: {
            currentDepartmentMeds: meds
        },
        userStore: {
            bonuses,
            previewBonusChangeHandler,
            previewBonusMonth,
            role
        }
    }
}) => ({
    meds,
    role,
    bonuses,
    previewBonusChangeHandler,
    previewBonusMonth
}))
@observer
class TableRow extends Component<IProps> {
    readonly paddingLeft: number = 10;
    @computed
    get agentMarks(): Map<number, IMark> {
        const { agentInfo } = this.props;
        return agentInfo
            ? agentInfo.marks
            : new Map();
    }

    @computed
    get nestLevel(): number {
        const { role, agent } = this.props;
        // console.log('agent pos: ', agent.position, USER_ROLE[agent.position]);
        const userRole = typeof agent.position === 'string'
            ? USER_ROLE.MEDICAL_AGENT + 1
            : agent.position;
        return userRole - role;
    }

    @computed
    get packs(): [number, number] {
        const { meds} = this.props;

        return meds.length
            ? meds.reduce((total, { id }) => {
                const mark = this.agentMarks.get(id);

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
        const { meds } = this.props;

        return meds.length
            ? meds.reduce((total, { id }) => {
                const mark = this.agentMarks.get(id);

                if (mark) {
                    total[0] += mark.payments * mark.mark;
                    total[1] += mark.deposit * mark.mark;
                }

                return total;
              }, [0, 0])
            : [0, 0];
    }

    @computed
    get columnsCount(): number {
        const { meds, showLpu } = this.props;
        return 4 + meds.length + (showLpu ? 1 : 0);
    }

    @computed
    get childBonus(): IBonusInfo {
        const { bonuses, agent, previewBonusMonth} = this.props;
        return bonuses[agent.position]
            ? bonuses[agent.position].find(({ month }) => month === previewBonusMonth)
            : null;
    }

    @computed
    get columnWidth(): number {
        return 150 - this.nestLevel * 16 / 2;
    }

    get isEditable(): boolean {
        const { agent: { position } } = this.props;
        return typeof position === 'string';
    }

    get isExpandable(): boolean {
        const { expandHandler, expanded } = this.props;
        return !!expandHandler && typeof expanded === 'boolean';
    }

    expandHandler = () => {
        const { expandHandler, expanded, agent: { id } } = this.props;
        if (this.isExpandable) expandHandler(id, !expanded);
    }

    cellValueChangeHandler = (
        propName: 'payments' | 'deposit',
        agentInfo: IAgentInfo,
        medId: number,
        value: number
    ) => {
        const { previewBonusChangeHandler, agent } = this.props;
        previewBonusChangeHandler(
            propName,
            agent,
            agentInfo,
            medId,
            value
        );
    }

    render() {
        const {
            classes,
            showLpu,
            agent,
            itemRef,
            expanded,
            agentInfo,
            meds,
            tooltips,
            isNested
        } = this.props;
        const { LPUName, name, position } = agent;

        const lastPayment = agentInfo ? agentInfo.lastPayment : '-';
        const lastDeposit = agentInfo ? agentInfo.lastDeposit : '-';

        const medsContent = meds.length
            ? meds.map(({ id }) => (
                <HoverableCell
                    key={id}
                    agentInfo={agentInfo}
                    onChange={this.cellValueChangeHandler}
                    editable={this.isEditable}
                    medId={id}
                    tooltip={tooltips[id] || ''}
                    classes={{
                        cell: classes.cell,
                        tooltip: classes.tooltip,
                        divider: classes.divider,
                        input: classes.input
                    }}
                />
              ))
            : <TableCell />;

        return (
            <>
            <MuiTableRow ref={itemRef} className={classes.root}>
                {
                    showLpu &&
                    <TableCell
                        onClick={this.expandHandler}
                        padding='none'
                        style={{ width: this.columnWidth }}
                        className={classes.cell}>
                            { LPUName }
                    </TableCell>
                }
                <TableCell
                    onClick={this.expandHandler}
                    padding='none'
                    style={{ width: this.columnWidth * (!!showLpu ? 1 : 2)}}
                    // className={cx(classes.cell, { clickable: this.isEditable })}
                    className={cx(classes.cell, { [classes.clickable]: this.isExpandable })}
                    >
                        <Grid container alignItems='center'>
                            {
                                this.isExpandable === true && showLpu === false &&
                                <KeyboardArrowDown
                                    className={cx(classes.expandIcon, { rotate: expanded === true })}
                                    fontSize='small' />
                            }
                            { name }
                        </Grid>
                </TableCell>
                { medsContent }
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
                        className={cx(classes.nestedContainer, { nest: !!this.nestLevel })}
                        colSpan={this.columnsCount}>
                        <Collapse in={expanded} timeout='auto' unmountOnExit>
                            <Typography className={classes.subheader}>
                                { agent.position === USER_ROLE.REGIONAL_MANAGER && 'Медицинські представники' }
                                { agent.position === USER_ROLE.MEDICAL_AGENT && 'Лікарі' }
                            </Typography>
                            <Table
                                previewBonus={this.childBonus}
                                isLoading={false}
                                parentUser={agent}
                                isNested
                            />
                        </Collapse>
                    </TableCell>
                </MuiTableRow>
            }
            </>
        );
    }
}

export default withStyles(styles)(TableRow);
