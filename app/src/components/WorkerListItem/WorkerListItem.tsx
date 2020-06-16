import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    Grid,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    IconButton,
    Avatar,
    Typography,
    ListItem
} from '@material-ui/core';
import { KeyboardArrowDown, PermIdentity } from '@material-ui/icons';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { NotInterested, Edit } from '@material-ui/icons';
import { isValid, lightFormat } from 'date-fns';
import vacancyIcon from '../../../assets/icons/vacancyIcon.png';
import { computed, observable, toJS } from 'mobx';
import { IPosition } from '../../interfaces/IPosition';
import { IWorker } from '../../interfaces/IWorker';
import { IUser, IUserCommonInfo } from '../../interfaces/IUser';
import { multiDepartmentRoles, USER_ROLE } from '../../constants/Roles';
import { ILocation } from '../../interfaces/ILocation';
import { uaMonthsNames } from '../DateTimeUtils/DateTimeUtils';
import cx from 'classnames';
import ImageLoader from '../ImageLoader';
import Config from '../../../Config';
import { IDeletePopoverSettings } from '../../stores/UIStore';
import Snackbar from '../Snackbar';
import { SNACKBAR_TYPE } from '../../constants/Snackbars';
import { IWithRestriction } from '../../interfaces';
import { withRestriction } from '../hoc/withRestriction';
import { PERMISSIONS } from '../../constants/Permissions';
import DeleteButton from './DeleteButton';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { IExpandedWorker } from '../../stores/DepartmentsStore';
import { DOCTORS_ROUTE } from '../../constants/Router';

const styles = (theme: any) => createStyles({
    root: {
        width: '100%',
        marginBottom: 2,
        '&:before': {
            content: 'none'
        },
        '& p': {
            // cursor: 'text !important',
            userSelect: 'all',
            paddingLeft: 5,
            textOverflow: 'ellipsis',
            overflow: 'hidden'
        }
    },
    expanded: {
        marginTop: '0 !important'
    },
    avatar: {
        width: 32,
        height: 32
    },
    img: {
        objectFit: 'cover'
    },
    image: {
        width: 20,
        height: 20
    },
    summaryContent: {
        alignItems: 'stretch',
        margin: 0,
        order: 1,
        '&.Mui-expanded': {
            margin: 0,
        }
    },
    expandIcon: {
        order: 0,
        padding: 6,
        margin: 0
    },
    summaryRoot: {
        padding: 0,
        minHeight: '48px !important',
        border: ({ worker: { isVacancy } }: any) => isVacancy
            ? '1px solid #f3ca47'
            : '1px solid transparent',
    },
    iconButton: {
        borderRadius: 2
    },
    gridItem: {
        overflow: 'hidden',
        borderRadius: 2,
        transition: '0.3s',
        '&:first-of-type:hover': {
            backgroundColor: ({ disableClick }: any) => disableClick
                ? 'transparent'
                : '#f1f1f1'
        }
    },
    details: {
        padding: '8px 0 24px 32px',
        backgroundColor: '#f5f5f5'
    },
    actions: {
        width: 88
    },
    placeholderImage: {
        margin: '8px 6px 8px 10px'
    },
    colorGreen: {
        color: theme.palette.primary.green.main
    },
    nameCell: {},
    locationCell: {},
    dateCell: {},
    emailCell: {},
    phoneCell: {},
    cardCell: {},
});

interface IProps extends WithStyles<typeof styles>, IWithRestriction {
    worker: IWorker;
    expandedWorker: IExpandedWorker;
    fired: boolean;
    editClickHandler: (worker: IWorker) => void;

    deleteHandler?: (removed: boolean) => void;
    expandable?: boolean;
    children?: any;
    isExpanded?: boolean;
    expandChangeHandler?: (e: any, expanded: boolean) => void;
    historyPushUser?: (worker: IUserCommonInfo, role: USER_ROLE) => void;
    userLocation?: ILocation;
    position?: IPosition;
    disableClick?: boolean;
    openDelPopper?: (settings: IDeletePopoverSettings) => void;
    removeWorker?: (worker: IWorker) => boolean;
    loadCurrentFFM?: () => any;
    getUser?: (userId: number) => IUser;
    historyReplace?: (users: IUser[]) => void;
}

