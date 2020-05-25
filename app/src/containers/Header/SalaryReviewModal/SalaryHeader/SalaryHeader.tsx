import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { createStyles, WithStyles, withStyles, Grid, Typography } from '@material-ui/core';
import cx from 'classnames';
import { USER_ROLE } from '../../../../constants/Roles';
import { computed } from 'mobx';

const styles = (theme: any) => createStyles({
    root: {
        borderBottom: '1px solid #e5e7e8',
        paddingLeft: 12
    },
    wideColumn: {
        width: 200
    },
    mediumColumn: {
        width: 100
    },
    text: {
        fontFamily: 'Source Sans Pro SemiBold',
        fontSize: 14,
        lineHeight: '14px'
    },
    secondaryText: {
        width: '100%',
        padding: 4,
    },
    adminTextBlock: {
        position: 'relative',
        height: 32,
        marginTop: 6,
        '&::before': {
            content: '" "',
            width: '70%',
            height: 1,
            position: 'absolute',
            top: 0,
            backgroundColor: '#e5e7e8',
            left: '50%',
            transform: 'translateX(-50%)'
        }
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
    withOffset: {
        margin: '0 4px'
    }
});

interface IProps extends WithStyles<typeof styles> {
    levelsCount: number;
    isAdmin?: boolean;
    role?: USER_ROLE;
}

@inject(({
    appState: {
        userStore: {
            isAdmin,
            role
        }
    }
}) => ({
    isAdmin,
    role
}))
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

    @computed
    get userColor(): string[] {
        const { levelsCount } = this.props;
        return this.colors[levelsCount] || [];
    }

    @computed
    get MPHeaders(): string[] {
        const { levelsCount, role } = this.props;
        const keyName = role === USER_ROLE.REGIONAL_MANAGER
            ? 'РМ'
            : 'МП';
        const res: string[] = [];
        for (let i = 0; i < levelsCount; ++i) {

            res.push(`${keyName}${i + 1}`);
        }
        return res;
    }

    render() {
        const { classes, isAdmin } = this.props;

        return (
            <Grid className={classes.root} alignItems='center' wrap='nowrap' container>
                <Grid className={cx(classes.wideColumn, classes.withOffset)}>
                    <Typography className={classes.text} color='textSecondary'>
                        Препарати
                    </Typography>
                </Grid>
                <Grid className={classes.mediumColumn}>
                    <Typography className={classes.text}  align='center' color='textSecondary'>
                        Факт
                    </Typography>
                </Grid>
                <Grid className={classes.mediumColumn}>
                    <Typography className={classes.text} align='center' color='textSecondary'>
                        Кількість до наступного рівня
                    </Typography>
                </Grid>
                {
                    this.MPHeaders.map((header, i) => (
                        <Grid key={header} className={classes.withOffset} alignItems='center' direction='column' xs container item>
                            <Typography className={cx(classes.text, this.userColor[i])} align='center'>
                                {header}
                            </Typography>
                            {
                                isAdmin &&
                                <Grid className={classes.adminTextBlock} alignItems='center' wrap='nowrap' container>
                                    <Typography className={cx(classes.text, classes.secondaryText)} align='right' variant='body2' color='textSecondary'>
                                        к-сть
                                    </Typography>
                                    <Typography className={cx(classes.text, classes.secondaryText)} align='left' variant='body2' color='textSecondary'>
                                        бонус
                                    </Typography>
                                </Grid>
                            }
                        </Grid>
                    ))
                }
            </Grid>
        );
    }
}

export default withStyles(styles)(SalaryHeader);
