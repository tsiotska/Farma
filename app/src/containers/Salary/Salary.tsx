import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, LinearProgress } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import Header from './Header';
import { observable, computed } from 'mobx';
import ListHeader from './ListHeader';
import { IAsyncStatus } from '../../stores/AsyncStore';
import { IUserSalary } from '../../interfaces/IUserSalary';

const styles = (theme: any) => createStyles({});

interface IProps extends WithStyles<typeof styles> {
    loadSalaries?: (year: number, month: number) => Promise<void>;
    clearSalaries?: () => void;
    getAsyncStatus?: (key: string) => IAsyncStatus;
    salaries?: IUserSalary[];
}

@inject(({
    appState: {
        departmentsStore: {
            loadSalaries,
            clearSalaries,
            getAsyncStatus,
            salaries
        }
    }
}) => ({
    loadSalaries,
    clearSalaries,
    getAsyncStatus,
    salaries
}))
@observer
class Salary extends Component<IProps> {
    readonly currentYear: number = new Date().getFullYear();
    readonly currentMonth: number = new Date().getMonth();

    @observable year: number = this.currentYear;
    @observable month: number = this.currentMonth;

    @computed
    get isLoading(): boolean {
        return this.props.getAsyncStatus('loadSalaries').loading;
    }

    @computed
    get showCalculateButton(): boolean {
        const { salaries, getAsyncStatus } = this.props;
        const { success, error } = getAsyncStatus('loadSalaries');
        const isLoaded = success || error;
        const salariesIsEmpty = !salaries || !salaries.length;
        return isLoaded && salariesIsEmpty;
    }

    changeYear = (value: number) => {
        const { loadSalaries } = this.props;
        if (value === this.currentYear && this.currentMonth < this.month) {
            this.month = 0;
        }
        this.year = value;
        loadSalaries(this.year, this.month + 1);
    }

    changeMonth = (value: number) => {
        const { loadSalaries } = this.props;
        if (this.year === this.currentYear && value > this.currentMonth) {
            this.year = this.year - 1;
        }
        this.month = value;
        loadSalaries(this.year, this.month + 1);
    }

    componentDidMount() {
        const { loadSalaries } = this.props;
        loadSalaries(this.year, this.month + 1);
    }

    componentWillUnmount() {
        const { clearSalaries } = this.props;
        clearSalaries();
    }

    render() {
        return (
            <Grid container direction='column'>
                <Header
                    year={this.year}
                    month={this.month}
                    changeMonth={this.changeMonth}
                    changeYear={this.changeYear}
                    showCalculateButton={this.showCalculateButton}
                />
                <ListHeader />
                { this.isLoading && <LinearProgress />}

            </Grid>
        );
    }
}

export default withStyles(styles)(Salary);
