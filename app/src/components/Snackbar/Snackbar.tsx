import React, { Component } from 'react';
import {
    createStyles,
    withStyles,
    WithStyles,
    Snackbar as MuiSnackbar,
    SnackbarProps,
    SnackbarOrigin
} from '@material-ui/core';
import { observer } from 'mobx-react';
import { Alert } from '@material-ui/lab';
import { SNACKBAR_TYPE } from '../../constants/Snackbars';

const styles = (theme: any) => createStyles({
    root: {
        position: 'absolute'
    }
});

interface IProps extends WithStyles<typeof styles>, Omit<SnackbarProps, 'classes'> {
    open: boolean;
    onClose: () => void;
    type: SNACKBAR_TYPE;
    message: string;
}

@observer
class Snackbar extends Component<IProps> {
    defaultAutoHideDuration: number = 6000;
    defaultAnchorOrigin: SnackbarOrigin = {
        vertical: 'top',
        horizontal: 'center'
    };

    render() {
        const {
            classes,
            open,
            onClose,
            type,
            message,
            anchorOrigin,
            autoHideDuration,
        } = this.props;

        return (
            <MuiSnackbar
                className={classes.root}
                anchorOrigin={anchorOrigin || this.defaultAnchorOrigin}
                autoHideDuration={autoHideDuration || this.defaultAutoHideDuration}
                open={open}
                onClose={onClose}>
                <Alert onClose={onClose} severity={type}>
                    { message }
                </Alert>
            </MuiSnackbar>
        );
    }
}

export default withStyles(styles)(Snackbar);
