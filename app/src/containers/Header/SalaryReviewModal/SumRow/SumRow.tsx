import React, { Component } from 'react';
import { WithStyles, createStyles, Grid, withStyles, Typography } from '@material-ui/core';
import { observer } from 'mobx-react';
import cx from 'classnames';

const styles = createStyles({
    wideColumn: {
        width: 200
    },
    doubleWidth: {
        width: 400
    }
});

interface IProps extends WithStyles<typeof styles> {
    title: string;
    levels: number[];
    userLevel: number;
    values: any[];
    userColors: string[];
    secondColumnValue?: any;
}

@observer
class SumRow extends Component<IProps> {
    render() {
        const {
            classes,
            title,
            secondColumnValue,
            levels,
            values,
            userColors,
            userLevel
        } = this.props;

        return (
            <Grid alignItems='center' container>
                <Grid
                    className={
                        secondColumnValue
                        ? classes.wideColumn
                        : classes.doubleWidth
                    }>
                    <Typography>
                        { title }
                    </Typography>
                </Grid>
                {
                    secondColumnValue &&
                    <Grid className={classes.wideColumn}>
                        <Typography>
                            { title }
                        </Typography>
                    </Grid>
                }
                {
                    levels.map((x, i) => (
                        <Grid
                        key={i}
                        className={cx({[userColors[i]]: x === userLevel })}
                        justify='center'
                        container
                        item
                        xs>
                            { values[i] || '-' }
                        </Grid>
                    ))
                }
            </Grid>
        );
    }
}

export default withStyles(styles)(SumRow);
