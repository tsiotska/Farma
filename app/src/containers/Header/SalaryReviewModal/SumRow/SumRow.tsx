import React, { Component } from 'react';
import { WithStyles, createStyles, Grid, withStyles, Typography, Input } from '@material-ui/core';
import { observer } from 'mobx-react';
import cx from 'classnames';

const styles = createStyles({
    root: {
        minHeight: 48,
        borderBottom: '1px solid #e5e7e8',
        backgroundColor: '#f5f7f7',
        paddingLeft: 12
    },
    wideColumn: {
        width: 200
    },
    doubleWidth: {
        width: 400
    },
    text: {
        fontFamily: 'Source Sans Pro SemiBold'
    },
    inputRoot: {
        maxWidth: 50,
        border: '1px solid #a7a7a7',
        margin: '0 2px',
        borderRadius: 2
    },
    input: {
        textAlign: 'center'
    }
});

interface IProps extends WithStyles<typeof styles> {
    title: string;
    levels: number[];
    userLevel: number;
    values: any[];
    userColors?: string[];
    secondColumnValue?: any;
    changeHandler?: (level: number, e: any) => void;
}

@observer
class SumRow extends Component<IProps> {
    changeHandler = (level: number) => (e: any) => this.props.changeHandler(level, e);

    render() {
        const {
            classes,
            title,
            secondColumnValue,
            levels,
            values,
            userColors = {},
            userLevel,
            changeHandler
        } = this.props;

        return (
            <Grid className={classes.root} container>
                <Grid
                    container
                    alignItems='center'
                    className={cx(
                        classes.text,
                        secondColumnValue === undefined
                        ? classes.doubleWidth
                        : classes.wideColumn
                    )}>
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
                            {
                                changeHandler
                                ? <Input
                                    classes={{
                                        input: classes.input,
                                        root: classes.inputRoot,
                                    }}
                                    value={values[i] || 0}
                                    onChange={this.changeHandler(x)}
                                    disableUnderline
                                  />
                                : <Typography align='center'>
                                    { values[i] || '' }
                                  </Typography>
                            }
                        </Grid>
                    ))
                }
            </Grid>
        );
    }
}

export default withStyles(styles)(SumRow);
