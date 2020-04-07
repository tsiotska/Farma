import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { createStyles, WithStyles, withStyles, Grid, Typography } from '@material-ui/core';

const styles = createStyles({
    wideColumn: {
        minWidth: 200
    }
});

interface IProps extends WithStyles<typeof styles> {
    levelsCount: number;
}

@observer
class SalaryHeader extends Component<IProps> {
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
                <Grid className={classes.wideColumn} xs container item>
                    <Typography>
                        Препарати
                    </Typography>
                </Grid>
                <Grid className={classes.wideColumn} xs container item>
                    <Typography align='center'>
                        Кількість до наступного рівня
                    </Typography>
                </Grid>
                {
                    this.MPHeaders.map(header => (
                        <Grid xs container item>
                            <Typography>
                                { header }
                            </Typography>
                        </Grid>
                    ))
                }
            </Grid>
        );
    }
}

export default withStyles(styles)(SalaryHeader);