@inject(({
             appState: {
                 userStore: {
                     historyPushUser,
                     historyReplace,
                     getUser
                 },
                 uiStore: {
                     openDelPopper
                 },
                 departmentsStore: {
                     removeWorker,
                     expandedWorker,
                     loadCurrentFFM
                 }
             }
         }) => ({
    historyPushUser,
    historyReplace,
    openDelPopper,
    removeWorker,
    expandedWorker,
    loadCurrentFFM,
    getUser
}))
@withRestriction([PERMISSIONS.EDIT_USER])
@observer
class WorkerListItem extends Component<IProps> {
    readonly dateFormat: string = 'dd MMM yyyy';

    @computed
    get userLocation(): string {
        const { userLocation } = this.props;
        return userLocation
            ? userLocation.name
            : null;
    }

    @computed
    get position(): string {
        const { position } = this.props;

        return position
            ? position.name
            : null;
    }

    @computed
    get date(): string {
        const {
            worker: { hired, fired, isVacancy, created },
            fired: isFired
        } = this.props;

        const emptyPlaceholder = isFired
            ? '...'
            : '-';

        if (isVacancy) {
            const isDateValid = isValid(created);
            const month = isDateValid
                ? `${uaMonthsNames[created.getMonth()].slice(0, 3)} `
                : '';
            const formatted = isDateValid
                ? lightFormat(created, `dd '${month}'yyyy`)
                : '';
            return formatted;
        }

        const isHiredDateValid = isValid(hired);
        const monthOfHiring = isHiredDateValid
            ? `${uaMonthsNames[hired.getMonth()].slice(0, 3)} `
            : '';

        const from = isHiredDateValid
            ? lightFormat(hired, `dd '${monthOfHiring}'yyyy`)
            : emptyPlaceholder;

        if (isFired) {
            const isFiredDateValid = isValid(fired);
            const monthOfFired = isFiredDateValid
                ? `${uaMonthsNames[fired.getMonth()].slice(0, 3)} `
                : '';
            const to = isFiredDateValid
                ? lightFormat(fired, `dd '${monthOfFired}'yyyy`)
                : emptyPlaceholder;

            return `${from} - ${to}`;
        }

        return from;
    }

    delClickCallback = async (confirmed: boolean) => {
        const { worker, openDelPopper, removeWorker, deleteHandler } = this.props;
        openDelPopper(null);
        if (!confirmed) return;
        const workerRemoved = await removeWorker(worker);
        deleteHandler(workerRemoved);
    }

    removeClickHandler = (e: any) => {
        e.stopPropagation();
        const { currentTarget } = e;
        this.props.openDelPopper({
            anchorEl: currentTarget,
            callback: this.delClickCallback,
            name: 'deleteWorker'
        });
    }

    editClickHandler = (e: any) => {
        e.stopPropagation();
        const { editClickHandler, worker } = this.props;
        editClickHandler(worker);
    }

    workerClickHandler = async (e: any) => {
        const {
            getUser,
            historyPushUser,
            historyReplace,
            disableClick,
            expandedWorker,
            loadCurrentFFM,
            worker,
            worker: { id, name, image, position }
        } = this.props;
        if (disableClick) return;
        e.stopPropagation();
        const ffm = await loadCurrentFFM();
        const rm = expandedWorker ? expandedWorker.id : null;

        const presets: any = {
            [USER_ROLE.FIELD_FORCE_MANAGER]: [ffm[0].id],
            [USER_ROLE.REGIONAL_MANAGER]: [ffm[0].id, worker.id],
            [USER_ROLE.MEDICAL_AGENT]: [ffm[0].id, rm, worker.id],
        };
        const targetRoles = presets[worker.position];
        if (worker.position === USER_ROLE.MEDICAL_AGENT && !rm) {
            historyPushUser({
                id,
                name,
                image,
                region: null,
                city: null
            }, position);
        } else {
            const promises = targetRoles.map((x: number) => getUser(x));
            const loadedUsers: IUser[] = await Promise.all(promises);
            const filtered = loadedUsers.filter(x => !!x);

            const newUserHistory = multiDepartmentRoles.includes(worker.position)
                ? filtered : [...filtered];
            historyReplace(newUserHistory);
        }
    }

