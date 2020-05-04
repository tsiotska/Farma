import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    Grid,
    MenuItem,
    Typography,
    Button
} from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import Dialog from '../../../components/Dialog';
import AvatarDropzone from '../../../components/AvatarDropzone';
import FormRow from '../../../components/FormRow';
import { IPosition } from '../../../interfaces/IPosition';
import { USER_ROLE } from '../../../constants/Roles';
import { observable, computed, toJS } from 'mobx';
import { phoneValidator, Validator, emailValidator, stringValidator, lengthValidator } from '../../../helpers/validators';
import { IUser } from '../../../interfaces';
import LoadingMask from '../../../components/LoadingMask';

const styles = (theme: any) => createStyles({
    modalContent: {
        flexDirection: 'column'
    },
    dropzone: {
        alignItems: 'center',
        minWidth: 130,
        marginRight: 12
    },
    dropzoneButton: {
        width: '100%'
    },
    menuItem: {
        height: 36
    },
    subheader: {
        width: '100%',
        marginBottom: 12
    },
    submitButton: {
        marginLeft: 'auto',
        minWidth: 160
    }
});

interface IProps extends WithStyles<typeof styles> {
    open: boolean;
    onSubmit: (data: IWorkerModalValues, image: File) => void;
    onClose: () => void;
    isLoading: boolean;
    title: string;
    positions: IPosition[];
    showLocationsBlock?: boolean;
    initialUser?: IUser;
}

export interface IWorkerModalValues {
    name: string;
    workPhone: string;
    homePhone: string;
    card: string;
    position: USER_ROLE;
    email: string;
    password: string;
    city: string;
    region: string;
}

@observer
class WorkerModal extends Component<IProps> {
    readonly optionalValues: Array<keyof IWorkerModalValues> = ['homePhone', 'workPhone'];
    readonly regionRelatedFields: Array<keyof IWorkerModalValues> = ['city', 'region'];
    readonly validators: Partial<Record<keyof IWorkerModalValues, Validator>>;
    readonly errorMessages: { [key: string]: string } = {
        homePhone: 'Телефон має склададатись з 10 або 12 цифр',
        workPhone: 'Телефон має склададатись з 10 або 12 цифр',
        name: 'Значення має містити не менше 3 символів',
        password: 'Значення має містити не менше 3 символів',
    };
    readonly initialValues: IWorkerModalValues = {
        name: '',
        workPhone: '',
        homePhone: '',
        card: '',
        position: USER_ROLE.UNKNOWN,
        email: '',
        password: '',
        city: '',
        region: '',
    };

    @observable formValues: IWorkerModalValues = {...this.initialValues};
    @observable errors: Map<keyof IWorkerModalValues, boolean | string> = new Map();
    @observable image: File = null;

    constructor(props: IProps) {
        super(props);
        this.validators = {
            homePhone: phoneValidator,
            workPhone: phoneValidator,
            email: emailValidator,
            position: stringValidator,
            name: this.minLengthValidator(3),
            password: this.minLengthValidator(3),
            card: this.minLengthValidator(16),
            city: stringValidator,
            region: stringValidator
        };
    }

    @computed
    get valuesChanged(): boolean {
        return true;
    }

    @computed
    get allowSubmit(): boolean {
        const { showLocationsBlock } = this.props;
        return [...Object.keys(this.initialValues)].reduce(
            (allow: boolean, propName: keyof IWorkerModalValues) => {
                if (!showLocationsBlock && this.regionRelatedFields.includes(propName)) {
                    return allow && true;
                }

                const isOptional = this.optionalValues.includes(propName);
                const isValid = this.errors.get(propName) === false;
                const valueExist = !!this.formValues[propName];
                const flag = valueExist
                    ? isValid
                    : isOptional;

                return allow && flag;
        }, true);
    }

    minLengthValidator = (minLength: number) => (value: string) => lengthValidator(minLength, value);

    valueValidator = (propName: keyof IWorkerModalValues, value: string): string | boolean => {
        const validator = this.validators[propName] || stringValidator;
        const errorMessage = this.errorMessages[propName];

        const isValid = this.optionalValues.includes(propName)
            ? !value || validator(value)
            : !!value && validator(value);

        return isValid
            ? false
            : (errorMessage || true);
    }

