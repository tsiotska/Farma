import React, { Component } from 'react';
import { WithStyles, withStyles, createStyles, Grid, TextField, Typography } from '@material-ui/core';
import { observer } from 'mobx-react';
import FFMDropzone from '../FFMDropzone';
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
}

@observer
class FFMBlock extends Component<IProps> {
    imageAddHandler = (file: File) => this.props.appendFile(file);

    imageRemoveHandler = () => this.props.removeIcon();

    changeHandler = (propName: keyof Omit<IFFMData, 'image'>) => ({ target: { value }}: any) => this.props.changeHandler(propName, value);

    render() {
        const {
            classes,
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
                <FFMDropzone
                    file={image}
                    appendFile={this.imageAddHandler}
                    removeIcon={this.imageRemoveHandler}
                />
                <Grid direction='column' xs container item>
                    <TextField
                        value={name}
                        onChange={this.changeHandler('name')}
                        label='ПІБ'
                        InputProps={{
                            className: classes.input,
                            disableUnderline: true
                        }}
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                    <TextField
                        value={card}
                        onChange={this.changeHandler('card')}
                        label='№ Карти'
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
                        InputProps={{
                            className: classes.input,
                            disableUnderline: true
                        }}
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                </Grid>
                <Grid direction='column' xs container item>
                    <TextField
                        value={workPhone}
                        onChange={this.changeHandler('workPhone')}
                        label='Робочий телефон'
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
                        InputProps={{
                            className: classes.input,
                            disableUnderline: true
                        }}
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(FFMBlock);
