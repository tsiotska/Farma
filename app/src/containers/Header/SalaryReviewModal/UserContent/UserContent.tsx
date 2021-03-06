import React, {Component} from 'react';
import {createStyles, WithStyles, withStyles, Button, Grid} from '@material-ui/core';
import {observer, inject} from 'mobx-react';
import {IMedicine} from '../../../../interfaces/IMedicine';
import SalaryHeader from '../SalaryHeader';
import {ISalaryInfo, IUserSales} from '../../../../interfaces/ISalaryInfo';
import {IUser, IWithRestriction} from '../../../../interfaces';
import SalaryRow from '../SalaryRow';
import SumRow from '../SumRow';
import {computed, toJS, reaction, observable} from 'mobx';
import {ISalarySettings} from '../../../../interfaces/ISalarySettings';
import TotalRow from '../TotalRow';
import {IAsyncStatus} from '../../../../stores/AsyncStore';
import LoadingMask from '../../../../components/LoadingMask';
import {withRestriction} from '../../../../components/hoc/withRestriction';
import {PERMISSIONS} from '../../../../constants/Permissions';
import {USER_ROLE} from '../../../../constants/Roles';

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
    },
    divideContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexWrap: 'nowrap',
        width: '100%'
    },
    divideContainer_line: {
        width: '18%',
        height: 1,
        backgroundColor: theme.palette.primary.level.green
    },
    divideContainer_label: {
        color: theme.palette.primary.level.green,
        whiteSpace: 'nowrap'
    }
});

interface IProps extends WithStyles<typeof styles>, IWithRestriction {
    currentDepartmentMeds?: IMedicine[];
    previewUser: IUser;
    salary: Map<number, ISalaryInfo>;
    levelsCount: number;
    userSales?: IUserSales;
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
                     salarySettings,
                     clearUserSalaryInfo,
                     getAsyncStatus
                 }
             }
         }) => ({
    changeUserSalary,
    currentDepartmentMeds,
    userSales,
    salarySettings,
    clearUserSalaryInfo,
    getAsyncStatus
}))
@withRestriction([PERMISSIONS.EDIT_SALARY])
@observer
class UserContent extends Component<IProps> {
    readonly colors: any;
    @observable userLevel: number = 1;
    @observable disabledSubmit: boolean = true;

