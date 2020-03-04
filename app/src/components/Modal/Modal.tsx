import React, {PureComponent, ReactNode} from 'react';
import { observer } from 'mobx-react';

import {
    Modal as MuiModal,
    Paper,
    createStyles,
    IconButton,
    withStyles,
    WithStyles,
    Typography
} from '@material-ui/core';
import {Close} from '@material-ui/icons';
import cx from 'classnames';

const styles = createStyles({
    root: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        padding: 30,
        transform: 'translate(-50%, -50%)',
        minWidth: 370,
        '&:denseWidth': {
            minWidth: 200
        },
        '&:focus': {
            outline: 'unset'
        }
    },
    title: {
        fontWeight: 'bold',
        marginBottom: '40px',
        textTransform: 'capitalize'
    },
    closeButton: {
        position: 'absolute',
        right: 30,
        top: 30
    },
    iconRoot: {
        padding: 'unset'
    }
});

interface IProps extends WithStyles<typeof styles> {
    title?: string | ReactNode;
    isCloseButtonHidden?: boolean;
    isOpen: boolean;
    closeHandler: () => void;
    denseWidth?: boolean;
    onClick?: (e: any) => void;
}

@observer
class Modal extends PureComponent<IProps, null> {
    clickHandler = (e: any) => {
        const { onClick } = this.props;
        if (onClick) onClick(e);
    }

    render() {
        const {
            isOpen,
            closeHandler,
            classes,
            title,
            isCloseButtonHidden,
            children,
            denseWidth = false,
            ...rest
        } = this.props;

        return <MuiModal
            {...rest}
            onClick={this.clickHandler}
            open={isOpen}
            onClose={closeHandler}
            onEscapeKeyDown={closeHandler}>
            <Paper
                elevation={0}
                className={cx(classes.root, {
                    denseWidth: denseWidth
                })}>
                {
                    !isCloseButtonHidden &&
                        <IconButton
                            className={classes.closeButton}
                            classes={{
                                root: classes.iconRoot
                            }}
                            onClick={closeHandler}>
                            <Close />
                        </IconButton>
                }
                {
                    (title && typeof title === 'string')
                        ? (
                            <Typography
                            variant='h6'
                            className={classes.title}>
                                { title }
                            </Typography>
                          )
                        : title
                }
                {children}
            </Paper>
        </MuiModal>;
    }
}

export default withStyles(styles)(Modal);
