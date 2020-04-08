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
    submitSalaryChanges?: () => void;
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
            submitSalaryChanges
        }
    }
}) => ({
    changeUserSalary,
    currentDepartmentMeds,
    userSales,
    isAdmin,
    salarySettings,
    submitSalaryChanges
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
            const plannedCosts = infoItem
                ? infoItem.plannedCosts
                : 0;
            return plannedCosts;
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
    get userMoneyDeficit(): {level: number, value: number} {
        const { salary } = this.props;
        let level = 0;
        if (!salary) return { level, value: 0 };
        for (const [i, { plannedCosts }] of salary) {
            if (this.totalUserSoldAmount >= plannedCosts) {
                level = i;
            } else {
                return {
                    level,
                    value: plannedCosts - this.totalUserSoldAmount
                };
            }
        }
        return { level, value: 0 };
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
                ? bonusValues.reduce((total, current) => total + current, 0)
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

    render() {
        const {
            classes,
            currentDepartmentMeds,
            salary,
            levelsCount,
            userSales,
            isAdmin,
            submitSalaryChanges
        } = this.props;

        const { level, value } = this.userMoneyDeficit;
        console.log('this.bonuses: ', toJS(this.bonuses));
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
                            editable={true}
                            // editable={isAdmin}
                        />
                    ))
                }
                <SumRow
                    title='План в грошах'
                    levels={this.levels}
                    userLevel={this.userLevel}
                    values={this.plannedCosts}
                    userColors={this.userColors}
                    secondColumnValue={value}
                    // changeHandler={isAdmin ? this.changeHandler('plannedCosts') : null}
                    changeHandler={this.changeHandler('plannedCosts')}
                />
                <SumRow
                    title='Зарплата по рейтингу'
                    levels={this.levels}
                    userLevel={this.userLevel}
                    values={this.ratingSalary}
                    userColors={this.userColors}
                    changeHandler={this.changeHandler('salary')}
                />
                <SumRow
                    title='Додаткові витрати'
                    levels={this.levels}
                    userLevel={this.userLevel}
                    values={this.extraCosts}
                    userColors={this.userColors}
                    changeHandler={this.changeHandler('extraCosts')}
                />
                <SumRow
                    title='KPI звіти'
                    levels={this.levels}
                    userLevel={this.userLevel}
                    values={this.KPIs}
                    userColors={this.userColors}
                    changeHandler={this.changeHandler('kpi')}
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
                <Button className={classes.submitButton} variant='contained' onClick={submitSalaryChanges}>
                    Зберегти
                </Button>
            </>
        );
    }
}

export default withStyles(styles)(UserContent);
