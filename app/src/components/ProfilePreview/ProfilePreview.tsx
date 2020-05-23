import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    Grid,
    Typography,
    Divider,
    Hidden,
    Paper,
    IconButton
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { observable, computed, toJS } from 'mobx';
import cx from 'classnames';
import { IUser } from '../../interfaces';
import { USER_ROLE } from '../../constants/Roles';
import { ILocation } from '../../interfaces/ILocation';
import UserShortInfo from '../UserShortInfo';
import MailOutlineOutlinedIcon from '@material-ui/icons/MailOutlineOutlined';
import CreditCardOutlinedIcon from '@material-ui/icons/CreditCardOutlined';
import InfoWindow from '../../components/InfoWindow';
import { EDIT_WORKER_MODAL } from '../../constants/Modals';
import { IPosition } from '../../interfaces/IPosition';
import copy from 'clipboard-copy';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import DeleteButton from './DeleteButton';

import Phone from '-!react-svg-loader!../../../assets/icons/phone.svg';
import Edit from '-!react-svg-loader!../../../assets/icons/edit.svg';

const styles = (theme: any) => createStyles({
    backface: {
        position: ({ scaleIndex }: any) => scaleIndex === 0 ? 'relative' : 'absolute',
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
        margin: 10,
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
    },
    container: {
        padding: '14px 20px',
        '&:hover': {
            opacity: 1
        },
    },
    gridContainer: {
        padding: '8px 0',
        '&:not(:first-of-type)': {
            alignItems: 'center',
        },
        [theme.breakpoints.up('sm')]: {
            padding: '0 8px',
            '&:first-of-type': {
                paddingLeft: 0
            },
        },
        [theme.breakpoints.down('xs')]: {
            justifyContent: 'center'
        }
    },
    textContainer: {
        padding: '0 8px'
    },
    credsContainer: {
        minWidth: 390,
        [theme.breakpoints.down('sm')]: {
            minWidth: 280,
        }
    },
    profileTextContainer: {
        justifyContent: 'flex-start'
    },
    text: {
        textAlign: 'center',
        marginTop: 8,
        wordBreak: 'break-word'
    },
    depositPlus: {
        fontFamily: 'Source Sans Pro SemiBold',
        color: '#25D174',
    },
    depositMinus: {
        fontFamily: 'Source Sans Pro SemiBold',
        color: '#E25353',
    },
    windowContent: {
        padding: 10
    }
});

interface IProps extends WithStyles<typeof styles> {
    user: IUser;
    index: number;
    scaleIndex: number;
    cities?: Map<number, ILocation>;
    regions?: Map<number, ILocation>;
    positions?: Map<number, IPosition>;
    historyGoTo?: (userId: number) => void;
    openModal?: (modalName: string, payload: any) => void;
    previewUser?: IUser;
}

@inject(({
    appState: {
        departmentsStore: {
            positions,
            cities,
            regions
        },
        userStore: {
            historyGoTo,
            previewUser
        },
        uiStore: {
            openModal
        }
    }
}) => ({
    historyGoTo,
    positions,
    cities,
    regions,
    openModal,
    previewUser
}))
@observer
class ProfilePreview extends Component<IProps> {
    @observable applyOffset: boolean = false;
    @observable isHovered: boolean = false;
    @observable extraButton: any = {
        edit: true,
        delete: true
    };

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

    get hideExtraBlock(): boolean {
        return this.extraButton.edit === false
            && this.extraButton.delete === false;
    }

    extraButtonsOnMountCallback = (type: 'edit' | 'delete', isHidden: boolean) => {
        this.extraButton[type] = !isHidden;
    }

    clickHandler = () => {
        const { historyGoTo, scaleIndex, user: { id } } = this.props;
        if (scaleIndex === 0) return;
        historyGoTo(id);
    }

    editClickHandler = () => {
        const { user, openModal, positions } = this.props;
        openModal(EDIT_WORKER_MODAL, {
            initialWorker: user,
            positions: [positions.get(user.position)]
        });
    }