    changeHandler = (propName: keyof IWorkerModalValues, value: string) => {
        if (propName === 'position') {
            const converted = +value;
            this.formValues[propName] = converted;
        } else {
            this.formValues[propName] = value;
        }
        const hasError = this.valueValidator(propName, value);
        this.errors.set(propName, hasError);
    }

    submitHandler = () => {
        const { onSubmit, isLoading } = this.props;
        if (isLoading) return;
        onSubmit(this.formValues, this.image);
    }

    appendFileHandler = (image: File) => {
        this.image = image;
    }

    removeFileHandler = () => {
        this.image = null;
    }

    render() {
        const {
            initialUser,
            isLoading,
            open,
            onClose,
            title,
            classes,
            positions,
            showLocationsBlock
        } = this.props;

        return (
            <Dialog
                classes={{ content: classes.modalContent }}
                open={open}
                onClose={onClose}
                title={title}
                maxWidth='md'>
                    <Grid wrap='nowrap' container>
                        <AvatarDropzone
                            classes={{
                                container: classes.dropzone,
                                removePhotoButton: classes.dropzoneButton,
                                addPhotoButton: classes.dropzoneButton,
                            }}
                            appendFile={this.appendFileHandler}
                            removeIcon={this.removeFileHandler}
                            file={this.image}
                        />
                        <Grid container>
                            <Grid justify='space-between'  container>
                                <FormRow
                                    required
                                    label='Назва'
                                    propName='name'
                                    values={this.formValues}
                                    onChange={this.changeHandler}
                                    error={this.errors.get('name')}
                                />
                                <FormRow
                                    label='Робочий телефон'
                                    values={this.formValues}
                                    onChange={this.changeHandler}
                                    propName='workPhone'
                                    error={this.errors.get('workPhone')}
                                />
                                <FormRow
                                    required
                                    label='Банківська картка'
                                    values={this.formValues}
                                    onChange={this.changeHandler}
                                    propName='card'
                                    error={this.errors.get('card')}
                                />
                                <FormRow
                                    label='Домашній телефон'
                                    values={this.formValues}
                                    onChange={this.changeHandler}
                                    propName='homePhone'
                                    error={this.errors.get('homePhone')}
                                />
                                <FormRow
                                    required
                                    select
                                    label='Посада'
                                    values={this.formValues}
                                    onChange={this.changeHandler}
                                    error={this.errors.get('position')}
                                    propName='position'>
                                        <MenuItem value={USER_ROLE.UNKNOWN} className={classes.menuItem} />
                                        {
                                            positions.map(({ id, alias }) => (
                                                <MenuItem
                                                    key={id}
                                                    value={`${id}`}
                                                    className={classes.menuItem}>
                                                    { alias }
                                                </MenuItem>
                                            ))
                                        }
                                </FormRow>
                            </Grid>
                            {
                                showLocationsBlock &&
                                <Grid justify='space-between' container>
                                    <Typography className={classes.subheader}>
                                        Територія
                                    </Typography>
                                    <FormRow
                                        required
                                        select
                                        label='Регіон'
                                        values={this.formValues}
                                        onChange={this.changeHandler}
                                        error={this.errors.get('region')}
                                        propName='region'>
                                            <MenuItem value='' />
                                    </FormRow>
                                    <FormRow
                                        required
                                        select
                                        label='Місто'
                                        values={this.formValues}
                                        onChange={this.changeHandler}
                                        error={this.errors.get('city')}
                                        propName='city'>
                                            <MenuItem value='' />
                                    </FormRow>
                                </Grid>
                            }
                            <Grid justify='space-between' container>
                                <Typography className={classes.subheader}>
                                    Авторизація
                                </Typography>
                                <FormRow
                                    required
                                    label='email'
                                    values={this.formValues}
                                    onChange={this.changeHandler}
                                    propName='email'
                                    error={this.errors.get('email')}
                                />
                                <FormRow
                                    required
                                    label='Пароль'
                                    values={this.formValues}
                                    onChange={this.changeHandler}
                                    propName='password'
                                    error={this.errors.get('password')}
                                    password
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Button
                        color='primary'
                        variant='contained'
                        className={classes.submitButton}
                        onClick={this.submitHandler}
                        disabled={this.allowSubmit === false}>
                        {
                            isLoading
                            ? <LoadingMask size={20} />
                            : initialUser
                                ? 'Зберегти зміни'
                                : 'Додати користувача'
                        }
                    </Button>
            </Dialog>
        );
    }
}

export default withStyles(styles)(WorkerModal);
