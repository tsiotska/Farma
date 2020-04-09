import React, { Component } from 'react';
import { createStyles, WithStyles, withStyles, Button } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { IMedicine } from '../../../../interfaces/IMedicine';
import SalaryHeader from '../SalaryHeader';
import { ISalaryInfo, IUserSales } from '../../../../interfaces/ISalaryInfo';
import { IUser } from '../../../../interfaces';
import SalaryRow from '../SalaryRow';
import SumRow from '../SumRow';
import { computed, toJS } from 'mobx';
import { ISalarySettings } from '../../../../interfaces/ISalarySettings';
import TotalRow from '../TotalRow';
import { IAsyncStatus } from '../../../../stores/AsyncStore';
import LoadingMask from '../../../../components/LoadingMask';

const styles = (theme: any) => createStyles({
    red: {
        backgroundColor: theme.palette.primary.level.redFaded
    },
    orangered: {
        backgroundColor: theme.palette.primary.level.orangeredFaded
    },
    yellow: {
        backgroundColor: theme.palette.primary.level.yellowFaded
    },
    limeGreen: {
        backgroundColor: theme.palette.primary.level.limeGreenFaded
    },
    green: {
        backgroundColor: theme.palette.primary.level.greenFaded
    },
    submitButton: {
        marginLeft: 'auto',
        marginTop: 16,
        backgroundColor: '#3796f6',
        color: 'white'
    }
});

interface IProps extends WithStyles<typeof styles> {
    currentDepartmentMeds?: IMedicine[];
    user: IUser;
    salary: Map<number, ISalaryInfo>;
    levelsCount: number;
    userSales?: IUserSales;
    isAdmin?: boolean;
    changeUserSalary?: (level: number, propName: keyof Omit<ISalaryInfo, 'meds'>, value: number) => void;
    salarySettings?: ISalarySettings;
    onSubmit?: () => void;
    clearUserSalaryInfo?: () => void;
    getAsyncStatus?: (key: string) => IAsyncStatus;
}

@inject(({
    appState: {
        departmentsStore: {
            currentDepartmentMeds
        },
        userStore: {
            changeUserSalary,
            userSales,
            isAdmin,
            salarySettings,
            clearUserSalaryInfo,
            getAsyncStatus
        }
    }
}) => ({
    changeUserSalary,
    currentDepartmentMeds,
    userSales,
    isAdmin,
    salarySettings,
    clearUserSalaryInfo,
    getAsyncStatus
}))
@observer
class UserContent extends Component<IProps> {
    readonly colors: any;

    constructor(props: IProps) {
        super(props);
        const { classes: { red, orangered, yellow, limeGreen, green } } = props;
        this.colors = {
            3: [red, yellow, green],
            5: [red, orangered, yellow, limeGreen, green]
        };
    }

    @computed
    get isLoadingSubmit(): boolean {
        return this.props.getAsyncStatus('updateSalary').loading;
    }

    @computed
    get userLevel(): number {
        const { user } = this.props;
        return user ? user.level : 0;
    }

    @computed
    get userColors(): string[] {
        const { levelsCount } = this.props;
        return this.colors[levelsCount] || [];
    }

    @computed
    get levels(): number[] {
        const { levelsCount } = this.props;
        return [...new Array(levelsCount)].map((x, i) => i + 1);
    }

    @computed
    get plannedCosts(): number[] {
        const { salary } = this.props;
        return this.levels.map(level => {
            const infoItem = salary.get(level);
            const plannedCost = infoItem
                ? [...Object.values(infoItem.meds)].reduce((total, { amount, price }) => (total + (amount || 0) * (price || 0)), 0)
                : 0;
            return Math.floor(plannedCost * 100) / 100;
        });
    }

    @computed
    get totalUserSoldAmount(): number {
        const { userSales, currentDepartmentMeds } = this.props;
        if (!userSales) return 0;
        return currentDepartmentMeds.reduce(
            (total, { id }) => total + (id in userSales ? (userSales[id].money || 0) : 0),
            0
        );
    }

    @computed
    get userMoneyDeficit(): number {
        const { userSales } = this.props;

        if (!userSales) return 0;
        const value = Object.values(userSales).reduce((total, { money }) => total + (money || 0), 0);
        return Math.floor(value * 100) / 100;
    }

    @computed
    get extraCosts(): number[] {
        const { salary } = this.props;
        return this.levels.map(level => {
            const infoItem = salary.get(level);
            const extraCosts = infoItem
                ? infoItem.extraCosts
                : 0;
            return extraCosts;
        });
    }

