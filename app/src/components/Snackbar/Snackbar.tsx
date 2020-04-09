import React, { Component } from 'react';
import {
    createStyles,
    withStyles,
    WithStyles,
    Snackbar as MuiSnackbar,
    SnackbarProps
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
                anchorOrigin={anchorOrigin}
                autoHideDuration={autoHideDuration}
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
