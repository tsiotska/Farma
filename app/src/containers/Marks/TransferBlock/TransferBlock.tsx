import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Typography, Button } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { computed } from 'mobx';
import { ITotalMarks } from '../../../stores/UserStore';
import { USER_ROLE } from '../../../constants/Roles';

const styles = (theme: any) => createStyles({
    root: {
        width: 280,
        backgroundColor: theme.palette.primary.green.main,
        '& > *': {
            color: 'white'
        }
    },
    submitButton: {
        backgroundColor: 'transparent',
        borderTop: '1px solid white',
        color: 'white',
        fontFamily: 'Source Sans Pro SemiBold',
        fontSize: theme.typography.pxToRem(15)
    },
    bolderText: {
        fontFamily: 'Source Sans Pro SemiBold',
        fontSize: theme.typography.pxToRem(15)
    },
    typography: {
        height: 26,
        lineHeight: '26px'
    },
    textContainer: {
        padding: '4px 8px'
    }
});

interface IProps extends WithStyles<typeof styles> {
    previewBonusTotal?: ITotalMarks;
    role?: USER_ROLE;
}

@inject(({
    appState: {
        userStore: {
            previewBonusTotal,
            role
        }
    }
}) => ({
    previewBonusTotal,
    role
}))
@observer
class TransferBlock extends Component<IProps> {
    @computed
    get totalPacksPayments(): number {
        const { previewBonusTotal } = this.props;
        return previewBonusTotal
            ? previewBonusTotal.packs.payments
            : 0;
    }

    @computed
    get totalPacksDeposit(): number {
        const { previewBonusTotal } = this.props;
        return previewBonusTotal
            ? previewBonusTotal.packs.deposit
            : 0;
    }

    @computed
    get totalMarksPayments(): number {
        const { previewBonusTotal } = this.props;
        return previewBonusTotal
            ? previewBonusTotal.marks.payments
            : 0;
    }

    @computed
    get totalMarksDeposit(): number {
        const { previewBonusTotal } = this.props;
        return previewBonusTotal
            ? previewBonusTotal.marks.deposit
            : 0;
    }

    render() {
        const { classes, role } = this.props;

        return (
            <Grid className={classes.root} direction='column' container>
                <Grid className={classes.textContainer} wrap='nowrap' container>
                    <Grid xs={5} direction='column' container item>
                        <Typography className={classes.typography} variant='subtitle1'>
                            Всього для виплат
                        </Typography>
                        <Typography className={classes.typography} variant='subtitle1'>
                            Всього на депозит
                        </Typography>
                    </Grid>
                    <Grid xs direction='column' container item>
                        <Typography  align='right' className={classes.typography} variant='subtitle1'>
                            <span className={classes.bolderText}>{this.totalPacksPayments}</span> уп.
                        </Typography>
                        <Typography  align='right' className={classes.typography} variant='subtitle1'>
                            <span className={classes.bolderText}>{this.totalPacksDeposit}</span> уп.
                        </Typography>
                    </Grid>
                    <Grid xs direction='column' container item>
                        <Typography align='right' className={classes.typography} variant='subtitle1'>
                            <span className={classes.bolderText}>{this.totalMarksPayments}</span> бал.
                        </Typography>
                        <Typography align='right' className={classes.typography} variant='subtitle1'>
                            <span className={classes.bolderText}>{this.totalMarksDeposit}</span> бал.
                        </Typography>
                    </Grid>
                </Grid>
                {
                    role === USER_ROLE.MEDICAL_AGENT &&
                    <Button className={classes.submitButton}>
                        Перевести
                    </Button>
                }
            </Grid>
        );
    }
}

export default withStyles(styles)(TransferBlock);
