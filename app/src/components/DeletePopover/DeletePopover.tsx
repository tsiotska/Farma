import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    Popover,
    PopoverProps,
    IconButton,
    Tooltip
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IDeletePopoverSettings } from '../../stores/UIStore';
import { Done, Close } from '@material-ui/icons';
import { toJS, observable } from 'mobx';
import cx from 'classnames';

const styles = (theme: any) => createStyles({
    paper: {
        display: 'flex',
        alignItems: 'center',
    },
    iconButton: {
        borderRadius: 2,
        transition: '0.3s'
    },
    removeButton: {
        color: 'red'
    }
});

interface IProps extends WithStyles<typeof styles>, Pick<PopoverProps,  'anchorOrigin' | 'transformOrigin'> {
    name: string;
    delPopoverSettings?: IDeletePopoverSettings;
}

@inject(({
    appState: {
        uiStore: {
            delPopoverSettings
        }
    }
}) => ({
    delPopoverSettings
}))
@observer
class DeletePopover extends Component<IProps> {
    @observable disabledConfirm: boolean = true;

    get anchor(): Element {
        const {
            name: givenName,
            delPopoverSettings: {
                anchorEl,
                callback,
                name
        }} = this.props;
        const namesIsEqual = givenName === name;
        return namesIsEqual
            ? anchorEl
            : null;
    }

    confirmClickHandler = () => {
        const { delPopoverSettings: { callback } } = this.props;
        if (callback) callback(true);
    }

    rejectClickHandler = () => {
        const { delPopoverSettings: { callback } } = this.props;
        if (callback) callback(false);
    }

    componentDidUpdate(prevProps: IProps) {
        const { delPopoverSettings: { anchorEl: prevAnchor }} = prevProps;
        const { delPopoverSettings: { anchorEl }} = this.props;
        const becomeOpen = !prevAnchor && !!anchorEl;
        const becomeClosed = !!prevAnchor && !anchorEl;
        if (becomeOpen) {
            window.setTimeout(() => {
                this.disabledConfirm = false;
            }, 600);
        }
        if (becomeClosed) {
            this.disabledConfirm = true;
        }
    }

    render() {
        const {
            classes,
            anchorOrigin,
            transformOrigin,
            delPopoverSettings
        } = this.props;

        return (
            <Popover
                open={!!this.anchor}
                anchorEl={this.anchor}
                anchorOrigin={anchorOrigin}
                transformOrigin={transformOrigin}
                elevation={20}
                classes={{ paper: classes.paper }}>
                    <Tooltip
                        title={
                            this.disabledConfirm
                                ? ''
                                : 'Видалити'
                        }
                        placement='top'
                        enterDelay={250}
                        arrow>
                        <IconButton
                            disabled={this.disabledConfirm}
                            onClick={this.confirmClickHandler}
                            className={cx(classes.iconButton, {[classes.removeButton]: !this.disabledConfirm})}>
                            <Done fontSize='small' />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='Відмінити' placement='top' enterDelay={250} arrow>
                        <IconButton onClick={this.rejectClickHandler} className={classes.iconButton}>
                            <Close fontSize='small' />
                        </IconButton>
                    </Tooltip>
            </Popover>
        );
    }
}

export default withStyles(styles)(DeletePopover);
