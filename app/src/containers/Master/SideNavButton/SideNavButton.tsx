import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Tooltip, Button } from '@material-ui/core';
import { computed } from 'mobx';

interface IProps {
    children: any;
    className: string;
    clickHandler?: () => void;
    disabled?: boolean;
    tooltip?: string;
}

@observer
class SideNavButton extends Component<IProps> {
    @computed
    get tooltipText(): string {
        const { disabled, tooltip } = this.props;
        const defaultTooltip = '';
        return disabled
        ? defaultTooltip
        : tooltip || defaultTooltip;
    }
    render() {
        const {
            children,
            className,
            clickHandler,
            disabled,
            tooltip
        } = this.props;

        return (
            <Tooltip placement='right' title={this.tooltipText}>
                <Button
                    onClick={clickHandler}
                    className={className}
                    disabled={disabled}>
                    { children }
                </Button>
            </Tooltip>
        );
    }
}

export default SideNavButton;
