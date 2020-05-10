import React, { Component } from 'react';
import { createStyles, WithStyles, Typography, Grid, FormControlLabel, Checkbox, Button } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { observable, computed } from 'mobx';
import { uaMonthsNames } from '../../Sales/DateTimeUtils/DateTimeUtils';
import cx from 'classnames';
import { DataMode } from './ExcelLoadPopper';

const styles = (theme: any) => createStyles({
    row: {
        margin: '10px 0'
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
    },
    dateButton: {
        border: '1px solid #aaa',
        borderRadius: 2,
    }
});

interface IProps extends WithStyles<typeof styles> {
    onDateClick: () => void;
    closeHandler: () => void;
    from: Date;
    to: Date;
    loadBonusesExcel?: (mode: 'payment' | 'deposit', dateFrom: Date, dateTo: Date) => void;
    mode: DataMode;
    modeChangeHandler: (newMode: DataMode) => void;
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

    submitHandler = () => {
        const { loadBonusesExcel, from, to, mode } = this.props;

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

        loadBonusesExcel(mode, dateFrom, dateTo);
    }

    render() {
        const {
            classes,
            closeHandler,
            onDateClick,
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
                    <FormControlLabel
                        control={
                            <Checkbox checked={mode === 'payment'}
                                onChange={this.paymentsChangeHandler}
                                size='small'
                                color='default'
                            />
                        }
                        className={classes.label}
                        label={<Typography variant='subtitle1'>Бали</Typography>}
                    />
                    <FormControlLabel
                        className={classes.label}
                        control={
                            <Checkbox
                                checked={mode === 'deposit'}
                                onChange={this.depositChangeHandler}
                                size='small'
                                color='default'
                            />
                        }
                        label={<Typography variant='subtitle1'>Депозити</Typography>}
                    />
                </Grid>
                <Button onClick={onDateClick} className={cx(classes.row, classes.dateButton)}>
                    { this.dateString }
                </Button>
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
            </>
        );
    }
}

export default withStyles(styles)(DefaultContent);
