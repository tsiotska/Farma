import React, { Component } from 'react';
import { createStyles, Grid, LinearProgress, Typography, WithStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import Header from './Header';
import { computed, observable } from 'mobx';
import ListHeader from './ListHeader';
import { IAsyncStatus } from '../../stores/AsyncStore';
import { IUserSalary } from '../../interfaces/IUserSalary';
import ListItem from './ListItem';

const styles = (theme: any) => createStyles({
    root: {
        padding: '0 20px'
    }
});

interface IProps extends WithStyles<typeof styles> {
    loadSalaries?: (year: number, month: number) => Promise<void>;
    clearSalaries?: () => void;
    getAsyncStatus?: (key: string) => IAsyncStatus;
    salaries?: IUserSalary[];
    loadLocationsAgents?: () => void;
    setExpandedSalary?: (salary: IUserSalary, year: number, month: number) => void;
    expandedSalary?: IUserSalary;
    loadSubLocationAgents?: () => void;
    clearLocationsAgents?: () => void;
    loadRmAgentsInfo?: () => void;
    loadMpAgentsInfo?: (userId: number) => void;
}

@inject(({
    appState: {
        departmentsStore: {
            loadSalaries,
            clearSalaries,
            getAsyncStatus,
            salaries,
            loadLocationsAgents,
            setExpandedSalary,
            expandedSalary,
            loadSubLocationAgents,
            clearLocationsAgents,
            loadRmAgentsInfo,
            loadMpAgentsInfo
        }
    }
}) => ({
    loadSalaries,
    clearSalaries,
    getAsyncStatus,
    salaries,
    loadLocationsAgents,
    setExpandedSalary,
    expandedSalary,
    loadSubLocationAgents,
    clearLocationsAgents,
    loadRmAgentsInfo,
    loadMpAgentsInfo
}))
@observer
class Salary extends Component<IProps> {
    readonly currentYear: number = new Date().getFullYear();
    readonly currentMonth: number = new Date().getMonth();

    @observable year: number = this.currentYear;
    @observable month: number = this.currentMonth;

    @observable rmAgentsInfo: any;
    @observable mpAgentsInfo: any;

    @computed
    get isLoading(): boolean {
        return this.props.getAsyncStatus('loadSalaries').loading;
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

   expandHandler = async (userSalary: IUserSalary, e: any, expanded: boolean) => {
        const { setExpandedSalary, loadMpAgentsInfo } = this.props;
        setExpandedSalary(
            expanded
            ? userSalary
            : null,
            this.year,
            this.month
        );
        this.mpAgentsInfo = await loadMpAgentsInfo(userSalary.id);
    }

    async componentDidMount() {
        const { loadSalaries, loadLocationsAgents, loadSubLocationAgents, loadRmAgentsInfo } = this.props;
        loadSalaries(this.year, this.month + 1);
        await loadLocationsAgents();
        loadSubLocationAgents();
        this.rmAgentsInfo = await loadRmAgentsInfo();
    }

    componentWillUnmount() {
        const { clearSalaries, clearLocationsAgents } = this.props;
        clearSalaries();
        clearLocationsAgents();
    }

    render() {
        const { salaries, expandedSalary, classes } = this.props;
        return (
            <Grid className={classes.root} container direction='column'>
                <Header
                    lastSalary={
                        (salaries && salaries.length && 'date' in salaries[0])
                            ? salaries[0].date as Date
                            : null
                    }
                    year={this.year}
                    month={this.month}
                    changeMonth={this.changeMonth}
                    changeYear={this.changeYear}
                />
                <ListHeader />
                { this.isLoading && <LinearProgress />}
                {
                    salaries
                    ? salaries.length
                        ? salaries.map(x => (
                            <ListItem
                                agentInfo={
                                    this.rmAgentsInfo
                                        ? this.rmAgentsInfo.find(({ id }: { id: number }) => id === x.id)
                                        : null
                                }
                                expandedAgentsInfo={this.mpAgentsInfo && this.mpAgentsInfo}
                                key={x.id}
                                expandable={true}
                                isExpanded={x === expandedSalary}
                                position='РМ'
                                userSalary={x}
                                onExpand={this.expandHandler}
                            />
                        ))
                        : <Typography>
                            Список зарплат пустий
                          </Typography>
                    : null
                }
            </Grid>
        );
    }
}

export default withStyles(styles)(Salary);
