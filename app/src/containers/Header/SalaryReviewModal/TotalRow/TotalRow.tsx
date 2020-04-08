import React, { Component } from 'react';
import { WithStyles, withStyles, createStyles, Grid, Typography } from '@material-ui/core';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import zip from 'lodash/zip';
import cx from 'classnames';

const styles = createStyles({
    root: {
        minHeight: 48,
        borderBottom: '1px solid #e5e7e8',
        backgroundColor: '#f5f7f7',
        paddingLeft: 12
    },
    doubleWidth: {
        width: 400
    },
    text: {
        fontFamily: 'Source Sans Pro SemiBold'
    },
});

interface IProps extends WithStyles<typeof styles> {
    levels: number[];
    salaries: number[];
    extraCosts: number[];
    KPIs: number[];
    bonuses: number[];
    userLevel: number;
    colors: string[];
}

@observer
class TotalRow extends Component<IProps> {
    @computed
    get data(): number[] {
        const {
            salaries,
            extraCosts,
            KPIs,
            bonuses
        } = this.props;

        const zipped = zip(
            salaries,
            extraCosts,
            KPIs,
            bonuses
        );

        return zipped.map(values => values.reduce(
            (total, current) => total + (current || 0),
            0)
        );
    }

    render() {
        const { classes, colors, userLevel } = this.props;

        return (
            <Grid className={classes.root} container>
                <Grid
                    container
                    alignItems='center'
                    className={cx(classes.text, classes.doubleWidth)}>
                    <Typography>
                        Всього за місяць
                    </Typography>
                </Grid>
                {
                    this.data.map((x, i) => (
                        <Grid
                            key={i}
                            className={cx({[colors[i]]: i + 1 === userLevel })}
                            justify='center'
                            alignItems='center'
                            container
                            item
                            xs>
                                <Typography align='center'>
                                    { x || '' }
                                </Typography>
                        </Grid>
                    ))
                }
            </Grid>
        );
    }
}

export default withStyles(styles)(TotalRow);
