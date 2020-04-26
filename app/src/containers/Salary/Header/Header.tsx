import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Typography, Button, IconButton } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import ExcelIcon from '../../../components/ExcelIcon';
import DateSelect from '../DateSelect';
import { observable } from 'mobx';
import LoadingMask from '../../../components/LoadingMask';

const styles = (theme: any) => createStyles({
    iconButton: {
        marginLeft: 'auto'
    },
    countSalaryButton: {
        background: 'white',
        color: theme.palette.primary.green.main,
        borderColor: theme.palette.primary.green.main,
        border: '1px solid',
        padding: '8px 12px',
        height: 42
    },
    title: {
        fontFamily: 'Source Sans Pro SemiBold',
        color: '#555555'
    }
});

interface IProps extends WithStyles<typeof styles> {
    showCalculateButton: boolean;
    year: number;
    month: number;
    changeYear: (value: number) => void;
    changeMonth: (value: number) => void;
    calculateSalaries?: (year: number, month: number) => void;
}

@inject(({
    appState: {
        departmentsStore: {
            calculateSalaries
        }
    }
}) => ({
    calculateSalaries
}))
@observer
class Header extends Component<IProps> {
    @observable isSalaryCalculating: boolean = false;

    calculateClickHandler = async () => {
        const { year, month, calculateSalaries } = this.props;
        this.isSalaryCalculating = true;
        await calculateSalaries(year, month);
        this.isSalaryCalculating = false;
    }

    render() {
        const {
            classes,
            year,
            changeYear,
            month,
            changeMonth,
            showCalculateButton
        } = this.props;

        return (
            <Grid alignItems='center' container>
                <Typography variant='h5' className={classes.title}>
                    Заробітня плата
                </Typography>
                <DateSelect
                    year={year}
                    month={month}
                    changeMonth={changeMonth}
                    changeYear={changeYear} />
                {
                    showCalculateButton &&
                    <Button
                        disabled={this.isSalaryCalculating}
                        onClick={this.calculateClickHandler}
                        className={classes.countSalaryButton}>
                            {
                                this.isSalaryCalculating
                                ? <LoadingMask size={20} />
                                : 'Розрахувати зарплату'
                            }
                    </Button>
                }
                <IconButton className={classes.iconButton}>
                    <ExcelIcon />
                </IconButton>
            </Grid>
        );
    }
}

export default withStyles(styles)(Header);
