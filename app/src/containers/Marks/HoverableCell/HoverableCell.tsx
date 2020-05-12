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
import { IMark, IAgentInfo } from '../../../interfaces/IBonusInfo';
import { observable, computed, action } from 'mobx';
import { USER_ROLE } from '../../../constants/Roles';

const styles = {
    cell: {},
    tooltip: {},
    divider: {},
    input: {}
};

interface IProps extends WithStyles<typeof styles> {
    tooltip: string;
    role?: USER_ROLE;
    agent: IAgentInfo;
    medId: number;
    previewBonusChangeHandler?: (propName: 'payments' | 'deposit', agent: IAgentInfo, medId: number, value: number) => void;
}

@inject(({
    appState: {
        userStore: {
            role,
            previewBonusChangeHandler
        }
    }
}) => ({
    role,
    previewBonusChangeHandler
}))
@observer
class HoverableCell extends Component<IProps> {
    readonly maxValue: number = 99999;

    @observable openTooltip: boolean = false;

    @computed
    get isEditable(): boolean {
        return this.props.role === USER_ROLE.MEDICAL_AGENT;
    }

    @computed
    get payments(): number {
        const { agent, medId} = this.props;
        const mark = agent
            ? agent.marks.get(medId)
            : null;
        return mark
            ? mark.payments
            : 0;
    }

    @computed
    get deposit(): number {
        const { agent, medId} = this.props;
        const mark = agent ? agent.marks.get(medId) : null;
        return mark ? mark.deposit : 0;
    }

    onHover = () => {
        this.openTooltip = true;
    }

    onMouseLeave = () => {
        this.openTooltip = false;
    }

    dispatchChange = (propName: 'payments' | 'deposit', value: number) => {
        const { previewBonusChangeHandler, agent, medId } = this.props;
        console.log('handler, value: ', value);
        if (Number.isNaN(value) || value < 0) return;
        previewBonusChangeHandler(
            propName,
            agent,
            medId,
            value > this.maxValue
                ? this.maxValue
                : value
        );
    }

    paymentChangeHandler = ({ target: { value }}: any) => this.dispatchChange('payments', +value);
    depositChangeHandler = ({ target: { value }}: any) => this.dispatchChange('deposit', +value);

    render() {
        const { classes, tooltip } = this.props;

        return (
            <TableCell className={classes.cell}>
                <Grid
                    onMouseOver={this.onHover}
                    onMouseLeave={this.onMouseLeave}
                    direction='column'
                    alignItems='center'
                    container>
                        {
                            this.isEditable
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
                            this.isEditable
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
