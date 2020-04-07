import React, { Component } from 'react';
import { createStyles, WithStyles, withStyles, Grid, Typography } from '@material-ui/core';
import { IMedicine } from '../../../../interfaces/IMedicine';
import { ISalaryInfo, IUserSales } from '../../../../interfaces/ISalaryInfo';
import { observer, inject } from 'mobx-react';
import cx from 'classnames';

const styles = (theme: any) => createStyles({
    wideColumn: {
        width: 200
    },
    cell: {
        border: '1px solid transparent'
    },
    red: {
        borderColor: theme.palette.primary.level.redFaded
    },
    orangered: {
        borderColor: theme.palette.primary.level.orangeredFaded
    },
    yellow: {
        borderColor: theme.palette.primary.level.yellowFaded
    },
    limeGreen: {
        borderColor: theme.palette.primary.level.limeGreenFaded
    },
    green: {
        borderColor: theme.palette.primary.level.greenFaded
    }
});

interface IProps extends WithStyles<typeof styles> {
    userColors: string[];
    levels: number[];
    userLevel: number;
    medicine: IMedicine;
    salary: Map<number, ISalaryInfo>;
    userSales?: IUserSales;
}

@inject(({
    appState: {
        userStore: {
            userSales
        }
    }
}) => ({
    userSales
}))
@observer
class SalaryRow extends Component<IProps> {
    readonly borderColors: any;
    constructor(props: IProps) {
        super(props);
        const { levels, classes: { red, orangered, yellow, limeGreen, green } } = props;
        this.borderColors = levels.length === 5
        ? [ red, orangered, yellow, limeGreen, green ]
        : [ red, yellow, green ];
    }

    get userValue(): number {
        const { userSales, medicine: { id } } = this.props;
        const item = userSales
        ? userSales[id]
        : null;
        return item
            ? item.amount
            : null;
    }

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
            : '-';
    }

    getLevelValue = (i: number) => {
        const { salary, medicine: { id } } = this.props;
        const salaryInfo = salary.get(i);
        if (!salaryInfo) return null;
        const medInfo = salaryInfo.meds[id];
        return medInfo
            ? medInfo.amount
            : null;
    }

    render() {
        const { classes, medicine, userLevel, levels, userColors } = this.props;

        return (
            <Grid alignItems='center' wrap='nowrap' container>
                <Grid className={classes.wideColumn}>
                    <Typography>
                        { medicine.name }
                    </Typography>
                </Grid>
                <Grid className={classes.wideColumn}>
                    <Typography align='center'>
                        { this.deficit }
                    </Typography>
                </Grid>
                {
                    levels.map(i => {
                        const value = this.getLevelValue(i);
                        return (
                            <Grid
                                key={i}
                                className={
                                    cx(
                                        classes.cell,
                                        {
                                            [userColors[i - 1]]: i === userLevel,
                                            [this.borderColors[i - 1]]: i === this.valueLevel
                                        }
                                    )
                                }
                                justify='center'
                                container
                                item
                                xs>
                                <Typography align='center'>
                                    { value || '-' }
                                </Typography>
                            </Grid>
                        );
                    })
                }
            </Grid>
        );
    }
}

export default withStyles(styles)(SalaryRow);
