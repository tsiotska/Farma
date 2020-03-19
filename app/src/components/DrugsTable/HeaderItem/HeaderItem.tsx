import React, { Component } from 'react';
import { createStyles, WithStyles, Typography } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IMedicine } from '../../../interfaces/IMedicine';

const styles = (theme: any) => createStyles({
    headerText: {
        transformOrigin: 'left top',
        transform: 'rotate(-45deg)',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        display: 'flex',
        alignItems: 'center',
        '&::before': {
            content: '""',
            width: 10,
            height: 10,
            backgroundColor: ({ medicine: { color } }: any) => color,
            marginRight: 8,
            borderRadius: 2
        }
    }
});

interface IProps extends WithStyles<typeof styles> {
    medicine: IMedicine;
    componentRef: any;
}

@observer
class HeaderItem extends Component<IProps> {
    render() {
        const { classes, componentRef, medicine: { name } } = this.props;

        return (
            <Typography
                variant='subtitle1'
                ref={componentRef}
                className={classes.headerText}>
                { name }
            </Typography>
        );
    }
}

export default withStyles(styles)(HeaderItem);
