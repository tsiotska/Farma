import React, { Component } from 'react';
import { createStyles, WithStyles, withStyles, Grid, Typography } from '@material-ui/core';
import { IMedicine } from '../../../../interfaces/IMedicine';
import { ISalaryInfo } from '../../../../interfaces/ISalaryInfo';
import { observer } from 'mobx-react';
import cx from 'classnames';

const styles = (theme: any) => createStyles({
    wideColumn: {
        width: 200
    },
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
    levelsCount: number;
    userLevel: number;
    medicine: IMedicine;
    salary: Map<number, ISalaryInfo>;
}

@observer
class SalaryRow extends Component<IProps> {
    readonly colors: any;

    constructor(props: IProps) {
        super(props);
        const { classes: { red, orangered, yellow, limeGreen, green } } = props;
        this.colors = {
            3: [red, yellow, green],
            5: [red, orangered, yellow, limeGreen, green]
        };
    }

    get userColors(): string[] {
        const { levelsCount } = this.props;
        return this.colors[levelsCount] || [];
    }

    get levels(): number[] {
        const { levelsCount } = this.props;
        return [...new Array(levelsCount)].map((x, i) => i + 1);
    }

    getLevelValue = (i: number) => {
        const { salary, medicine: { id } } = this.props;
        const salaryInfo = salary.get(i);
        if (!salaryInfo) return '-';
        const medInfo = salaryInfo.meds[id];
        return medInfo
            ? medInfo.amount
            : '-';
    }

    render() {
        const { classes, medicine, userLevel } = this.props;

        return (
            <Grid alignItems='center' wrap='nowrap' container>
                <Grid className={classes.wideColumn}>
                    <Typography>
                        { medicine.name }
                    </Typography>
                </Grid>
                <Grid className={classes.wideColumn}>
                    <Typography align='center'>
                        -
                    </Typography>
                </Grid>
                {
                    this.levels.map(i => (
                        <Grid
                            key={i}
                            className={cx({[this.userColors[i - 1]]: i === userLevel })}
                            justify='center'
                            container
                            item
                            xs>
                            <Typography align='center'>
                                { this.getLevelValue(i) }
                            </Typography>
                        </Grid>
                    ))
                }
            </Grid>
        );
    }
}

export default withStyles(styles)(SalaryRow);
