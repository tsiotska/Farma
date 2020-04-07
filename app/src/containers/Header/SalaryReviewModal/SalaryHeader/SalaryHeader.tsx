import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { createStyles, WithStyles, withStyles, Grid, Typography } from '@material-ui/core';
import cx from 'classnames';

const styles = (theme: any) => createStyles({
    wideColumn: {
        width: 200
    },
    red: {
        color: theme.palette.primary.level.red
    },
    orangered: {
        color: theme.palette.primary.level.orangered
    },
    yellow: {
        color: theme.palette.primary.level.yellow
    },
    limeGreen: {
        color: theme.palette.primary.level.limeGreen
    },
    green: {
        color: theme.palette.primary.level.green
    },
});

interface IProps extends WithStyles<typeof styles> {
    levelsCount: number;
}

@observer
class SalaryHeader extends Component<IProps> {
    readonly colors: any;

    constructor(props: IProps) {
        super(props);
        const { classes: { red, orangered, yellow, limeGreen, green } } = props;
        this.colors = {
            3: [red, yellow, green],
            5: [red, orangered, yellow, limeGreen, green]
        };
    }

    get userColor(): string[] {
        const { levelsCount } = this.props;
        return this.colors[levelsCount] || [];
    }

    get MPHeaders(): string[] {
        const { levelsCount } = this.props;
        const res: string[] = [];
        for (let i = 0; i < levelsCount; ++i) {
            res.push(`МП${i + 1}`);
        }
        return res;
    }

    render() {
        const { classes } = this.props;

        return (
            <Grid alignItems='center' wrap='nowrap' container>
                <Grid className={classes.wideColumn}>
                    <Typography>
                        Препарати
                    </Typography>
                </Grid>
                <Grid className={classes.wideColumn}>
                    <Typography align='center'>
                        Кількість до наступного рівня
                    </Typography>
                </Grid>
                {
                    this.MPHeaders.map((header, i) => (
                        <Grid key={header} justify='center' xs container item>
                            <Typography className={this.userColor[i]} align='center'>
                                {header}
                            </Typography>
                        </Grid>
                    ))
                }
            </Grid>
        );
    }
}

export default withStyles(styles)(SalaryHeader);
