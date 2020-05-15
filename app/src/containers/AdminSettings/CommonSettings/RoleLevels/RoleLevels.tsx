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
});

interface IProps extends WithStyles<typeof styles> {
    role: number;
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
                colors: { РМ1: red, РМ2: yellow, РМ3: green },
            },
            [USER_ROLE.MEDICAL_AGENT]: {
                name: 'Медичний представник',
                colors: {
                    МП1: red, МП2: orangered,
                    МП3: yellow, МП4: limeGreen, МП5: green
                },
            }
        };
    }

    componentDidMount() {
        this.selectedLevel = Object.keys(this.roleLevels.colors)[0];
    }

    handleChange = (event: any) => {
        this.selectedLevel = event.target.value;
    }

    get roleLevels() {
        const { role } = this.props;
        return this.levels[role];
    }

    render() {
        const { classes } = this.props;
        return (
            <Grid className={classes.root} direction='column' container>
                <Typography color='textSecondary' variant='h6'>
                    {this.roleLevels.name}
                </Typography>

                <Grid wrap='nowrap' spacing={1} container>
                    {Object.entries(this.roleLevels.colors).map((level, i) => (
                         <Grid key={i} direction='column' item>
                            <Radio
                                checked={this.selectedLevel === level[0]}
                                onChange={this.handleChange}
                                value={level[0]}
                                name='roleLevel'
                                // className={cx([level[1]])}
                                color='default'
                            />
                            <div className={cx(classes.levelLine, level[1])}/>
                        </Grid>
                        ))}
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(RoleLevels);
