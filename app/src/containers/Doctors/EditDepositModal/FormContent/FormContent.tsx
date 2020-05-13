import {
    createStyles, withStyles, WithStyles,
    Grid, InputBase, InputLabel, Button, Typography, FormControl
} from '@material-ui/core';
import LoadingMask from '../../../../components/LoadingMask';
import { inject, observer } from 'mobx-react';
import { Component } from 'react';
import React from 'react';
import { computed, observable, toJS } from 'mobx';
import FormRow from '../../../../components/FormRow';
import { IDepositFormValue } from '../EditDepositModal';
import { IDeposit } from '../../../../interfaces/IDeposit';
import { IDoctor } from '../../../../interfaces/IDoctor';
import { numberValidator, moneyValidator } from '../../../../helpers/validators';
import { USER_ROLE } from '../../../../constants/Roles';
import { IUser } from '../../../../interfaces';

const styles = (theme: any) => createStyles({
    head: {
        [theme.breakpoints.up('sm')]: {
            marginRight: theme.spacing(2),
        },
    },
    count: {
        color: '#1ba61f',
        fontSize: 22
    },
    FIO: {
        textTransform: 'capitalize'
    },
    body: {
        flexWrap: 'nowrap',
        maxHeight: 300,
        overflowY: 'auto',
        padding: theme.spacing(2, 0),
        borderTop: '1px solid #a8a8a8',
        borderBottom: '1px solid #a8a8a8'
    },
    field: {
        marginTop: theme.spacing(2)
    },
    label: {
        marginBottom: theme.spacing(1)
    },
    minusValue: {
        color: '#a60825'
    },
    plusValue: {
        color: '#1ba61f'
    },
    footer: {
        marginTop:
            theme.spacing(2),
        [theme.breakpoints.down('sm')]:
            {
                flexDirection: 'column',
                minWidth:
                    300,
            }
    },
    submitButton: {
        // height: 40,
        // margin: '8px 0 0 auto',
        width: '100%',
        padding: '4px 16px',
    },
});

interface IProps extends WithStyles<typeof styles> {
    submitHandler: (data: any) => void;
    isLoading: boolean;
    deposits: IDeposit[];
    doctor: IDoctor;
    user?: IUser;
}

@inject(({
    appState: {
        userStore: {
            user
        }
    }
}) => ({
    user
}))
@observer
class FormContent extends Component<IProps> {
    readonly allowedRoles: USER_ROLE[] = [USER_ROLE.ADMIN, USER_ROLE.FIELD_FORCE_MANAGER];
    readonly initialValue: IDepositFormValue = {
        deposit: '',
        message: '',
    };
    @observable formValues: IDepositFormValue = { ...this.initialValue };

    @observable fieldsErrorStatuses: Record<keyof IDepositFormValue, boolean> = {
        deposit: false,
        message: false
    };

    @computed
    get isSubmitAllowed(): boolean {
        return true;
    }

    get userRole(): USER_ROLE {
        const { user } = this.props;
        return user
            ? user.position
            : USER_ROLE.UNKNOWN;
    }

    validate = (propName: keyof IDepositFormValue, value: string) => {
        if (propName === 'deposit') {
            const isValid = !!value
                && numberValidator(value)
                && +value
                && +value >= 1;
            this.fieldsErrorStatuses[propName] = !isValid;
        } else {
            const trimmed = value.replace(/ /g, '');
            const isValid = !!trimmed && trimmed.length;
            this.fieldsErrorStatuses[propName] = !isValid;
        }
    }

    onChangeHandler = (propName: keyof IDepositFormValue, value: string) => {
        this.formValues[propName] = value;
        this.validate(propName, value);
    }

    submitHandler = () => {
        if (this.isSubmitAllowed) this.props.submitHandler(this.formValues);
    }

    render() {
        const { classes, isLoading, deposits, doctor } = this.props;
        return (
            <>
                {
                    !!doctor &&
                    <Grid direction='column' className={classes.head} container item>
                        <Grid item>
                            <Typography className={classes.count}>
                                {doctor.deposit || 0}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography className={classes.FIO}>
                                {doctor.name}
                            </Typography>
                        </Grid>
                    </Grid>
                }
                <Grid direction='column' className={classes.body} container item>
                    {
                        !!deposits && deposits.length > 0 ? deposits.map((elem: any, i: number) => (

                                <Grid key={i} direction='row' className={classes.field} container item>
                                    <Grid xs={4} item>
                                        <Typography color='textSecondary'>{elem.date}</Typography>
                                    </Grid>
                                    <Grid xs={2} item>
                                        <Typography>{elem.deposit}</Typography>
                                    </Grid>
                                    <Grid xs={6} item>
                                        <Typography>{elem.message}</Typography>
                                    </Grid>
                                </Grid>
                            ))
                            : <Grid direction='row' className={classes.field} container item>
                                <Typography>Відсутні відомості</Typography>
                            </Grid>
                    }
                </Grid>
                {
                    // this.allowedRoles.includes(this.userRole) &&
                    true &&
                    <Grid alignItems='center' spacing={2} direction='row' className={classes.footer} container>
                        <Grid xs container item>
                            <FormRow
                                label='Сумма'
                                values={this.formValues}
                                propName='deposit'
                                onChange={this.onChangeHandler}
                                error={this.fieldsErrorStatuses.deposit}
                                fullWidth
                            />
                        </Grid>

                        <Grid xs={8} container item>
                            <FormRow
                                label='Причина'
                                values={this.formValues}
                                propName='message'
                                onChange={this.onChangeHandler}
                                error={this.fieldsErrorStatuses.message}
                                fullWidth
                            />
                        </Grid>

                        <Grid alignItems='center' justify='center' xs container item>
                            <Button
                                disabled={!this.isSubmitAllowed || isLoading}
                                className={classes.submitButton}
                                variant='contained'
                                color='primary'
                                onClick={this.submitHandler}>
                                {
                                    isLoading
                                        ? <LoadingMask size={20}/>
                                        : 'Змінити'
                                }
                            </Button>
                        </Grid>
                    </Grid>
                }
            </>
        );
    }
}

export default withStyles(styles)(FormContent);