    render() {
        const {
            classes,
            children,
            position,
            fired,
            expandable,
            expandChangeHandler,
            isExpanded,
            isAllowed,
            worker: {
                id,
                image,
                name,
                hired,
                email,
                mobilePhone,
                workPhone,
                card,
                isVacancy,
            }
        } = this.props;
        return (
            <ExpansionPanel
                onChange={expandChangeHandler}
                expanded={isExpanded}
                elevation={0}
                TransitionProps={{
                    mountOnEnter: true,
                    unmountOnExit: true
                }}
                classes={{
                    root: classes.root,
                    expanded: classes.expanded
                }}>
                <ExpansionPanelSummary
                    expandIcon={expandable && <KeyboardArrowDown fontSize='small'/>}
                    classes={{
                        content: classes.summaryContent,
                        root: classes.summaryRoot,
                        expandIcon: classes.expandIcon
                    }}>
                    <Grid
                        xs={3}
                        onClick={!fired && this.workerClickHandler}
                        className={cx(classes.gridItem, classes.nameCell)}
                        wrap='nowrap'
                        alignItems='center'
                        zeroMinWidth
                        container
                        item>
                        <ImageLoader
                            classes={{}}
                            className={classes.avatar}
                            component={Avatar}
                            componentProps={{
                                classes: {
                                    root: classes.avatar,
                                    img: cx({ [classes.image]: isVacancy }, classes.img)
                                }
                            }}
                            src={
                                isVacancy
                                    ? vacancyIcon
                                    : `${Config.ASSETS_URL}/${image}`
                            }
                            loadPlaceholder={<PermIdentity className={classes.placeholderImage} fontSize='small'/>}
                        />
                        <Typography variant='body2'>
                            {name}
                        </Typography>
                    </Grid>
                    <Grid xs className={cx(classes.gridItem, classes.locationCell)} alignItems='center' container
                          zeroMinWidth item>
                        <Typography variant='body2'>
                            {this.userLocation || this.position || '-'}
                        </Typography>
                    </Grid>
                    <Grid xs={fired ? 2 : true} className={cx(classes.gridItem, classes.dateCell)} alignItems='center'
                          zeroMinWidth container item>
                        <Typography variant='body2'>
                            {this.date}
                        </Typography>
                    </Grid>
                    <Grid xs className={cx(classes.gridItem, classes.emailCell)} alignItems='center' zeroMinWidth
                          container item>
                        <Typography variant='body2'>
                            {email}
                        </Typography>
                    </Grid>
                    <Grid xs className={cx(classes.gridItem, classes.phoneCell)} direction='column' justify='center'
                          alignItems='flex-start' zeroMinWidth container item>
                        {
                            workPhone &&
                            <Typography variant='body2'>
                                {workPhone}
                            </Typography>
                        }
                        {
                            mobilePhone &&
                            <Typography variant='body2'>
                                {mobilePhone}
                            </Typography>
                        }
                    </Grid>
                    <Grid xs className={cx(classes.gridItem, classes.cardCell)} alignItems='center' zeroMinWidth
                          container item>
                        <Typography variant='body2'>
                            {card}
                        </Typography>
                    </Grid>

                    <Grid justify='flex-end' className={classes.actions} alignItems='center' container>
                        {
                            fired === false &&
                            <>
                                {
                                    isAllowed &&
                                    <IconButton
                                        onClick={this.editClickHandler}
                                        className={cx(classes.iconButton, classes.colorGreen)}>
                                        <EditOutlinedIcon fontSize='small'/>
                                    </IconButton>
                                }
                                {
                                    isVacancy === false &&
                                    <DeleteButton
                                        workerId={id}
                                        className={classes.iconButton}
                                        onClick={this.removeClickHandler}
                                    />
                                }
                            </>
                        }
                    </Grid>
                </ExpansionPanelSummary>
                {
                    children &&
                    <ExpansionPanelDetails className={classes.details}>
                        {children}
                    </ExpansionPanelDetails>
                }
            </ExpansionPanel>
        );
    }
}

export default withStyles(styles)(WorkerListItem);
