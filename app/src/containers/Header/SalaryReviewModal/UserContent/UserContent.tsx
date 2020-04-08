import React, { Component } from 'react';
import { createStyles, WithStyles, withStyles } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { IMedicine } from '../../../../interfaces/IMedicine';
import SalaryHeader from '../SalaryHeader';
import { ISalaryInfo, IUserSales } from '../../../../interfaces/ISalaryInfo';
import { IUser } from '../../../../interfaces';
import SalaryRow from '../SalaryRow';
import SumRow from '../SumRow';
import { computed } from 'mobx';

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
    }
});

interface IProps extends WithStyles<typeof styles> {
    currentDepartmentMeds?: IMedicine[];
    user: IUser;
    salary: Map<number, ISalaryInfo>;
    levelsCount: number;
    userSales?: IUserSales;
    isAdmin?: boolean;
}

@inject(({
    appState: {
        departmentsStore: {
            currentDepartmentMeds
        },
        userStore: {
            userSales,
            isAdmin
        }
    }
}) => ({
    currentDepartmentMeds,
    userSales,
    isAdmin
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

    render() {
        const { currentDepartmentMeds, salary, levelsCount, userSales, isAdmin } = this.props;

        const { level, value } = this.userMoneyDeficit;

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
                />
                <SumRow
                    title='Зарплата по рейтингу'
                    levels={this.levels}
                    userLevel={this.userLevel}
                    values={this.ratingSalary}
                    userColors={this.userColors}
                />
                <SumRow
                    title='Додаткові витрати'
                    levels={this.levels}
                    userLevel={this.userLevel}
                    values={this.extraCosts}
                    userColors={this.userColors}
                />
                <SumRow
                    title='KPI звіти'
                    levels={this.levels}
                    userLevel={this.userLevel}
                    values={this.KPIs}
                    userColors={this.userColors}
                />
                <SumRow
                    title='Бонус за виконання більше 5 продуктів'
                    levels={this.levels}
                    userLevel={this.userLevel}
                    values={this.plannedCosts}
                    userColors={this.userColors}
                />
            </>
        );
    }
}

export default withStyles(styles)(UserContent);