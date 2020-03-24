import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    Grid,
    Typography,
    FormHelperText,
    FormControl,
    InputLabel,
    Input,
    Button,
    Snackbar,
    IconButton
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { observable } from 'mobx';
import { IUserCredentials, IUser } from '../../interfaces/IUser';
import { Validator, emailValidator, lengthValidator } from '../../helpers/validators';
import { IAsyncStatus } from '../../stores/AsyncStore';
import { Redirect } from 'react-router-dom';
import { ROOT_ROUTE } from '../../constants/Router';
import { Visibility } from '@material-ui/icons';

const styles = (theme: any) => createStyles({
    root: {
        backgroundColor: 'white',
        position: 'absolute',
        left: '50%',
        top: '30%',
        transform: 'translate(-50%,-30%)',
        width: 350,
        padding: '30px 28px'
    },
    header: {
        marginBottom: theme.spacing(4)
    },
    submitButton: {
        marginLeft: 'auto',

    },
    formControl: {
        marginBottom: theme.spacing(2)
    },
    snackbar: {
        position: 'absolute'
    },
    iconButton: {
        padding: 6,
        borderRadius: 4,
        color: theme.palette.primary.gray.light
    }
});

interface IProps extends WithStyles<typeof styles> {
    login?: (credentials: IUserCredentials) => boolean;
    user?: IUser;
    isUserLoading?: boolean;
}

@inject(({
    appState: {
        userStore: {
            isUserLoading,
            login,
            user
        }
    }
}) => ({
    login,
    user,
    isUserLoading
}))
@observer
class Login extends Component<IProps> {
    lengthValidator: Validator;
    @observable showPassword: boolean = false;
    @observable openSnackbar: boolean = false;
    @observable credentials: IUserCredentials = {
        email: '',
        password: ''
    };

    @observable showErrors: Record<keyof IUserCredentials, boolean> = {
        email: false,
        password: false,
    };

    // true => isValid, false => hasError
    @observable validityStatuses: Record<keyof IUserCredentials, boolean> = {
        email: true,
        password: true,
    };

    constructor(props: IProps) {
        super(props);
        this.lengthValidator = lengthValidator.bind(this, 6);
    }

    changeHandler = ({ target: { type, value } }: any) => {
        this.openSnackbar = false;
        const propName = type === 'text'
        ? 'email'
        : 'password';
        this.credentials[propName] = value;
        this.showErrors[propName] = false;
    }

    submitHandler = async () => {
        const preparedCreds: IUserCredentials = {
            email: this.credentials.email.trim(),
            password: this.credentials.password.trim()
        };

        this.showErrors.email = true;
        this.showErrors.password = true;

        this.validityStatuses.email = emailValidator(preparedCreds.email);
        this.validityStatuses.password = this.lengthValidator(preparedCreds.password);

        const isValid = this.validityStatuses.email && this.validityStatuses.password;

        if (!isValid) return;

        const loggedIn = await this.props.login(preparedCreds);
        this.openSnackbar = !loggedIn;
    }

    snackbarCloseHandler = () => {
        this.openSnackbar = false;
    }

    enterPressHandler = (ev: KeyboardEvent) => {
        if (ev.keyCode === 13) this.submitHandler();
    }

    componentDidMount() {
        window.addEventListener('keypress', this.enterPressHandler);
    }

    componentWillUnmount() {
        window.removeEventListener('keypress', this.enterPressHandler);
    }

    visibilityFocusHandler = () => {
        this.showPassword = true;
    }

    visibilityBlurHandler = () => {
        this.showPassword = false;
    }

    render() {
        const {
            classes,
            user,
            isUserLoading
        } = this.props;

        if (user) return <Redirect to={ROOT_ROUTE} />;

        return (
            <>
            <Grid className={classes.root} direction='column' container>
                <Typography variant='h5' className={classes.header}>
                    Вход
                </Typography>

                <FormControl className={classes.formControl}  error={this.showErrors.email && !this.validityStatuses.email}>
                    <InputLabel disableAnimation shrink>
                        Email
                    </InputLabel>
                    <Input
                        value={this.credentials.email}
                        onChange={this.changeHandler}
                        disableUnderline />
                    <FormHelperText></FormHelperText>
                </FormControl>

                <FormControl className={classes.formControl} error={this.showErrors.password && !this.validityStatuses.password}>
                    <InputLabel disableAnimation shrink>
                        Пароль
                    </InputLabel>
                    <Input
                        value={this.credentials.password}
                        onChange={this.changeHandler}
                        disableUnderline
                        type={this.showPassword ? 'text' : 'password'}
                        endAdornment={
                            <IconButton
                                onMouseDown={this.visibilityFocusHandler}
                                onMouseUp={this.visibilityBlurHandler}
                                className={classes.iconButton}>
                                <Visibility fontSize='small' />
                            </IconButton>
                        }/>
                    <FormHelperText></FormHelperText>
                </FormControl>

                <Button
                    disabled={isUserLoading}
                    onClick={this.submitHandler}
                    variant='contained'
                    color='primary'
                    className={classes.submitButton}>
                    Войти
                </Button>

            </Grid>
            <Snackbar
                className={classes.snackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                autoHideDuration={6000}
                open={this.openSnackbar}
                onClose={this.snackbarCloseHandler}>
                <Alert onClose={this.snackbarCloseHandler} severity='error'>
                    Неверный логин или пароль
                </Alert>
            </Snackbar>
            </>
        );
    }
}

export default withStyles(styles)(Login);
