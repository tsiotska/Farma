import React, { Component } from 'react';
import { WithStyles, createStyles, Grid, withStyles, Typography } from '@material-ui/core';
import { observer } from 'mobx-react';
import cx from 'classnames';

const styles = createStyles({
    root: {
        minHeight: 48
    },
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
            <Grid className={classes.root} container>
                <Grid
                    container
                    alignItems='center'
                    className={
                        secondColumnValue === undefined
                        ? classes.doubleWidth
                        : classes.wideColumn
                    }>
                    <Typography>
                        { title }
                    </Typography>
                </Grid>
                {
                    secondColumnValue !== undefined &&
                    <Grid className={classes.wideColumn} container alignItems='center' justify='center'>
                        <Typography>
                            { secondColumnValue || '-' }
                        </Typography>
                    </Grid>
                }
                {
                    levels.map((x, i) => (
                        <Grid
                        key={i}
                        className={cx({[userColors[i]]: x === userLevel })}
                        justify='center'
                        alignItems='center'
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
