import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    Grid,
    Typography,
    Button,
    IconButton
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { observable } from 'mobx';

import ExcelIcon from '../../../components/ExcelIcon';
import LoadingMask from '../../../components/LoadingMask';
import DateSelectPopper from '../DateSelectPopper';
import {IUserSalary} from '../../../interfaces/IUserSalary';

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
        color: '#555555'
    },
    lastDateContainer: {
        marginLeft: 20
    }
});

interface IProps extends WithStyles<typeof styles> {
    showCalculateButton: boolean;
    year: number;
    month: number;
    changeYear: (value: number) => void;
    changeMonth: (value: number) => void;
    calculateSalaries?: (year: number, month: number) => void;
    loadSalariesExcel?: (year: number, month: number) => void;
    lastSalary?: Date;
}

@inject(({
    appState: {
        departmentsStore: {
            calculateSalaries,
            loadSalariesExcel
        }
    }
}) => ({
    calculateSalaries,
    loadSalariesExcel
}))
@observer
class Header extends Component<IProps> {
    @observable isSalaryCalculating: boolean = false;

    excelClickHandler = () => {
        const { loadSalariesExcel, year, month } = this.props;
        loadSalariesExcel(year, month);
    }

    calculateClickHandler = async () => {
        const { year, month, calculateSalaries } = this.props;
        this.isSalaryCalculating = true;
        await calculateSalaries(year, month + 1);
        this.isSalaryCalculating = false;
    }

    render() {
        const {
            classes,
            year,
            changeYear,
            month,
            changeMonth,
            showCalculateButton,
            lastSalary
        } = this.props;

        return (
            <Grid alignItems='center' container>
                <Typography variant='h5' className={classes.title}>
                    Заробітня плата
                </Typography>
                <DateSelectPopper
                    year={year}
                    month={month}
                    changeMonth={changeMonth}
                    changeYear={changeYear}
                />
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
                {
                    lastSalary &&
                    <Grid className={classes.lastDateContainer}
                          direction='column'>
                        <Typography color='textSecondary'>
                            Розраховано
                        </Typography>
                        <Typography>
                            {lastSalary}
                        </Typography>
                    </Grid>
                }
                <IconButton onClick={this.excelClickHandler} className={classes.iconButton}>
                    <ExcelIcon />
                </IconButton>
            </Grid>
        );
    }
}

export default withStyles(styles)(Header);
