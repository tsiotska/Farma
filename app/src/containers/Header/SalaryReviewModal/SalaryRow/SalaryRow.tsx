import React, { Component } from 'react';
import { createStyles, WithStyles, withStyles, Grid, Typography } from '@material-ui/core';
import { IMedicine } from '../../../../interfaces/IMedicine';
import { ISalaryInfo, IUserSales } from '../../../../interfaces/ISalaryInfo';
import { observer, inject } from 'mobx-react';
import cx from 'classnames';
import { computed, toJS } from 'mobx';
import EditableCell from '../EditableCell';

const styles = (theme: any) => createStyles({
    root: {
        minHeight: 48,
        paddingLeft: 12,
        borderBottom: '1px solid #e5e7e8'
    },
    wideColumn: {
        width: 200
    },
    mediumColumn: {
        width: 100
    },
    cell: {
        border: '2px solid transparent'
    },
    red: {
        borderColor: theme.palette.primary.level.red
    },
    orangered: {
        borderColor: theme.palette.primary.level.orangered
    },
    yellow: {
        borderColor: theme.palette.primary.level.yellow
    },
    limeGreen: {
        borderColor: theme.palette.primary.level.limeGreen
    },
    green: {
        borderColor: theme.palette.primary.level.green
    },
    withOffset: {
        margin: '0 4px'
    }
});

interface IProps extends WithStyles<typeof styles> {
    userColors: string[];
    levels: number[];
    userLevel: number;
    medicine: IMedicine;
    salary: Map<number, ISalaryInfo>;
    userSales: IUserSales;
    editable?: boolean;
}

@observer
class SalaryRow extends Component<IProps> {
    readonly borderColors: any;

    constructor(props: IProps) {
        super(props);
        const { levels, classes: { red, orangered, yellow, limeGreen, green } } = props;
        this.borderColors = levels.length === 5
            ? [red, orangered, yellow, limeGreen, green]
            : [red, yellow, green];
    }

    @computed
    get editableLevelValues(): Array<[number, number]> {
        const { levels, salary, medicine: { id } } = this.props;
        return levels.map(x => {
            const salaryInfo = salary.get(x);
            if (!salaryInfo) return null;
            const medInfo = salaryInfo.meds[id];
            const amount = medInfo
                ? medInfo.amount
                : null;
            const bonus = medInfo
                ? medInfo.bonus
                : null;

            return ([amount, bonus] as [number, number]);
        });
    }

    @computed
    get levelValues(): number[] {
        const { levels, salary, medicine: { id } } = this.props;
        return levels.map(x => {
            const salaryInfo = salary.get(x);
            if (!salaryInfo) return null;
            const medInfo = salaryInfo.meds[id];
            return medInfo
                ? medInfo.amount
                : 0;
        });
    }

    @computed
    get userValue(): number {
        const { userSales, medicine: { id } } = this.props;
        const item = userSales
            ? userSales[id]
            : null;
        return item
            ? item.amount
            : null;
    }

    @computed
    get valueLevel(): number {
        const {
            salary,
            levels,
            medicine: { id },
        } = this.props;

        let currentLevel = 0;
        for (const i of levels) {
            const infoItem = salary.get(i);
            const medInfo = infoItem
                ? infoItem.meds[id]
                : null;
            const amount = medInfo
                ? medInfo.amount || Number.MAX_SAFE_INTEGER
                : Number.MAX_SAFE_INTEGER;
            if (amount <= this.userValue) currentLevel = i;
        }
        return currentLevel;
    }

    @computed
    get fact(): number | string {
        return 0;
    }

    @computed
    get deficit(): number | string {
        const { salary, medicine: { id } } = this.props;

        const soldAmount = this.userValue || 0;

        const infoItem = salary.get(this.valueLevel + 1);
        const medInfo = infoItem
            ? infoItem.meds[id]
            : null;
        const amount = medInfo
            ? medInfo.amount
            : 0;

        return soldAmount < amount
            ? amount - soldAmount
            : 0;
    }

    render() {
        const {
            classes,
            medicine: { id, name },
            userLevel,
            levels,
            userColors,
            editable
        } = this.props;

        return (
            <Grid className={classes.root} wrap='nowrap' container>
                <Grid className={cx(classes.wideColumn, classes.withOffset)} alignItems='center' container>
                    <Typography>
                        {name}
                    </Typography>
                </Grid>
                <Grid className={classes.mediumColumn} justify='center' alignItems='center' container>
                    <Typography align='center'>
                        {this.fact}
                    </Typography>
                </Grid>
                <Grid className={classes.mediumColumn} justify='center' alignItems='center' container>
                    <Typography align='center'>
                        {this.deficit}
                    </Typography>
                </Grid>
                {
                    levels.map(i => (
                            <Grid
                                key={i}
                                className={cx(classes.withOffset, classes.cell,
                                    {
                                        [userColors[i - 1]]: i === userLevel,
                                        [this.borderColors[i - 1]]: i === this.valueLevel
                                    }
                                )
                                }
                                alignItems='center'
                                justify='center'
                                container
                                item
                                xs>
                                {
                                    editable
                                        ? <EditableCell
                                            level={i}
                                            medId={id}
                                            values={this.editableLevelValues[i - 1]}
                                        />
                                        : <Typography align='center'>
                                            {this.levelValues[i - 1]}
                                        </Typography>
                                }
                            </Grid>
                        )
                    )
                }
            </Grid>
        );
    }
}

export default withStyles(styles)(SalaryRow);
