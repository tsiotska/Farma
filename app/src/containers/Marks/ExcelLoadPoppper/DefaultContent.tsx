import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    Typography,
    Grid,
    FormControlLabel,
    Checkbox,
    Button,
    RadioGroup,
    Radio
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { observable, computed } from 'mobx';
import { uaMonthsNames } from '../../Sales/DateTimeUtils/DateTimeUtils';
import cx from 'classnames';
import { DataMode } from './ExcelLoadPopper';
import { Event } from '@material-ui/icons';

const styles = (theme: any) => createStyles({
    row: {
        margin: '10px 0'
    },
    label: {
        whiteSpace: 'nowrap',
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
    },
    dateButton: {
        display: 'flex',
        justifyContent: 'space-around',
        border: '1px solid #aaa',
        borderRadius: 4,
    },
    icon: {
        // marginRight: 8
    },
});

interface IProps extends WithStyles<typeof styles> {
    onDateClick: () => void;
    from: Date;
    to: Date;
    loadBonusesExcel?: (mode: 'payment' | 'deposit', dateFrom: Date, dateTo: Date, loadPack: boolean) => void;
    mode: DataMode;
    modeChangeHandler: (newMode: DataMode) => void;
    loadPackHandler: () => void;
    loadPack: boolean;
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
class DefaultContent extends Component<IProps> {
    @computed
    get dateString() {
        const { from, to } = this.props;

        const yearFrom = from.getFullYear();
        const yearTo = to.getFullYear();

        const monthFrom = uaMonthsNames[from.getMonth()] || '...';
        const monthTo = uaMonthsNames[to.getMonth()] || '...';

        return yearFrom === yearTo
            ? `${monthFrom} - ${monthTo} ${yearTo}`
            : `${monthFrom} ${yearFrom} - ${monthTo} ${yearTo}`;
    }

    depositChangeHandler = () => {
        this.props.modeChangeHandler('deposit');
    }

    paymentsChangeHandler = () => {
        this.props.modeChangeHandler('payment');
    }

    loadPack = () => {
        this.props.loadPackHandler();
    }

    submitHandler = () => {
        const { loadBonusesExcel, from, to, mode, loadPack } = this.props;

        const dateFrom = new Date(
            from.getFullYear(),
            from.getMonth(),
            1
        );

        const dateTo = new Date(
            to.getFullYear(),
            to.getMonth() + 1,
            1
        );

        loadBonusesExcel(mode, dateFrom, dateTo, loadPack);
    }

    render() {
        const {
            classes,
            onDateClick,
            loadPack,
            mode
        } = this.props;

        return (
            <>
                <Typography>
                    Звіт
                </Typography>
                <Grid
                    className={classes.row}
                    wrap='nowrap'
                    alignContent='center'
                    justify='space-between'
                    container>

                    <RadioGroup row name='payments' defaultValue='payments'>
                        <FormControlLabel
                            value='payments'
                            label='Бали'
                            className={classes.label}
                            control={
                                <Radio
                                    onChange={this.paymentsChangeHandler}
                                    size='small'
                                    color='default'/>
                            }
                        />
                        <FormControlLabel
                            value='deposit'
                            label='Депозити'
                            className={classes.label}
                            control={
                                <Radio
                                    onChange={this.depositChangeHandler}
                                    size='small'
                                    color='default'/>
                            }
                        />
                    </RadioGroup>
                </Grid>

                <Button onClick={onDateClick} className={cx(classes.row, classes.dateButton)}>
                    <Event className={classes.icon} fontSize='small'/>
                    <span>{this.dateString}</span>
                </Button>

                <FormControlLabel
                    value='payments'
                    label='Вигрузити звіт в упаковках'
                    className={classes.label}
                    control={
                        <Checkbox
                            checked={loadPack}
                            onChange={this.loadPack}
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                            color='default'
                        />
                    }
                />
                <Grid
                    className={classes.row}
                    wrap='nowrap'
                    justify='space-between' container>
                    <Button onClick={this.submitHandler} className={classes.loadButton}>
                        Завантажити
                    </Button>
                </Grid>
            </>
        );
    }
}

export default withStyles(styles)(DefaultContent);
