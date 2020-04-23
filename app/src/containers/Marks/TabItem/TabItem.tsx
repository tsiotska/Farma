import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Typography } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IBonusInfo } from '../../../interfaces/IBonusInfo';
import ExcelIcon from '../../../components/ExcelIcon';
import { Check, Close } from '@material-ui/icons';

const styles = (theme: any) => createStyles({
    root: {
        width: 192,
        height: 64,
        padding: 16,
        backgroundColor: ({ selected }: any) => selected
            ? 'white'
            : 'transparent'
    },
    icon: {
        fill: ({ selected }: any) => selected
            ? theme.palette.primary.green.main
            : '#7F888C'
    },
    leadText: {
        textTransform: 'capitalize',
        fontSize: theme.typography.pxToRem(15),
        fontFamily: 'Source Sans Pro SemiBold',
        color: ({ selected}: any) => selected
            ? theme.palette.primary.green.main
            : theme.palette.primary.gray.main
    },
    secondaryText: {
        fontSize: theme.typography.pxToRem(15),
        color: ({ selected}: any) => selected
            ? theme.palette.primary.green.main
            : theme.palette.primary.gray.mainLight
    },
    textContainer: {
        padding: '0 8px'
    },
    checkIcon: {
        color: 'white',
        background: theme.palette.primary.green.main,
        borderRadius: '50%',
        width: 14,
        height: 14
    },
    closeIcon: {
        color: 'white',
        background: theme.palette.primary.level.red,
        borderRadius: '50%',
        width: 14,
        height: 14
    },
    temporaryContainer: {
        width: 'auto'
    }
});

interface IProps extends WithStyles<typeof styles> {
    bonus: IBonusInfo;
    selected: boolean;
}

@observer
class TabItem extends Component<IProps> {
    render() {
        const { classes } = this.props;

        return (
            <Grid alignItems='center' wrap='nowrap' className={classes.root} container>
                <ExcelIcon className={classes.icon} size={35} />
                <Grid className={classes.textContainer} direction='column' container>
                    <Typography className={classes.leadText}>
                        month name
                    </Typography>
                    <Typography className={classes.secondaryText} variant='body2'>
                        1234 / 1234
                    </Typography>
                </Grid>

                <Grid className={classes.temporaryContainer} container direction='column'>
                    <Close fontSize='small' className={classes.closeIcon}/>
                    <Check fontSize='small' className={classes.checkIcon}/>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(TabItem);
