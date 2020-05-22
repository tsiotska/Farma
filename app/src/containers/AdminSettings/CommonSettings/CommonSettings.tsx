import React, { Component } from 'react';
import { Button, createStyles, Grid, Input, Typography, withStyles, WithStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { ISalarySettings } from '../../../interfaces/ISalarySettings';
import { computed, observable } from 'mobx';
import { IAsyncStatus } from '../../../stores/AsyncStore';
import { SNACKBAR_TYPE } from '../../../constants/Snackbars';
import Snackbar from '../../../components/Snackbar';
import LoadingMask from '../../../components/LoadingMask';
import { USER_ROLE } from '../../../constants/Roles';
import RoleLevels from './RoleLevels';

const styles = createStyles({
    root: {},
    formBlock: {
        margin: '10px auto 10px 0',
        padding: '16px 8px',
        backgroundColor: '#f5f9fc',
        width: 'auto',
        minWidth: 353,
    },
    input: {
        textAlign: 'center',
        width: 45,
        border: '1px solid #aaa',
        borderRadius: 2,
        margin: '0 10px',
        background: 'white'
    },
    submitButton: {
        margin: '20px auto 20px 0 '
    },
    title_bold: {
        fontWeight: 600,
        color: '#808080'
    }
});

interface IProps extends WithStyles<typeof styles> {
    salarySettings?: ISalarySettings;
    submitCommonSettingsChanges?: (settings: ISalarySettings) => Promise<boolean>;
    getAsyncStatus?: (key: string) => IAsyncStatus;
    loadUserSalarySettings?: () => void;
}

@inject(({
             appState: {
                 userStore: {
                     salarySettings,
                     submitCommonSettingsChanges,
                     getAsyncStatus,
                     loadUserSalarySettings
                 }
             }
         }) => ({
    salarySettings,
    submitCommonSettingsChanges,
    getAsyncStatus,
    loadUserSalarySettings
}))
@observer
class CommonSettings extends Component<IProps> {
    @observable showSnackbar: boolean = false;
    @observable snackbarType: SNACKBAR_TYPE = SNACKBAR_TYPE.SUCCESS;
    @observable changedValues: ISalarySettings = {
        kpi: null,
        payments: null,
        rmLevel: null,
        mpLevel: null
    };

    @computed
    get isRequestProccessing(): boolean {
        return this.props.getAsyncStatus('submitCommonSettingsChanges').loading;
    }

    initialLevel = (levelType: string): number => {
        const { salarySettings } = this.props;
        return this.changedValues[levelType] === null
            ? salarySettings[levelType] || 1
            : this.changedValues[levelType];
    }

    levelChangeHandler = (levelType: string, event: any) => {
        this.changedValues[levelType] = Number(event.target.value.match(/\d+/));
    }

    @computed
    get initialKpi(): number {
        const { salarySettings } = this.props;
        return salarySettings
            ? salarySettings.kpi
            : 0;
    }

    kpiChangeHandler = ({ target: { value } }: any) => {
        const newValue = +value;
        const isInvalid = Number.isNaN(newValue) || newValue < 0;
        if (isInvalid) return;
        this.changedValues.kpi = newValue;
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

    bonusChangeHandler = ({ target: { value } }: any) => {
        const newValue = +value / 100;
        const isInvalid = Number.isNaN(newValue) || newValue > 1;
        if (isInvalid) return;
        this.changedValues.payments = newValue;
    }

    bonusRestChangeHandler = ({ target: { value } }: any) => {
        const newValue = +value / 100;
        const isInvalid = Number.isNaN(newValue) || newValue > 1;
        if (isInvalid) return;
        this.changedValues.payments = 1 - newValue;
    }

    inputFocusHandler = ({ target }: any) => target.select();

    submitHandler = async () => {
        if (this.isRequestProccessing) return;
        const { submitCommonSettingsChanges, loadUserSalarySettings } = this.props;
        const res = await submitCommonSettingsChanges(this.changedValues);
        this.showSnackbar = true;
        this.snackbarType = res
            ? SNACKBAR_TYPE.SUCCESS
            : SNACKBAR_TYPE.ERROR;
        if (res) {
            await loadUserSalarySettings();
        }
    }

    snackbarCloseHandler = () => {
        this.showSnackbar = false;
    }

    get disableSubmit(): boolean {
        return Object.values(this.changedValues).every((value) => !value);
    }

    render() {
        const { classes } = this.props;
        return (
            <Grid className={classes.root} direction='column' container>

                <Typography className={classes.title_bold}>
                    Бонуси
                </Typography>

                <Grid className={classes.formBlock} direction='column' container>
                    <Typography>
                        Рівень зарахування бонусів
                    </Typography>

                    <RoleLevels levelChangeHandler={this.levelChangeHandler}
                                initialLevel={'РМ' + this.initialLevel('rmLevel')}
                                role={USER_ROLE.REGIONAL_MANAGER}/>
                    <RoleLevels levelChangeHandler={this.levelChangeHandler}
                                initialLevel={'МП' + this.initialLevel('mpLevel')}
                                role={USER_ROLE.MEDICAL_AGENT}/>
                </Grid>

                <Grid className={classes.formBlock} alignItems='center' container>
                    <Typography>
                        Бонус за виконання продуктів
                    </Typography>
                    <Input
                        value={
                            this.changedValues.kpi === null
                                ? this.initialKpi
                                : this.changedValues.kpi
                        }
                        classes={{ input: classes.input }}
                        onChange={this.kpiChangeHandler}
                        disableUnderline/>
                </Grid>

                <Typography className={classes.title_bold} variant='body1'>
                    Бали
                </Typography>

                <Grid className={classes.formBlock} alignItems='center' container>
                    <Typography>
                        Розподіл балів, %
                    </Typography>

                    <Input
                        value={
                            this.bonuses
                                ? this.bonuses[0].toFixed(0)
                                : ''
                        }
                        classes={{ input: classes.input }}
                        onFocus={this.inputFocusHandler}
                        disabled={this.bonuses === null}
                        onChange={this.bonusChangeHandler}
                        disableUnderline/>
                    <Typography>на</Typography>
                    <Input
                        value={
                            this.bonuses
                                ? this.bonuses[1].toFixed(0)
                                : ''
                        }
                        classes={{ input: classes.input }}
                        onFocus={this.inputFocusHandler}
                        disabled={this.bonuses === null}
                        onChange={this.bonusRestChangeHandler}
                        disableUnderline/>
                </Grid>

                <Button
                    disabled={this.disableSubmit}
                    onClick={this.submitHandler}
                    className={classes.submitButton}
                    variant='contained'
                    color='primary'>
                    {
                        this.isRequestProccessing
                            ? <LoadingMask size={20}/>
                            : 'Зберегти'
                    }
                </Button>

                <Snackbar
                    open={this.showSnackbar}
                    onClose={this.snackbarCloseHandler}
                    type={this.snackbarType}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    autoHideDuration={6000}
                    message={
                        this.snackbarType === SNACKBAR_TYPE.SUCCESS
                            ? 'Налаштування змінено'
                            : 'Неможливо змінити налаштування'
                    }
                />
            </Grid>
        );
    }
}

export default withStyles(styles)(CommonSettings);
