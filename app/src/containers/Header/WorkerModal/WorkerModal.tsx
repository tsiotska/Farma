import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    Grid,
    MenuItem,
    Typography
} from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import Dialog from '../../../components/Dialog';
import AvatarDropzone from '../../../components/AvatarDropzone';
import FormRow from '../../../components/FormRow';
import { IPosition } from '../../../interfaces/IPosition';
import { USER_ROLE } from '../../../constants/Roles';
import { observable, computed } from 'mobx';

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
    }
});

interface IProps extends WithStyles<typeof styles> {
    open: boolean;
    onSubmit: () => void;
    onClose: () => void;
    isLoading: boolean;
    title: string;
    positions: IPosition[];
    showLocationsBlock?: boolean;
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
    readonly optionalValues: Array<keyof IWorkerModalValues> = [];
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

    @computed
    get valuesChanged(): boolean {
        return true;
    }

    @computed
    get allowSubmit(): boolean {
        return true;
    }

    valueValidator = (propName: keyof  IWorkerModalValues, value: string): string | boolean => {
        return false;
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

    appendFileHandler = (image: File) => {
        this.image = image;
    }

    removeFileHandler = () => {
        this.image = null;
    }

    render() {
        const {
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
                            file={this.image}
                            appendFile={this.appendFileHandler}
                            removeIcon={this.removeFileHandler}
                            error={false}
                        />
                        <Grid container>
                            <Grid justify='space-between'  container>
                                <FormRow
                                    label='Назва'
                                    values={this.formValues}
                                    onChange={this.changeHandler}
                                    propName='name'
                                    error={false}
                                />
                                <FormRow
                                    label='Робочий телефон'
                                    values={this.formValues}
                                    onChange={this.changeHandler}
                                    propName='workPhone'
                                    error={false}
                                />
                                <FormRow
                                    label='Домашній телефон'
                                    values={this.formValues}
                                    onChange={this.changeHandler}
                                    propName='homePhone'
                                    error={false}
                                />
                                <FormRow
                                    label='Карточка ПБ'
                                    values={this.formValues}
                                    onChange={this.changeHandler}
                                    propName='card'
                                    error={false}
                                />
                                <FormRow
                                    select
                                    label='Посада'
                                    values={this.formValues}
                                    onChange={this.changeHandler}
                                    propName='position'
                                    error={false}>
                                        <MenuItem value={USER_ROLE.UNKNOWN} className={classes.menuItem} />
                                        {
                                            positions.map(({ id, alias }) => (
                                                <MenuItem
                                                    key={id}
                                                    value={id}
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
                                        select
                                        label='Регіон'
                                        values={this.formValues}
                                        onChange={this.changeHandler}
                                        propName='region'>
                                            <MenuItem value='' />
                                    </FormRow>
                                    <FormRow
                                        select
                                        label='Місто'
                                        values={this.formValues}
                                        onChange={this.changeHandler}
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
                                    label='email'
                                    values={this.formValues}
                                    onChange={this.changeHandler}
                                    propName='email'
                                    error={false}
                                />
                                <FormRow
                                    label='Пароль'
                                    values={this.formValues}
                                    onChange={this.changeHandler}
                                    propName='password'
                                    error={false}
                                    password
                                />
                            </Grid>
                        </Grid>
                    </Grid>
            </Dialog>
        );
    }
}

export default withStyles(styles)(WorkerModal);
