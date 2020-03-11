import React, { Component } from 'react';
import { createStyles, WithStyles, DialogProps, Dialog as MuiDialog, Grid, Typography, IconButton } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { Close } from '@material-ui/icons';

const styles = (theme: any) => createStyles({
    content: {
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 30px'
    },
    title: {
        fontSize: theme.typography.pxToRem(23),
        color: '#333',
    },
    closeBtn: {
        position: 'absolute',
        top: 0,
        right: 0,
        borderRadius: 0,
        '&:hover': {
            backgroundColor: 'transparent'
        }
    },
    container: {}
});

interface IProps extends WithStyles<typeof styles>, Omit<DialogProps, 'classes' | 'title'> {
    title: string | JSX.Element;
    closeIcon?: boolean | JSX.Element;
    children: any;
}

@observer
class Dialog extends Component<IProps> {
    closeClickHandler = (e: any) => this.props.onClose(e, 'backdropClick');

    getCloseIcon = () => {
        const { closeIcon, classes } = this.props;

        if (!closeIcon) return null;

        return closeIcon === true
        ? <IconButton className={classes.closeBtn} onClick={this.closeClickHandler}>
            <Close fontSize='small' />
          </IconButton>
        : closeIcon;

    }

    render() {
        const {
            classes,
            title,
            closeIcon,
            children,
            ...props
        } = this.props;

        return (
            <MuiDialog classes={{ paper: classes.container }} {...props}>
                <Grid className={classes.content} direction='column' container>
                    <Grid justify='space-between' container>
                        {
                            typeof title === 'string'
                            ? <Typography className={classes.title}>
                                { title }
                              </Typography>
                            : title
                        }
                        { this.getCloseIcon() }
                    </Grid>
                    { children }
                </Grid>
            </MuiDialog>
        );
    }
}

export default withStyles(styles)(Dialog);