    @computed
    get KPIs(): number[] {
        const { salary } = this.props;
        return this.levels.map(level => {
            const infoItem = salary.get(level);
            const res = infoItem
                ? infoItem.kpi
                : 0;
            return res;
        });
    }

    @computed
    get ratingSalary(): number[] {
        const { salary } = this.props;
        return this.levels.map(level => {
            const infoItem = salary.get(level);
            const res = infoItem
                ? infoItem.salary
                : 0;
            return res;
        });
    }

    @computed
    get bonuses(): number[] {
        const { salarySettings, salary, userSales } = this.props;
        const treshold = salarySettings
            ? salarySettings.kpi
            : null;

        if (treshold === null) return [];
        return this.levels.map(x => {
            if (x !== this.userLevel || !userSales) return 0;
            const salaryInfo = salary.get(x);
            const meds = salaryInfo
                ? salaryInfo.meds
                : {};

            const bonusValues = Object.entries(meds).map(([ medId, { amount, bonus }]) => {
                const soldAmount = userSales[medId]
                    ? (userSales[medId].amount || 0)
                    : 0;
                return (!!soldAmount && !!bonus && soldAmount >= amount)
                    ? soldAmount * bonus
                    : 0;
            });

            const filtered = bonusValues.filter(value => !!value);

            return filtered.length >= treshold
                ? filtered.reduce((total, current) => total + current, 0)
                : 0;
        });
    }

    changeHandler = (propName: keyof Omit<ISalaryInfo, 'meds'>) => (level: number, { target: { value }}: any) => {
        const { changeUserSalary } = this.props;
        const casted = +value;
        const isValid = value.length
            ? !Number.isNaN(casted)
            : true;
        if (isValid) changeUserSalary(level, propName, casted);
    }

    componentWillUnmount() {
        this.props.clearUserSalaryInfo();
    }

    render() {
        const {
            classes,
            currentDepartmentMeds,
            salary,
            userSales,
            onSubmit,
            isAdmin
        } = this.props;

        return (
            <>
                {
                    currentDepartmentMeds.map(medicine => (
                        <SalaryRow
                            key={medicine.id}
                            userSales={userSales}
                            userColors={this.userColors}
                            levels={this.levels}
                            userLevel={this.userLevel}
                            medicine={medicine}
                            salary={salary}
                            editable={isAdmin}
                        />
                    ))
                }
                <SumRow
                    title='План в грошах'
                    levels={this.levels}
                    userLevel={this.userLevel}
                    values={this.plannedCosts}
                    userColors={this.userColors}
                    secondColumnValue={this.userMoneyDeficit}
                />
                <SumRow
                    title='Зарплата по рейтингу'
                    levels={this.levels}
                    userLevel={this.userLevel}
                    values={this.ratingSalary}
                    userColors={this.userColors}
                    changeHandler={isAdmin && this.changeHandler('salary')}
                />
                <SumRow
                    title='Додаткові витрати'
                    levels={this.levels}
                    userLevel={this.userLevel}
                    values={this.extraCosts}
                    userColors={this.userColors}
                    changeHandler={isAdmin && this.changeHandler('extraCosts')}
                />
                <SumRow
                    title='KPI звіти'
                    levels={this.levels}
                    userLevel={this.userLevel}
                    values={this.KPIs}
                    userColors={this.userColors}
                    changeHandler={isAdmin && this.changeHandler('kpi')}
                />
                <SumRow
                    title='Бонус за виконання більше 5 продуктів'
                    levels={this.levels}
                    userLevel={this.userLevel}
                    values={this.bonuses}
                    userColors={this.userColors}
                />
                <TotalRow
                    levels={this.levels}
                    salaries={this.ratingSalary}
                    extraCosts={this.extraCosts}
                    KPIs={this.KPIs}
                    bonuses={this.bonuses}
                    userLevel={this.userLevel}
                    colors={this.userColors}
                />
                {
                    isAdmin &&
                    <Button
                        className={classes.submitButton}
                        variant='contained'
                        onClick={onSubmit}
                        disabled={this.isLoadingSubmit}>
                        {
                            this.isLoadingSubmit
                            ? <LoadingMask size={20} />
                            : 'Зберегти'
                        }
                    </Button>
                }
            </>
        );
    }
}

export default withStyles(styles)(UserContent);
