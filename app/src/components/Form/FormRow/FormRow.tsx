import React, {Component} from 'react';

import {
    createStyles,
    Grid,
    Typography,
    withStyles,
    WithStyles
} from '@material-ui/core';
import {observer} from 'mobx-react';

const styles = (theme: any) => createStyles({
    root: {
        marginBottom: `${theme.typography.pxToRem(20)}`
    },
    title: {
        whiteSpace: 'nowrap',
        marginRight: `${theme.typography.pxToRem(15)}`,
        marginLeft: 'auto'
    },
});

interface IProps extends WithStyles<typeof styles> {
    title: string;
    wrap?: boolean;
}

@observer
class FormRow extends Component<IProps> {
    render() {
        const {
            title,
            children,
            wrap,
            classes
        } = this.props;

        return <Grid
            container
            wrap={
                wrap
                    ? 'wrap'
                    : 'nowrap'
            }
            alignItems='center'
            justify='space-between'
            className={classes.root}>
            <Typography
                className={classes.title}
                align='right'
                variant='body2'>
                {title}
            </Typography>
            {children}
        </Grid>;
    }
}

export default withStyles(styles)(FormRow);
