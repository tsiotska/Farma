import React, { Component } from 'react';
import { createStyles, WithStyles, withStyles, Grid, Typography, Radio } from '@material-ui/core';
import { observer } from 'mobx-react';
import { USER_ROLE } from '../../../../constants/Roles';
import { observable } from 'mobx';
import cx from 'classnames';

const styles = (theme: any) => createStyles({
    root: {
        transition: '0.3s',
        padding: '10px 0',
        cursor: 'pointer',
        marginRight: 'auto',
        width: 'auto',
        borderRadius: 2,
    },
    levelLine: {
        height: 4,
        borderRadius: 2,
        backgroundColor: '#d2d2d9'
    },
    red: {
        backgroundColor: theme.palette.primary.level.red,
        color: theme.palette.primary.level.red
    },
    orangered: {
        backgroundColor: theme.palette.primary.level.orangered
    },
    yellow: {
        backgroundColor: theme.palette.primary.level.yellow
    },
    limeGreen: {
        backgroundColor: theme.palette.primary.level.limeGreen
    },
    green: {
        backgroundColor: theme.palette.primary.level.green
    },
    text_semibold: {
        color: '#868698',
        fontFamily: 'Source Sans Pro SemiBold',
        fontSize: 14,
        fontWeight: 600
    },
    label: {
        fontSize: 14,
        textAlign: 'center'
    }
});

interface IProps extends WithStyles<typeof styles> {
    role: number;
    initialLevel: string;
    levelChangeHandler: (levelType: string, event: any) => void;
}

@observer
class RoleLevels extends Component<IProps> {
    @observable selectedLevel: string = null;
    readonly levels: any;

    constructor(props: IProps) {
        super(props);
        const { classes: { red, orangered, yellow, limeGreen, green } } = this.props;
        this.levels = {
            [USER_ROLE.REGIONAL_MANAGER]: {
                name: 'Регіональний менеджер',
                levelType: 'rmLevel',
                colors: { РМ1: red, РМ2: yellow, РМ3: green },
            },
            [USER_ROLE.MEDICAL_AGENT]: {
                name: 'Медичний представник',
                levelType: 'mpLevel',
                colors: {
                    МП1: red, МП2: orangered,
                    МП3: yellow, МП4: limeGreen, МП5: green
                },
            }
        };
    }

    handleChange = (event: any) => {
        const { role, levelChangeHandler } = this.props;
        const levelType = this.levels[role].levelType;
        levelChangeHandler(levelType, event);
    }

    get roleLevels() {
        const { role } = this.props;
        return this.levels[role];
    }

    render() {
        const { classes, initialLevel } = this.props;
        return (
            <Grid className={classes.root} direction='column' container>
                <Typography color='textSecondary' className={classes.text_semibold}>
                    {this.roleLevels.name}
                </Typography>

                <Grid wrap='nowrap' spacing={1} container>
                    {Object.entries(this.roleLevels.colors).map((level, i) => (
                        <Grid key={i} direction='column' container item>
                            <Radio
                                checked={initialLevel === level[0]}
                                onChange={this.handleChange}
                                value={level[0]}
                                name='roleLevel'
                                color='default'
                            />
                            <Typography className={cx(initialLevel === level[0] && classes.text_semibold, classes.label)}>
                                {level[0]}
                            </Typography>
                            <div className={cx(classes.levelLine, level[1])}/>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(RoleLevels);
