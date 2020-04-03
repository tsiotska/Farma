import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Tooltip, Button } from '@material-ui/core';

interface IProps {
    children: any;
    className: string;
    clickHandler: () => void;
    disabled: boolean;
    tooltip: string;
}

@observer
class SideNavButton extends Component<IProps> {
    render() {
        const {
            children,
            className,
            clickHandler,
            disabled,
            tooltip
        } = this.props;

        return (
            <Tooltip placement='right' title={disabled ? '' : tooltip}>
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
