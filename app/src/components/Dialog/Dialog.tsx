import React, { Component } from 'react';
import { createStyles, WithStyles, DialogProps, Dialog as MuiDialog, Grid, Typography } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';

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
    container: {}
});

interface IProps extends WithStyles<typeof styles>, Omit<DialogProps, 'classes' | 'title'> {
    title?: string | JSX.Element;
    children: any;
}

@observer
class Dialog extends Component<IProps> {

    render() {
        const {
            classes,
            title,
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
                    </Grid>
                    { children }
                </Grid>
            </MuiDialog>
        );
    }
}

export default withStyles(styles)(Dialog);
