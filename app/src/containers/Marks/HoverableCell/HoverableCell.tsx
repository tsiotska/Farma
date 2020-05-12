import React, { Component } from 'react';
import {
    WithStyles,
    TableCell,
    Grid,
    Tooltip,
    Divider,
    Input
} from '@material-ui/core';
import { observer } from 'mobx-react';
import { IAgentInfo } from '../../../interfaces/IBonusInfo';
import { observable, computed } from 'mobx';

const styles = {
    cell: {},
    tooltip: {},
    divider: {},
    input: {}
};

interface IProps extends WithStyles<typeof styles> {
    tooltip: string;
    editable: boolean;
    agentInfo: IAgentInfo;
    medId: number;
    onChange?: (
        propName: 'payments' | 'deposit',
        agentInfo: IAgentInfo,
        medId: number,
        value: number
    ) => void;
}

@observer
class HoverableCell extends Component<IProps> {
    readonly maxValue: number = 99999;

    @observable openTooltip: boolean = false;

    @computed
    get payments(): number {
        const { agentInfo, medId} = this.props;
        const mark = agentInfo
            ? agentInfo.marks.get(medId)
            : null;
        return mark
            ? mark.payments
            : 0;
    }

    @computed
    get deposit(): number {
        const { agentInfo, medId} = this.props;
        const mark = agentInfo ? agentInfo.marks.get(medId) : null;
        return mark ? mark.deposit : 0;
    }

    onHover = () => {
        this.openTooltip = true;
    }

    onMouseLeave = () => {
        this.openTooltip = false;
    }

    dispatchChange = (propName: 'payments' | 'deposit', value: number) => {
        const { onChange, agentInfo, medId } = this.props;
        if (Number.isNaN(value) || value < 0) return;
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
        const { classes, tooltip, editable, agentInfo } = this.props;

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
