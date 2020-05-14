import React, { Component } from 'react';
import {
    createStyles,
    withStyles,
    WithStyles,
    Popover,
    IconButton
} from '@material-ui/core';
import Icon from '../../components/InfoIcon';
import { computed, observable } from 'mobx';
import { observer, inject } from 'mobx-react';

const styles = (theme: any) => createStyles({
    root: {},
    icon: {},
    button: {}
});

interface IProps extends WithStyles<typeof styles> {
    children: any;
    setInfoPopper?: (val: boolean) => void;
    isInfoPopperOpen?: boolean;
    icon?: JSX.Element;
}

@inject(({
    appState: {
        uiStore: {
            setInfoPopper,
            isInfoPopperOpen
        }
    }
}) => ({
    setInfoPopper,
    isInfoPopperOpen
}))
@observer
class InfoWindow extends Component<IProps> {
    @observable anchorEl: any = null;

    handleClick = (event: React.FormEvent<EventTarget>): void => {
        event.stopPropagation();
        if (this.anchorEl) {
            this.props.setInfoPopper(false);
            this.anchorEl = null;
        } else {
            this.props.setInfoPopper(true);
            this.anchorEl = event.currentTarget;
        }
    }

    closeInfo = (e: any): void => {
        this.props.setInfoPopper(false);
        this.anchorEl = null;
    }

    @computed
    get open() {
        return !!this.anchorEl;
    }

    @computed
    get id() {
        return this.anchorEl ? 'simple-popper' : undefined;
    }

    render() {
        const { classes, children, icon } = this.props;

        return (
            <>
                <IconButton className={classes.button} onClick={this.handleClick}>
                    <Icon icon={icon} className={classes.icon} aria-describedby={this.id} />
                </IconButton>
                <Popover onClose={this.closeInfo} id={this.id} open={this.open} anchorEl={this.anchorEl}
                         anchorOrigin={{
                             vertical: 'bottom',
                             horizontal: 'left',
                         }}>
                   {children}
                </Popover>
            </>
        );
    }
}

export default withStyles(styles)(InfoWindow);
