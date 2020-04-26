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
import { ILocation } from '../../interfaces/ILocation';
import Level from './Level';
import UserShortInfo from '../UserShortInfo';

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
    textContainer: {
        padding: '8px 0 8px 16px'
    },
    credsContainer: {
        minWidth: 300
    },
    dividerVertical: {
        minHeight: 100
    }
});

interface IProps extends WithStyles<typeof styles> {
    user: IUser;
    index: number;
    scaleIndex: number;
    cities?: Map<number, ILocation>;
    regions?: Map<number, ILocation>;
    historyGoTo?: (userId: number) => void;
}

@inject(({
    appState: {
        departmentsStore: {
            cities,
            regions
        },
        userStore: {
            historyGoTo
        }
    }
}) => ({
    historyGoTo,
    cities,
    regions
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
    get region(): string {
        const { regions, user: { region } } = this.props;
        const userRegion = regions.get(region);
        return userRegion
            ? userRegion.name
            : '-';
    }

    @computed
    get city(): string {
        const { cities, user: { city } } = this.props;
        const userCity = cities.get(city);
        return userCity
            ? userCity.name
            : '-';
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
        const { classes, user } = this.props;
        const { doctorsCount, pharmacyCount } = user;

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
                        xs={4}
                        className={cx(classes.gridContainer, classes.credsContainer)}
                        wrap='nowrap'
                        container
                        item>
                            <UserShortInfo user={user} />
                    </Grid>

                    {
                        this.userRole !== USER_ROLE.FIELD_FORCE_MANAGER &&
                        <>
                            <Hidden xsDown>
                                <Divider className={classes.dividerVertical} orientation='vertical' />
                            </Hidden>
                            <Grid
                                xs={2}
                                className={cx(classes.gridContainer, classes.textContainer)}
                                justify='space-around'
                                direction='column'
                                container
                                zeroMinWidth
                                item>
                                    {
                                        this.userRole === USER_ROLE.REGIONAL_MANAGER &&
                                        <>
                                            <Typography>
                                                Регіон
                                            </Typography>
                                            <Typography>
                                                { this.region }
                                            </Typography>
                                        </>
                                    }
                                    {
                                        this.userRole === USER_ROLE.MEDICAL_AGENT &&
                                        <>
                                            <Typography>
                                                { this.region }
                                            </Typography>
                                            <Typography>
                                                { this.city }
                                            </Typography>
                                        </>
                                    }

                            </Grid>
                        </>
                    }

                    <Hidden xsDown>
                        <Divider className={classes.dividerVertical} orientation='vertical' />
                    </Hidden>

                    <Grid
                        xs={2}
                        className={cx(classes.gridContainer, classes.textContainer)}
                        justify='space-around'
                        direction='column'
                        container
                        zeroMinWidth
                        item>
                            <Typography>
                                Лікарів
                            </Typography>
                            <Typography>
                                { doctorsCount === null ? '-' : doctorsCount }
                            </Typography>
                    </Grid>

                    <Hidden smDown>
                        <Divider className={classes.dividerVertical} orientation='vertical' />
                    </Hidden>

                    <Grid
                        xs
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
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(ProfilePreview);
