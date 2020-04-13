import React, { Component } from 'react';
import { createStyles, withStyles, WithStyles, Grid, Typography, Input, Button } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { ISalarySettings } from '../../../interfaces/ISalarySettings';
import { toJS, computed, observable } from 'mobx';

const styles = createStyles({
    row: {
        margin: '10px auto 10px 0',
        padding: '16px 8px',
        backgroundColor: '#f5f9fc',
        width: 'auto',
        minWidth: 353,
    },
    header: {
        marginBottom: 15,
        fontFamily: 'Source Sans Pro SemiBold'
    },
    text: {},
    input: {
        textAlign: 'center',
        width: 45,
        border: '1px solid #aaa',
        borderRadius: 2,
        margin: '0 10px'
    },
    inputRoot: {
    },
    inputError: {},
    submitButton: {
        margin: '20px auto 20px 0 '
    }
});

interface IProps extends WithStyles<typeof styles> {
    salarySettings?: ISalarySettings;
}

@inject(({
    appState: {
        userStore: {
            salarySettings
        }
    }
}) => ({
    salarySettings
}))
@observer
class CommonSettings extends Component<IProps> {
    @observable changedValues: ISalarySettings = {
        kpi: null,
        payments: null
    };

    @computed
    get initialKpi(): number {
        const { salarySettings } = this.props;
        return salarySettings
            ? salarySettings.kpi
            : 0;
    }

    @computed
    get bonuses(): [number, number] {
        const { salarySettings } = this.props;
        if (!salarySettings) return null;
        const initialBonus = this.changedValues.payments === null
        ? salarySettings.payments
        : this.changedValues.payments;
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

    inputFocusHandler = ({ target }: any) => target.select();

    kpiChangeHandler = ({ target: { value }}: any) => {
        const newValue = +value;
        const isInvalid = Number.isNaN(newValue) || newValue < 0;
        if (isInvalid) return;
        this.changedValues.kpi = newValue;
    }

    bonusChangeHandler = ({ target: { value }}: any) => {
        const newValue = +value / 100;
        const isInvalid = Number.isNaN(newValue) || newValue > 1;
        if (isInvalid) return;
        this.changedValues.payments = newValue;
    }

    bonusRestChangeHandler = ({ target: { value }}: any) => {
        const newValue = +value / 100;
        const isInvalid = Number.isNaN(newValue) || newValue > 1;
        if (isInvalid) return;
        this.changedValues.payments = 1 - newValue;
    }

    render() {
        const { classes, salarySettings } = this.props;

        return (
            <Grid direction='column' container>
                <Typography variant='h6' className={classes.header}>
                    Бонуси
                </Typography>
                <Grid className={classes.row} alignItems='center' container>
                    <Typography className={classes.text}>
                        Розподіл бонусів, %
                    </Typography>
                    <Input
                        value={
                            this.bonuses
                            ? this.bonuses[0].toFixed(0)
                            : ''
                        }
                        classes={{
                            input: classes.input,
                            root: classes.inputRoot,
                            error: classes.inputError
                        }}
                        onFocus={this.inputFocusHandler}
                        disabled={this.bonuses === null}
                        onChange={this.bonusChangeHandler}
                        disableUnderline />
                    <Typography className={classes.text}>на</Typography>
                    <Input
                        value={
                            this.bonuses
                            ? this.bonuses[1].toFixed(0)
                            : ''
                        }
                        classes={{
                            input: classes.input,
                            root: classes.inputRoot,
                            error: classes.inputError
                        }}
                        onFocus={this.inputFocusHandler}
                        disabled={this.bonuses === null}
                        onChange={this.bonusRestChangeHandler}
                        disableUnderline />
                </Grid>
                <Grid className={classes.row} alignItems='center' container>
                    <Typography className={classes.text}>
                        Ліміт товарів для нарахування бонусів
                    </Typography>
                    <Input
                        value={
                            this.changedValues.kpi === null
                            ? this.initialKpi
                            : this.changedValues.kpi
                        }
                        classes={{
                            input: classes.input,
                            root: classes.inputRoot,
                            error: classes.inputError
                        }}
                        onChange={this.kpiChangeHandler}
                        disableUnderline />
                </Grid>
                <Button className={classes.submitButton} variant='contained' color='primary'>
                    Зберегти
                </Button>
            </Grid>
        );
    }
}

export default withStyles(styles)(CommonSettings);
