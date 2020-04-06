import React, { Component } from 'react';
import {
    createStyles,
    withStyles,
    WithStyles,
    Snackbar as MuiSnackbar
} from '@material-ui/core';
import { observer } from 'mobx-react';
import { Alert } from '@material-ui/lab';

const styles = (theme: any) => createStyles({
    root: {
        position: 'absolute'
    }
});

export enum SNACKBAR_TYPE {
    ERROR = 1,
    SUCCESS,
}

interface IProps extends WithStyles<typeof styles> {
    open: boolean;
    onClose: () => void;
    type: SNACKBAR_TYPE;
}

@observer
class Snackbar extends Component<IProps> {
    render() {
        const {
            classes,
            open,
            onClose,
            type
        } = this.props;

        return (
            <MuiSnackbar
                className={classes.root}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                autoHideDuration={6000}
                open={open}
                onClose={onClose}>
                <Alert
                    onClose={onClose}
                    severity={
                        type === SNACKBAR_TYPE.SUCCESS
                        ? 'success'
                        : 'error'
                    }>
                        {
                            type === SNACKBAR_TYPE.SUCCESS
                            ? 'Медикамент успішно додано'
                            : 'Неможливо додати медикамент'
                        }
                </Alert>
            </MuiSnackbar>
        );
    }
}

export default withStyles(styles)(Snackbar);
