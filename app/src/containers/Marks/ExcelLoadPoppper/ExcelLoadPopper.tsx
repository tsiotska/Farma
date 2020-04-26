import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    Popper,
    Grid,
    Paper,
    Button,
    FormControlLabel,
    Checkbox,
    Typography,
    Input
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { observable } from 'mobx';

const styles = (theme: any) => createStyles({
    root: {
        padding: 16,
        width: 220
    },
    row: {
        margin: '10px 0'
    },
    input: {
        border: '1px solid #aaa',
        borderRadius: 4
    },
    label: {
        marginRight: 0,
        marginLeft: 0,
        '& .MuiCheckbox-root': {
            padding: 4
        }
    },
    closeButton: {
        color: '#36A0F4',
        width: '100%'
    },
    loadButton: {
        backgroundColor: '#647CFE',
        color: 'white',
        width: '100%',
        '&:hover': {
            backgroundColor: '#7a8fff',
        }
    }
});

interface IProps extends WithStyles<typeof styles> {
    anchor: HTMLElement;
    closeHandler: () => void;
    loadBonusesExcel?: (name: string, mode: string) => void;
}

@inject(({
    appState: {
        userStore: {
            loadBonusesExcel
        }
    }
}) => ({
    loadBonusesExcel
}))
@observer
class ExcelLoadPopper extends Component<IProps> {
    @observable activeMode: 'payment' | 'deposit' = 'payment';
    @observable name: string = '';

    nameChangeHandler = ({ target: { value }}: any) => {
        this.name = value;
    }

    depositChangeHandler = () => {
        this.activeMode = 'deposit';
    }

    paymentsChangeHandler = () => {
        this.activeMode = 'payment';
    }

    submitHandler = () => {
        const { loadBonusesExcel } = this.props;
        loadBonusesExcel(name, this.activeMode);
    }

    render() {
        const { classes, anchor, closeHandler } = this.props;

        return (
            <Popper
                placement='bottom-end'
                open={!!anchor}
                anchorEl={anchor}>
                    <Grid elevation={20} className={classes.root} component={Paper} container direction='column'>
                        <Typography>
                            Звіт
                        </Typography>
                        <Grid
                            className={classes.row}
                            wrap='nowrap'
                            alignContent='center'
                            justify='space-between'
                            container>
                            <FormControlLabel
                                control={<Checkbox checked={this.activeMode === 'payment'} onChange={this.paymentsChangeHandler} size='small' color='default' />}
                                className={classes.label}
                                label={<Typography variant='subtitle1'>Виплати</Typography>}
                            />
                            <FormControlLabel
                                className={classes.label}
                                control={<Checkbox  checked={this.activeMode === 'deposit'} onChange={this.depositChangeHandler} size='small' color='default' />}
                                label={<Typography variant='subtitle1'>Депозити</Typography>}
                            />
                        </Grid>
                        <Grid
                            className={classes.row}
                            wrap='nowrap' alignItems='center' container>
                            <Input placeholder='Назва' value={this.name} onChange={this.nameChangeHandler} disableUnderline className={classes.input} />
                            <Typography variant='subtitle1'>
                                .xlsx
                            </Typography>
                        </Grid>
                        <Grid
                            className={classes.row}
                            wrap='nowrap'
                            justify='space-between' container>
                            <Button className={classes.closeButton} onClick={closeHandler}>
                                Закрити
                            </Button>
                            <Button onClick={this.submitHandler} className={classes.loadButton}>
                                Завантажити
                            </Button>
                        </Grid>
                    </Grid>
            </Popper>
        );
    }
}

export default withStyles(styles)(ExcelLoadPopper);
