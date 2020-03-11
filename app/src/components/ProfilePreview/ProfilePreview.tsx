import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    Grid,
    Avatar,
    Typography,
    Divider,
    LinearProgress,
    Hidden
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import cx from 'classnames';
import { IUser } from '../../interfaces';
import { IPosition } from '../../interfaces/IPosition';

const styles = (theme: any) => createStyles({
    container: {
        padding: '14px 20px',
    },
    gridContainer: {
        padding: '8px 0',
        [theme.breakpoints.up('sm')]: {
            padding: '0 16px',
            '&:first-of-type': {
                paddingLeft: 0
            },
        },
        [theme.breakpoints.down('xs')]: {
            justifyContent: 'center'
        }
    },
    avatar: {
        height: 100,
        width: 100,
        marginRight: 16
    },
    credentials: {
        fontFamily: 'Source Sans Pro SemiBold'
    },
    textContainer: {
        padding: '8px 0'
    },
    fullWidth: {
        width: '100%'
    },
    realizationContainer: {
        width: 'auto'
    },
    colorGreen: {
        color: theme.palette.primary.green.main
    },
    realizationProgress: {
        width: '40%',
        height: 4,
        borderRadius: 2,
        margin: '0 10px',
        minWidth: 130,
        maxWidth: 350
    },
    credsContainer: {
        minWidth: 280
    },
    dividerVertical: {
        minHeight: 100
    },
    realizationTitle: {
        paddingTop: theme.typography.pxToRem(15)
    }
});

interface IProps extends WithStyles<typeof styles> {
    user?: IUser;
    positions?: Map<number, IPosition>;
}

@inject(({
    appState: {
        userStore: {
            user
        },
        departmentsStore: {
            positions
        }
    }
}) => ({
    user,
    positions
}))
@observer
class ProfilePreview extends Component<IProps> {
    get realizationPercent(): number {
        return 65;
    }

    get userName(): string {
        return this.props.user
        ? this.props.user.name
        : '';
    }

    get userPosition(): string {
        const { positions, user } = this.props;

        const userPosition = user
        ? user.position
        : -1;

        const pos = positions.get(userPosition);

        return pos
        ? pos.name
        : '';
    }

    get avatarProps(): any {
        const { user } = this.props;

        if (!user) return {};

        return user.avatar
        ? { src: user.avatar }
        : { children: this.userName[0] };
    }

    render() {
        const { classes } = this.props;

        return (
                <Grid
                    className={classes.container}
                    justify='center'
                    container>

                    <Grid
                        xs={12}
                        sm={5}
                        md={3}
                        className={cx(classes.gridContainer, classes.credsContainer)}
                        wrap='nowrap'
                        container
                        item>
                        <Avatar className={classes.avatar} {...this.avatarProps} />
                        <Grid
                            className={classes.textContainer}
                            justify='space-around'
                            direction='column'
                            container>
                            <Typography className={classes.credentials} color='textPrimary'>
                                { this.userName }
                            </Typography>
                            <Typography color='textSecondary' variant='body2'>
                                { this.userPosition }
                            </Typography>
                        </Grid>
                    </Grid>

                    <Hidden xsDown>
                        <Divider className={classes.dividerVertical} orientation='vertical' />
                    </Hidden>

                    <Grid
                        xs={12}
                        sm={5}
                        md
                        className={classes.gridContainer}
                        direction='column'
                        container
                        zeroMinWidth
                        item>
                        <Typography className={classes.realizationTitle} variant='body2'>
                            Реализация препаратов
                        </Typography>
                        <Grid  wrap='nowrap' alignItems='center' container>
                            <Typography className={classes.colorGreen} variant='body2'>
                                { this.realizationPercent }%
                            </Typography>
                            <LinearProgress
                                className={classes.realizationProgress}
                                variant='determinate'
                                value={this.realizationPercent} />
                            <Grid
                                className={classes.realizationContainer}
                                alignItems='center'
                                direction='column'
                                container>
                                <Typography className={classes.colorGreen} variant='body2'>
                                    40
                                </Typography>
                                <Divider className={classes.fullWidth} />
                                <Typography color='textSecondary' variant='body2'>
                                    100
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Hidden smDown>
                        <Divider className={classes.dividerVertical} orientation='vertical' />
                    </Hidden>

                    <Grid
                        xs={12}
                        sm={2}
                        className={classes.gridContainer}
                        justify='center'
                        container
                        item>
                        actions
                    </Grid>
                </Grid>
        );
    }
}

export default withStyles(styles)(ProfilePreview);
