import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, LinearProgress, Typography } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import Header from './Header';
import { observable, computed, toJS } from 'mobx';
import ListHeader from './ListHeader';
import { IAsyncStatus } from '../../stores/AsyncStore';
import { IUserSalary } from '../../interfaces/IUserSalary';
import ListItem from './ListItem';
import { IUser } from '../../interfaces';

const styles = (theme: any) => createStyles({});

interface IProps extends WithStyles<typeof styles> {
    loadSalaries?: (year: number, month: number) => Promise<void>;
    clearSalaries?: () => void;
    getAsyncStatus?: (key: string) => IAsyncStatus;
    salaries?: IUserSalary[];
    loadLocationsAgents?: () => void;
    setExpandedSalary?: (salary: IUserSalary, year: number, month: number) => void;
    expandedSalary?: IUserSalary;
    loadSubLocationAgents?: () => void;
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
        console.log(this.mpAgentsInfo);
    }

    async componentDidMount() {
        const { loadSalaries, loadLocationsAgents, loadSubLocationAgents, loadRmAgentsInfo } = this.props;
        loadSalaries(this.year, this.month + 1);
        await loadLocationsAgents();
        loadSubLocationAgents();
        this.rmAgentsInfo = await loadRmAgentsInfo();
        // console.log(toJS(this.rmAgentsInfo));
        // console.log(toJS(this.props.salaries));
    }

    componentWillUnmount() {
        const { clearSalaries } = this.props;
        clearSalaries();
    }

    render() {
        const { salaries, expandedSalary } = this.props;
        console.log(toJS(this.rmAgentsInfo));
        console.log(toJS(salaries));
        return (
            <Grid container direction='column'>
                <Header
                    lastSalary={salaries && salaries.length > 0 && salaries[0].date}
                    year={this.year}
                    month={this.month}
                    changeMonth={this.changeMonth}
                    changeYear={this.changeYear}
                    showCalculateButton={this.showCalculateButton}
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
