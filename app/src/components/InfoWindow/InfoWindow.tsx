import React, { Component } from 'react';
import { createStyles, withStyles, WithStyles, Popover } from '@material-ui/core';
import Icon from '../../components/InfoIcon';
import { computed, observable } from 'mobx';
import { observer } from 'mobx-react';
const styles = (theme: any) => createStyles({
    root: {},
    infoIcon: {
        '&:hover': {
            cursor: 'pointer'
        }
    },
});

interface IProps extends WithStyles<typeof styles> {
   children: JSX.Element;
}

@observer
class InfoWindow extends Component<IProps> {
    @observable anchorEl: any = false;

    handleClick = (event: React.FormEvent<EventTarget>): void => {
        this.anchorEl = this.anchorEl ? null : event.currentTarget;
    }

    closeInfo = (): void => {
        this.anchorEl = null;
    }

    @computed
    get open() {
        return Boolean(this.anchorEl);
    }

    @computed
    get id() {
        return this.anchorEl ? 'simple-popper' : undefined;
    }
    render() {
        const { classes, children } = this.props;

        return (
            <>
                <Icon aria-describedby={this.id} onClick={this.handleClick} className={classes.infoIcon}/>
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
