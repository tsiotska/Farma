import React, { Component } from 'react';
import { WithStyles, withStyles, createStyles, Grid, TextField, Typography } from '@material-ui/core';
import { observer } from 'mobx-react';
import AvatarDropzone from '../../../components/AvatarDropzone';
import { IFFMData } from '../AddDepartmentModal/AddDepartmentModal';

const styles = createStyles({
    root: {
        '& > *:not(:last-child)': {
            marginRight: 12
        }
    },
    input: {
        border: '1px solid #aaa',
        borderRadius: 2,
    },
    subheader: {
        marginBottom: 22
    },
    paddedInput: {
        marginTop: 46
    }
});

interface IProps extends WithStyles<typeof styles> {
    changeHandler: (propName: keyof Omit<IFFMData, 'image'>, value: string) => void;
    appendFile: (file: File) => void;
    removeIcon: () => void;
    values: IFFMData;
    invalidFields?: Set<keyof IFFMData>;
}

@observer
class FFMBlock extends Component<IProps> {
    imageAddHandler = (file: File) => this.props.appendFile(file);

    imageRemoveHandler = () => this.props.removeIcon();

    changeHandler = (propName: keyof Omit<IFFMData, 'image'>) => ({ target: { value }}: any) => this.props.changeHandler(propName, value);

    render() {
        const {
            classes,
            invalidFields,
            values: {
                image,
                name,
                workPhone,
                mobilePhone,
                card,
                email,
                password
            }
        } = this.props;

        return (
            <Grid wrap='nowrap' className={classes.root} container>
                <AvatarDropzone
                    file={image}
                    appendFile={this.imageAddHandler}
                    removeIcon={this.imageRemoveHandler}
                    error={invalidFields.has('image')}
                />
                <Grid direction='column' xs container item>
                    <TextField
                        value={name}
                        onChange={this.changeHandler('name')}
                        label='ПІБ'
                        error={invalidFields.has('name')}
                        InputProps={{
                            className: classes.input,
                            disableUnderline: true
                        }}
                        InputLabelProps={{
                            shrink: true
                        }}
                        required
                    />
                    <TextField
                        value={card}
                        onChange={this.changeHandler('card')}
                        label='№ Карти'
                        error={invalidFields.has('card')}
                        InputProps={{
                            className: classes.input,
                            disableUnderline: true
                        }}
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                    <Typography className={classes.subheader}>
                        Авторизація
                    </Typography>
                    <TextField
                        value={email}
                        onChange={this.changeHandler('email')}
                        label='Email'
                        error={invalidFields.has('email')}
                        InputProps={{
                            className: classes.input,
                            disableUnderline: true
                        }}
                        InputLabelProps={{
                            shrink: true
                        }}
                        required
                    />
                </Grid>
                <Grid direction='column' xs container item>
                    <TextField
                        value={workPhone}
                        onChange={this.changeHandler('workPhone')}
                        label='Робочий телефон'
                        error={invalidFields.has('workPhone')}
                        InputProps={{
                            className: classes.input,
                            disableUnderline: true
                        }}
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                    <TextField
                        value={mobilePhone}
                        onChange={this.changeHandler('mobilePhone')}
                        label='Мобільний телефон'
                        error={invalidFields.has('mobilePhone')}
                        InputProps={{
                            className: classes.input,
                            disableUnderline: true
                        }}
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                    <TextField
                        value={password}
                        onChange={this.changeHandler('password')}
                        label='Пароль'
                        className={classes.paddedInput}
                        error={invalidFields.has('password')}
                        InputProps={{
                            className: classes.input,
                            disableUnderline: true
                        }}
                        InputLabelProps={{
                            shrink: true
                        }}
                        required
                    />
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(FFMBlock);