    constructor(props: IProps) {
        super(props);
        const {classes: {red, orangered, yellow, limeGreen, green}} = props;
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
    get userColors(): string[] {
        const {levelsCount} = this.props;
        return this.colors[levelsCount] || [];
    }

    @computed
    get levels(): number[] {
        const {levelsCount} = this.props;
        return [...new Array(levelsCount)].map((x, i) => i + 1);
    }

    get deletedMedsIds(): number[] {
        const {currentDepartmentMeds} = this.props;
        return currentDepartmentMeds.filter(({deleted}) => deleted === true).map(({id}) => id);
    }

    @computed
    get plannedCosts(): number[] {
        const {salary} = this.props;
        return this.levels.map(level => {
            const infoItem = salary.get(level);
            const plannedCost = infoItem
                ? [...Object.values(infoItem.meds)].reduce((total, {amount, price}) => (total + (amount || 0) * (price || 0)), 0)
                : 0;
            return Math.floor(plannedCost);
        });
    }

    @computed
    get userMoneyDeficit(): number {
        const {userSales} = this.props;
        if (!userSales) return 0;
        const value = Object.values(userSales)
            .reduce((total, {money}) => total + (money || 0), 0);
        return Math.floor(value);
    }

    @computed
    get extraCosts(): number[] {
        const {salary} = this.props;
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
        const {salary} = this.props;
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
        const {salary} = this.props;
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
        const {salarySettings, salary, userSales, previewUser: {position}} = this.props;
        let levelType: string;

        switch (position) {
            case USER_ROLE.REGIONAL_MANAGER:
                levelType = 'rmLevel';
                break;
            case USER_ROLE.MEDICAL_AGENT:
                levelType = 'mpLevel';
                break;
            default:
                return;
        }
        const treshold = salarySettings
            ? salarySettings.kpi
            : null;

        if (treshold === null) return [];
        return this.levels.map(x => {
            if (x !== this.userLevel
                || !userSales
                || this.userLevel < salarySettings[levelType]) {
                return 0;
            }

            const salaryInfo = salary.get(x);
            const meds = salaryInfo
                ? salaryInfo.meds
                : {};

            const bonusValues = Object.entries(meds).map(([medId, {amount, bonus}]) => {
                const soldAmount = userSales[medId]
                    ? (userSales[medId].amount || 0)
                    : 0;
                return (!!soldAmount && !!bonus && soldAmount >= amount)
                    ? Math.floor(soldAmount * bonus)
                    : 0;
            });

            const filtered = bonusValues.filter(value => !!value);

            return filtered.length >= treshold
                ? filtered.reduce((total, current) => total + current, 0)
                : 0;
        });
    }

    changeHandler = (propName: keyof Omit<ISalaryInfo, 'meds'>) => (level: number, {target: {value}}: any) => {
        const {changeUserSalary} = this.props;
        const casted = +value;
        const isValid = value.length
            ? !Number.isNaN(casted)
            : true;
        if (isValid) changeUserSalary(level, propName, casted);
    }

    enableSubmitButton = () => {
        this.disabledSubmit = false;
    }

    levelReactionDisposer: any;

    componentDidMount() {
        this.levelReactionDisposer = reaction(
            () => [this.userMoneyDeficit, ...this.plannedCosts],
            (values: number[]) => {
                const currentUserValue = values[0];
                let newUserLevel: number = 0;
                for (let i = 1, q = values.length; i < q; i++) {
                    if (currentUserValue >= values[i]) {
                        newUserLevel = i;
                    }
                }
                this.userLevel = newUserLevel || 1;
            }
        );
    }

    componentWillUnmount() {
        if (this.levelReactionDisposer) this.levelReactionDisposer();
        this.props.clearUserSalaryInfo();
    }

    render() {
        const {
            classes,
            salary,
            userSales,
            onSubmit,
            isAllowed,
            currentDepartmentMeds
        } = this.props;
        return (
            <>
                {
                    currentDepartmentMeds.filter(({deleted}) => deleted === false).map(medicine => (
                        <SalaryRow
                            key={medicine.id}
                            userSales={userSales}
                            userColors={this.userColors}
                            levels={this.levels}
                            userLevel={this.userLevel}
                            medicine={medicine}
                            salary={salary}
                            editable={isAllowed}
                            enableSubmitButton={this.enableSubmitButton}
                            disabledSubmit={this.disabledSubmit}
                        />
                    ))
                }

                <SumRow
                    title='???????? ?? ????????????'
                    levels={this.levels}
                    userLevel={this.userLevel}
                    values={this.plannedCosts}
                    userColors={this.userColors}
                    secondColumnValue={this.userMoneyDeficit}
                >
                    <Grid className={classes.divideContainer} container>
                        <Grid className={classes.divideContainer_line}/>
                        <Grid className={classes.divideContainer_label}>???????? ?? ????????????</Grid>
                        <Grid className={classes.divideContainer_line}/>
                    </Grid>
                </SumRow>
                <SumRow
                    title='???????????????? ???? ????????????????'
                    levels={this.levels}
                    userLevel={this.userLevel}
                    values={this.ratingSalary}
                    userColors={this.userColors}
                    changeHandler={isAllowed && this.changeHandler('salary')}
                    emptyPlaceholder=''
                />
                <SumRow
                    title='?????????????????? ??????????????'
                    levels={this.levels}
                    userLevel={this.userLevel}
                    values={this.extraCosts}
                    userColors={this.userColors}
                    changeHandler={isAllowed && this.changeHandler('extraCosts')}
                    emptyPlaceholder=''
                />
                <SumRow
                    title='KPI ??????????'
                    levels={this.levels}
                    userLevel={this.userLevel}
                    values={this.KPIs}
                    userColors={this.userColors}
                    changeHandler={isAllowed && this.changeHandler('kpi')}
                    emptyPlaceholder=''
                />
                <SumRow
                    title='?????????? ???? ?????????????????? ??????????????????'
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
                    isAllowed &&
                    <Button
                        className={classes.submitButton}
                        variant='contained'
                        onClick={onSubmit}
                        disabled={this.isLoadingSubmit || this.disabledSubmit}>
                        {
                            this.isLoadingSubmit
                                ? <LoadingMask size={20}/>
                                : '????????????????'
                        }
                    </Button>
                }
            </>
        );
    }
}

export default withStyles(styles)(UserContent);
