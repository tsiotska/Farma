import React, { Component } from 'react';
import { WithStyles, withStyles, createStyles, Grid, Typography } from '@material-ui/core';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import zip from 'lodash/zip';
import cx from 'classnames';

const styles = (theme: any) => createStyles({
    root: {
        minHeight: 48,
        // borderBottom: '1px solid #e5e7e8',
        // backgroundColor: '#f5f7f7',
        paddingLeft: 12,
        '& > *': {
            paddingTop: 16
        }
    },
    doubleWidth: {
        width: 400
    },
    text: {
        fontFamily: 'Source Sans Pro SemiBold'
    },
    red: {
        backgroundColor: '#f97575'
    },
    orangered: {
        backgroundColor: '#ff9b3a'
    },
    yellow: {
        backgroundColor: '#f3ca47'
    },
    limeGreen: {
        backgroundColor: '#a5cd58'
    },
    green: {
        backgroundColor: '#25d174'
    },
    withOffset: {
        margin: '0 4px'
    }
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
    readonly blockColors: { [key: number]: string[]};

    constructor(props: IProps) {
        super(props);
        const { classes: { red, orangered, yellow, limeGreen, green }} = props;
        this.blockColors = {
            3: [ red, yellow, green ],
            5: [ red, orangered, yellow, limeGreen, green ]
        };
    }

    @computed
    get actualBlockColors(): string[] {
        const { levels } = this.props;
        return this.blockColors[levels.length] || [];
    }

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
                    className={cx(classes.withOffset, classes.text, classes.doubleWidth)}>
                    <Typography>
                        Всього за місяць
                    </Typography>
                </Grid>
                {
                    this.data.map((x, i) => (
                        <Grid
                            key={i}
                            className={cx(classes.withOffset, {[colors[i]]: i + 1 === userLevel })}
                            container
                            item
                            xs>
                                <Grid
                                    justify='center'
                                    alignItems='center'
                                    className={cx({ [this.actualBlockColors[i] ]: true })}
                                    container>
                                    <Typography align='center'>
                                        { x || 0 }
                                    </Typography>
                                </Grid>
                        </Grid>
                    ))
                }
            </Grid>
        );
    }
}

export default withStyles(styles)(TotalRow);
