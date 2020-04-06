import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    Grid,
    Avatar,
    Typography,
    Divider,
    LinearProgress,
    Hidden,
    Paper
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { observable, computed, toJS } from 'mobx';
import cx from 'classnames';
import { IUser } from '../../interfaces';
import { IPosition } from '../../interfaces/IPosition';
import { USER_ROLE } from '../../constants/Roles';

const styles = (theme: any) => createStyles({
    backface: {
        position: 'absolute',
        width: '100%',
        transformOrigin: 'left',
        transition: '0.3s',
        zIndex: ({ index }: any) => 100 * index,
        transform: ({ scaleIndex }: any) => `scale(${1 - scaleIndex / 10}, ${1 - scaleIndex / 10})`,
        left: ({ index }: any) => index * 50,
        cursor: ({ scaleIndex }: any) => scaleIndex ? 'pointer' : 'auto',
        backgroundColor: ({ scaleIndex }: any) => scaleIndex
            ? theme.palette.primary.white
            : 'transparent',
        '& > *': {
            opacity: ({ scaleIndex }: any) => 1 - 2 * scaleIndex / 10,
        },
    },
    container: {
        padding: '14px 20px',
        maxHeight: 128,
        '&:hover': {
            opacity: 1
        }
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
    },
    credentials: {
        fontFamily: 'Source Sans Pro SemiBold'
    },
    textContainer: {
        padding: '8px 0 8px 16px'
    },
    credsContainer: {
        minWidth: 280
    },
    dividerVertical: {
        minHeight: 100
    },
    // realizationTitle: {
    //     paddingTop: theme.typography.pxToRem(15)
    // }
});

interface IProps extends WithStyles<typeof styles> {
    user: IUser;
    index: number;
    scaleIndex: number;
    positions?: Map<number, IPosition>;
    historyGoTo?: (userId: number) => void;
}

@inject(({
    appState: {
        departmentsStore: {
            positions
        },
        userStore: {
            historyGoTo
        }
    }
}) => ({
    positions,
    historyGoTo
}))
@observer
class ProfilePreview extends Component<IProps> {
    @observable applyOffset: boolean = false;
    @observable isHovered: boolean = false;

    @computed
    get realizationPercent(): number {
        return 65;
    }

    @computed
    get userName(): string {
        return this.props.user
            ? this.props.user.name
            : '';
    }

    @computed
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

    @computed
    get avatarProps(): any {
        const { user } = this.props;

        if (!user) return {};

        return user.avatar
        ? { src: user.avatar }
        : { children: this.userName[0] };
    }

    @computed
    get left(): number {
        const { index } = this.props;

        const initialOffset = index === 0
            ? 0
            : (index - 1) * 50;

        return this.applyOffset
            ? index * 50
            : initialOffset;
    }

    @computed
    get paddingRight(): number {
        const { index } = this.props;

        const initialOffset = index === 0
            ? 0
            : (index - 1) * 50;

        return this.applyOffset
            ? index * 50
            : initialOffset;
    }

    @computed
    get elevation(): number {
        if (this.props.scaleIndex === 0) return 0;
        return this.isHovered
            ? 10
            : 0;
    }

    @computed
    get userRole(): USER_ROLE {
        const { user: { position } } = this.props;
        return position;
    }

    clickHandler = () => {
        const { historyGoTo, scaleIndex, user: { id } } = this.props;
        if (scaleIndex === 0) return;
        historyGoTo(id);
    }

    mouseOverHandler = () => {
        this.isHovered = true;
    }

    mouserOutHandler = () => {
        this.isHovered = false;
    }

    componentDidMount() {
        this.applyOffset = true;
    }

    render() {
        const { classes, user: { doctorsCount, pharmacyCount } } = this.props;

        return (
            <div
                className={classes.backface}
                style={{
                    left: this.left,
                    paddingRight: this.paddingRight
                }}>
                <Grid
                    onClick={this.clickHandler}
                    onMouseEnter={this.mouseOverHandler}
                    onMouseLeave={this.mouserOutHandler}
                    elevation={this.elevation}
                    component={Paper}
                    className={cx(classes.container)}
                    justify='center'
                    container>

                    <Grid
                        // xs={12}
                        sm={4}
                        // md={3}
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

                    {
                        this.userRole !== USER_ROLE.FIELD_FORCE_MANAGER &&
                        <>
                            <Hidden xsDown>
                                <Divider className={classes.dividerVertical} orientation='vertical' />
                            </Hidden>
                            <Grid
                                sm={2}
                                className={cx(classes.gridContainer, classes.textContainer)}
                                justify='space-around'
                                direction='column'
                                container
                                zeroMinWidth
                                item>
                                <Typography>
                                    region
                                </Typography>
                                <Typography>
                                    value
                                </Typography>
                            </Grid>
                        </>
                    }

                    <Hidden xsDown>
                        <Divider className={classes.dividerVertical} orientation='vertical' />
                    </Hidden>

                    <Grid
                        // xs={12}
                        sm={2}
                        // md
                        className={cx(classes.gridContainer, classes.textContainer)}
                        justify='space-around'
                        direction='column'
                        container
                        zeroMinWidth
                        item>
                            <Typography>
                                Докторів
                            </Typography>
                            <Typography>
                                { doctorsCount === null ? '-' : doctorsCount }
                            </Typography>
                    </Grid>

                    <Hidden smDown>
                        <Divider className={classes.dividerVertical} orientation='vertical' />
                    </Hidden>

                    <Grid
                        // xs={12}
                        sm
                        className={cx(classes.gridContainer, classes.textContainer)}
                        justify='space-around'
                        direction='column'
                        container
                        item>
                            <Typography>
                                ЛПУ/Aптеки
                            </Typography>
                            <Typography>
                                { pharmacyCount === null ? '-' : pharmacyCount }
                            </Typography>
                        {/* actions */}
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(ProfilePreview);