    removeUserClickHandler = () => {
        console.log('should remove user');
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

    copyInfo = (data: any) => {
        copy(data);
    }

    render() {
        const { classes, user, previewUser } = this.props;
        const {
            doctorsCount,
            pharmacyCount,
            depositMinus,
            depositPlus,
            lpuCount,
            id
        } = user;

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
                    wrap='nowrap'
                    container>

                    <Grid
                        className={cx(classes.gridContainer, classes.credsContainer)}
                        wrap='nowrap'
                        container
                        item>
                        <UserShortInfo
                            classes={{
                                textContainer: classes.profileTextContainer
                            }}
                            user={user}/>
                    </Grid>

                    {
                        this.userRole !== USER_ROLE.FIELD_FORCE_MANAGER &&
                        <>
                            <Hidden xsDown>
                                <Divider flexItem orientation='vertical'/>
                            </Hidden>
                            <Grid
                                className={cx(classes.gridContainer, classes.textContainer)}
                                direction='column'
                                container
                                zeroMinWidth
                                item>
                                {
                                    this.userRole === USER_ROLE.REGIONAL_MANAGER &&
                                    <>
                                        <Typography className={classes.text}>
                                            Регіон
                                        </Typography>
                                        <Typography className={classes.text}>
                                            {this.region}
                                        </Typography>
                                    </>
                                }
                                {
                                    this.userRole === USER_ROLE.MEDICAL_AGENT &&
                                    <>
                                        <Typography className={classes.text}>
                                            {this.region}
                                        </Typography>
                                        <Typography className={classes.text}>
                                            {this.city}
                                        </Typography>
                                    </>
                                }

                            </Grid>
                        </>
                    }

                    <Hidden xsDown>
                        <Divider flexItem orientation='vertical'/>
                    </Hidden>

                    <Grid
                        className={cx(classes.gridContainer, classes.textContainer)}
                        direction='column'
                        container
                        zeroMinWidth
                        item>
                        <Typography className={classes.text}>
                            Лікарів
                        </Typography>
                        <Typography className={classes.text}>
                            {doctorsCount === null ? '-' : doctorsCount}
                        </Typography>
                    </Grid>

                    <Hidden xsDown>
                        <Divider flexItem orientation='vertical'/>
                    </Hidden>

                    <Grid
                        className={cx(classes.gridContainer, classes.textContainer)}
                        direction='column'
                        container
                        item>
                        <Typography className={classes.text}>
                            ЛПУ
                        </Typography>
                        <Typography className={classes.text}>
                            {lpuCount === null ? '-' : lpuCount}
                        </Typography>
                    </Grid>

                    <Hidden xsDown>
                        <Divider flexItem orientation='vertical'/>
                    </Hidden>

                    <Grid
                        className={cx(classes.gridContainer, classes.textContainer)}
                        direction='column'
                        container
                        item>
                        <Typography className={classes.text}>
                            Аптеки
                        </Typography>
                        <Typography className={classes.text}>
                            {pharmacyCount === null ? '-' : pharmacyCount}
                        </Typography>
                    </Grid>
                    {
                        this.userRole === USER_ROLE.FIELD_FORCE_MANAGER &&
                        <>
                            <Hidden xsDown>
                                <Divider flexItem orientation='vertical'/>
                            </Hidden>
                            <Grid
                                className={cx(classes.gridContainer, classes.textContainer)}
                                wrap='nowrap'
                                direction='column'
                                container
                                item>
                                <Typography className={classes.text}>
                                    Депозити
                                </Typography>
                                <Typography className={cx(classes.text, classes.depositPlus)}>
                                    {depositPlus || 0}
                                </Typography>
                                <Typography className={cx(classes.text, classes.depositMinus)}>
                                    {depositMinus || 0}
                                </Typography>
                            </Grid>
                        </>
                    }

                    <Hidden xsDown>
                        <Divider flexItem orientation='vertical'/>
                    </Hidden>

                    <Grid className={cx(classes.gridContainer, classes.textContainer)}
                          direction='column'
                          container
                          item>
                        <InfoWindow icon={<Phone/>}>
                            {previewUser.mobilePhone ?
                            <Grid className={classes.windowContent} wrap='nowrap' container>
                                <Grid direction='column' item container>
                                    <Typography> Телефон </Typography>
                                    <Typography> {previewUser.mobilePhone} </Typography>
                                </Grid>
                                <Grid container alignItems='center' item>
                                    <IconButton onClick={() => this.copyInfo(previewUser.mobilePhone)}>
                                        <FileCopyOutlinedIcon/>
                                    </IconButton>
                                </Grid>
                            </Grid>
                            :
                            <Grid className={classes.windowContent} container>
                                Дані відсутні
                            </Grid>}
                        </InfoWindow>

                        <InfoWindow icon={<MailOutlineOutlinedIcon/>}>
                            {previewUser.email ?
                                <Grid className={classes.windowContent} wrap='nowrap' container>
                                    <Grid direction='column' container>
                                        <Typography> Поштова скринька </Typography>
                                        <Typography> {previewUser.email} </Typography>
                                    </Grid>
                                    <Grid container alignItems='center' item>
                                        <IconButton onClick={() => this.copyInfo(previewUser.email)}>
                                            <FileCopyOutlinedIcon/>
                                        </IconButton>
                                    </Grid>
                                </Grid> :
                                <Grid className={classes.windowContent} container>
                                    Дані відсутні
                                </Grid>}
                        </InfoWindow>

                        <InfoWindow icon={<CreditCardOutlinedIcon/>}>
                            {previewUser.bankCard ?
                            <Grid className={classes.windowContent} wrap='nowrap' container>
                                <Grid direction='column' container>
                                    <Typography> Банківська картка </Typography>
                                    <Typography> {previewUser.bankCard} </Typography>
                                </Grid>
                                <Grid container alignItems='center' item>
                                    <IconButton onClick={() => this.copyInfo(previewUser.bankCard)}>
                                        <FileCopyOutlinedIcon/>
                                    </IconButton>
                                </Grid>
                            </Grid>
                            :
                            <Grid className={classes.windowContent} container>
                                Дані відсутні
                            </Grid>}
                        </InfoWindow>
                    </Grid>

                    {
                        this.hideExtraBlock === false &&
                        <>
                            <Hidden xsDown>
                                <Divider flexItem orientation='vertical'/>
                            </Hidden>
                            <Grid className={cx(classes.gridContainer, classes.textContainer)}
                                direction='column'
                                justify='center'
                                container
                                item>
                                <IconButton onClick={this.editClickHandler}>
                                    <Edit/>
                                </IconButton>
                                    <DeleteButton
                                        id={id}
                                        onClick={this.removeUserClickHandler}
                                        onMountCallback={this.extraButtonsOnMountCallback}
                                    />
                            </Grid>
                        </>
                    }
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(ProfilePreview);
