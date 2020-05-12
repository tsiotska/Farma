import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Typography, Button } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IBonusInfo } from '../../../interfaces/IBonusInfo';
import ExcelIcon from '../../../components/ExcelIcon';
import { Check, Close } from '@material-ui/icons';
import cx from 'classnames';
import { uaMonthsNames } from '../../Sales/DateTimeUtils/DateTimeUtils';

const styles = (theme: any) => createStyles({
    root: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'nowrap',
        width: 192,
        height: 64,
        backgroundColor: ({ selected }: any) => selected
            ? 'white'
            : 'transparent',
        '&:hover': {
            backgroundColor: ({ selected }: any) => selected
                ? '#f9f9f9'
                : '#3333330a'
        }
    },
    icon: {
        fill: ({ selected }: any) => selected
            ? theme.palette.primary.green.main
            : '#7F888C'
    },
    text: {
        overflow: 'hidden',
        textOverflow: 'ellipsis'
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
        fontSize: theme.typography.pxToRem(14),
        color: ({ selected}: any) => selected
            ? theme.palette.primary.green.main
            : theme.palette.primary.gray.mainLight
    },
    textContainer: {
        padding: '0 8px',
        overflow: 'hidden'
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
    setPreviewBonusMonth?: (month: number) => void;
}

@inject(({
    appState: {
        userStore: {
            setPreviewBonusMonth
        }
    }
}) => ({
    setPreviewBonusMonth
}))
@observer
class TabItem extends Component<IProps> {
    clickHandler = () => {
        const { setPreviewBonusMonth, bonus: { month } } = this.props;
        setPreviewBonusMonth(month);
    }

    render() {
        const { classes, bonus: { deposit, payments, month, status } } = this.props;

        return (
            <Button onClick={this.clickHandler} className={classes.root}>
                <ExcelIcon className={classes.icon} size={35} />
                <Grid className={classes.textContainer} alignItems='flex-start' direction='column' container>
                    <Typography className={cx(classes.text, classes.leadText)}>
                        { uaMonthsNames[month] }
                    </Typography>
                    <Typography className={cx(classes.text, classes.secondaryText)} variant='body2'>
                        { payments } / { deposit }
                    </Typography>
                </Grid>

                <Grid className={classes.temporaryContainer} container direction='column'>
                    { status === true && <Check fontSize='small' className={classes.checkIcon}/> }
                    { status === false && <Close fontSize='small' className={classes.closeIcon}/> }
                </Grid>
            </Button>
        );
    }
}

export default withStyles(styles)(TabItem);
