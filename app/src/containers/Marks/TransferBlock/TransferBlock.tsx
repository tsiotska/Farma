import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Typography, Button } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { computed, observable } from 'mobx';
import { ITotalMarks } from '../../../stores/UserStore';
import { USER_ROLE } from '../../../constants/Roles';
import { IUser } from '../../../interfaces';
import { IBonusInfo } from '../../../interfaces/IBonusInfo';
import { ISalarySettings } from '../../../interfaces/ISalarySettings';
import cx from 'classnames';

const styles = (theme: any) => createStyles({
    root: {
        width: 280,
        backgroundColor: theme.palette.primary.green.main,
        '&.invalid': {
            backgroundColor: '#EE6969',
        },
        '& > *': {
            color: 'white'
        },
    },
    submitButton: {
        backgroundColor: 'transparent',
        borderTop: '1px solid white',
        color: 'white',
        fontFamily: 'Source Sans Pro SemiBold',
        fontSize: theme.typography.pxToRem(15),
        '&.Mui-disabled.invalid': {
            background: '#EE6969',
            color: 'white'
        }
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
    },
    wrapper: {
        width: 'auto'
    },
    gray: {
        color: '#aaa'
    },
    dark: {
        color: '#959595',
        fontFamily: 'Source Sans Pro SemiBold',
    },
    text: {
        marginBottom: 6
    }
});

interface IProps extends WithStyles<typeof styles> {
    previewBonus: IBonusInfo;
    parentUser: IUser;
    updateBonus?: (bonus: IBonusInfo, sale: boolean) => void;
    previewBonusTotal?: ITotalMarks;
    role?: USER_ROLE;
    salarySettings?: ISalarySettings;
}

@inject(({
    appState: {
        userStore: {
            updateBonus,
            previewBonusTotal,
            role,
            salarySettings
        }
    }
}) => ({
    updateBonus,
    previewBonusTotal,
    role,
    salarySettings
}))
@observer
class TransferBlock extends Component<IProps> {
    @observable isLoading: boolean = false;

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

    @computed
    get bonuses(): [number, number] {
        const { salarySettings } = this.props;
        if (!salarySettings) return null;
        const initialBonus = salarySettings.payments;
        const bonus = initialBonus * 100;
        const res = 100 - bonus;
        const isValid = bonus >= 0
            && bonus <= 100
            && res >= 0
            && res <= 100;
        return isValid
            ? [bonus, res]
            : [100, 0];
    }

    get isValid(): boolean {
        const { previewBonus } = this.props;
        const current = (this.totalMarksDeposit * 100) / (this.totalMarksPayments + this.totalMarksDeposit);
        const settingsValue = this.bonuses
            ? this.bonuses[1]
            : 100;
        return previewBonus
            ? current >= settingsValue
            : true;
    }

    submitHandler = async () => {
        const { updateBonus, previewBonus } = this.props;
        this.isLoading = true;
        await updateBonus(previewBonus, true);
        this.isLoading = false;
    }

    render() {
        const {
            classes,
            role,
            previewBonus
        } = this.props;

        const status = previewBonus ? previewBonus.status : true;

        return (
            <Grid className={classes.wrapper} direction='column' container>
                <Typography className={classes.text} variant='body2'>
                    <span className={classes.gray}>Розподіл балів - </span>
                    <span className={classes.dark}>{this.bonuses[0]} / {this.bonuses[1]}</span>
                </Typography>
                <Grid
                    className={cx(classes.root, { invalid: !this.isValid })}
                    direction='column'
                    container>
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
                        role === USER_ROLE.MEDICAL_AGENT && status === false &&
                        <Button
                            className={cx(classes.submitButton, { invalid: this.isValid === false })}
                            onClick={this.submitHandler}
                            disabled={this.isLoading || this.isValid === false}>
                                Зберегти
                        </Button>
                    }
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(TransferBlock);
