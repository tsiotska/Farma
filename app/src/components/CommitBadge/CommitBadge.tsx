import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles, createStyles, WithStyles, Typography } from '@material-ui/core';
import cx from 'classnames';

const styles = (theme: any) => createStyles({
    root: {
        textTransform: 'uppercase',
        padding: 4,
        backgroundColor: '#a0aef8',
        color: '#868698',
        minWidth: 30,
        borderRadius: 12,
        lineHeight: 1,
        '&.committed': {
            color: theme.palette.primary.white,
            backgroundColor: theme.palette.primary.green.main,
        }
    }
});

interface IProps extends WithStyles<typeof styles> {
    title: string;
    committed: boolean;
    className?: string;
}

@observer
class CommitBadge extends Component<IProps> {
    render() {
        const { classes, title, committed, className } = this.props;

        return (
            <Typography
                variant='subtitle1'
                align='center'
                className={cx(classes.root, className, { committed })}>
                    {title}
            </Typography>
        );
    }
}

export default withStyles(styles)(CommitBadge);
