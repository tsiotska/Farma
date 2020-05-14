import React, { Component } from 'react';
import {
    WithStyles,
    TableCell,
    Grid,
    Tooltip,
    Divider,
    Input
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { IAgentInfo, IMark } from '../../../interfaces/IBonusInfo';
import { observable, computed, toJS } from 'mobx';

const styles = {
    cell: {},
    tooltip: {},
    divider: {},
    input: {
        fontSize: 14
    }
};

interface IProps extends WithStyles<typeof styles> {
    tooltip: string;
    editable: boolean;
    agentInfo: IAgentInfo;
    medId: number;
    agentId: number;
    onChange?: (
        propName: 'payments' | 'deposit',
        agentInfo: IAgentInfo,
        medId: number,
        value: number
    ) => void;
    changedMarks?: Map<number,  Map<number, IMark>>;
}

@inject(({
    appState: {
        userStore: {
            changedMarks
        }
    }
}) => ({
    changedMarks
}))
@observer
class HoverableCell extends Component<IProps> {
    readonly maxValue: number = 99999;

    @observable openTooltip: boolean = false;

    @computed get mark(): IMark {
        const {
            agentId,
            agentInfo,
            changedMarks,
            medId,
            editable
        } = this.props;

        if (editable) {
            const agentMarks = changedMarks.get(agentId);
            const res = agentMarks
                ? agentMarks.get(medId)
                : null;
            if (res) return res;
        }

        return agentInfo && agentInfo.marks
            ? agentInfo.marks.get(medId) || null
            : null;
    }

    @computed
    get payments(): number {
        return this.mark
            ? this.mark.payments
            : 0;
    }

    @computed
    get deposit(): number {
        return this.mark
            ? this.mark.deposit
            : 0;
    }

    onHover = () => {
        this.openTooltip = true;
    }

    onMouseLeave = () => {
        this.openTooltip = false;
    }

    dispatchChange = (propName: 'payments' | 'deposit', value: number) => {
        const { onChange, agentInfo, medId, tooltip } = this.props;
        if (Number.isNaN(value) || value < 0 || !tooltip) return;
        onChange(
            propName,
            agentInfo,
            medId,
            value > this.maxValue
                ? this.maxValue
                : value
        );
    }

    paymentChangeHandler = ({ target: { value }}: any) => this.dispatchChange('payments', +value);
    depositChangeHandler = ({ target: { value }}: any) => this.dispatchChange('deposit', +value);

    render() {
        const { classes, tooltip, editable } = this.props;

        return (
            <TableCell className={classes.cell}>
                <Grid
                    onMouseOver={this.onHover}
                    onMouseLeave={this.onMouseLeave}
                    direction='column'
                    alignItems='center'
                    container>
                        {
                            editable
                            ? <Input
                                disableUnderline
                                className={classes.input}
                                onChange={this.paymentChangeHandler}
                                value={this.payments} />
                            : <span>
                                { this.payments }
                            </span>
                        }
                        <Tooltip
                            arrow
                            open={this.openTooltip}
                            placement='right'
                            title={tooltip}
                            TransitionProps={{
                                timeout: this.openTooltip
                                ? 300
                                : 0
                            }}
                            classes={{ tooltip: classes.tooltip }}>
                            <Divider className={classes.divider} />
                        </Tooltip>
                        {
                            editable
                            ? <Input
                                disableUnderline
                                className={classes.input}
                                onChange={this.depositChangeHandler}
                                value={this.deposit} />
                            : <span>
                                { this.deposit }
                            </span>
                        }

                </Grid>
            </TableCell>
        );
    }
}

export default HoverableCell;
