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
    Typography
} from '@material-ui/core';
import { KeyboardArrowDown, PermIdentity } from '@material-ui/icons';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IWorker } from '../../../interfaces/IWorker';
import { NotInterested, Edit } from '@material-ui/icons';
import { isValid, lightFormat } from 'date-fns';
import ImageLoader from '../../../components/ImageLoader';
import { IPosition } from '../../../interfaces/IPosition';
import { uaMonthsNames } from '../../Sales/DateTimeUtils/DateTimeUtils';
import vacancyIcon from '../../../../assets/icons/vacancyIcon.png';
import { IUserCommonInfo } from '../../../interfaces/IUser';
import { USER_ROLE } from '../../../constants/Roles';
import { ILocation } from '../../../interfaces/ILocation';

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
        border: ({ worker: { isVacancy }}: any) => isVacancy
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
            backgroundColor: ( {worker: { isVacancy }}: any) => isVacancy
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
    }
});

interface IProps extends WithStyles<typeof styles> {
    position: IPosition;
    worker: IWorker;
    fired: boolean;
    expandable?: boolean;
    children?: any;
    isExpanded?: boolean;
    expandChangeHandler?: (e: any, expanded: boolean) => void;
    loadUserInfo?: (worker: IUserCommonInfo, role: USER_ROLE) => void;
    location: ILocation;
}

@inject(({
    appState: {
        userStore: {
            loadUserInfo
        }
    }
}) => ({
    loadUserInfo
}))
@observer
class ListItem extends Component<IProps> {
    readonly dateFormat: string = 'dd MMM yyyy';

    get location(): string {
        const { location } = this.props;
        return location
            ? location.name
            : '-';
    }

    get date(): string {
        const {
            worker: { hired, fired },
            fired: isFired
        } = this.props;

        const emptyPlaceholder = isFired
            ? '...'
            : '-';

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

    workerClickHandler = (e: any) => {
        const { loadUserInfo, worker : { id, name, avatar, position, isVacancy }} = this.props;
        if (isVacancy) return;
        e.stopPropagation();
        loadUserInfo({
            id,
            name,
            avatar,
            region: null,
            city: null
        }, position);
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
            worker: {
                avatar,
                name,
                hired,
                email,
                mobilePhone,
                workPhone,
                card,
                isVacancy
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
                    expandIcon={expandable && <KeyboardArrowDown fontSize='small' />}
                    classes={{
                        content: classes.summaryContent,
                        root: classes.summaryRoot,
                        expandIcon: classes.expandIcon
                    }}>
                    <Grid
                        xs={3}
                        onClick={this.workerClickHandler}
                        className={classes.gridItem}
                        wrap='nowrap'
                        alignItems='center'
                        zeroMinWidth
                        container
                        item>
                        <ImageLoader
                            className={classes.avatar}
                            component={Avatar}
                            componentProps={{
                                classes: {
                                    root: classes.avatar,
                                    img: (isVacancy
                                    ? classes.image
                                    : classes.avatar)
                                }
                            }}
                            src={
                                isVacancy
                                    ? vacancyIcon
                                    : avatar
                            }
                            loadPlaceholder={<PermIdentity className={classes.placeholderImage} fontSize='small' />}
                        />
                        <Typography variant='body2'>
                            {name}
                        </Typography>
                    </Grid>
                    <Grid xs className={classes.gridItem} alignItems='center' container zeroMinWidth item>
                        <Typography variant='body2'>
                            { this.location }
                        </Typography>
                    </Grid>
                    <Grid xs={fired ? 2 : true} className={classes.gridItem} alignItems='center' zeroMinWidth container item>
                        <Typography variant='body2'>
                            {this.date}
                        </Typography>
                    </Grid>
                    <Grid xs className={classes.gridItem} alignItems='center' zeroMinWidth container item>
                        <Typography variant='body2'>
                            {email}
                        </Typography>
                    </Grid>
                    <Grid xs className={classes.gridItem} direction='column' justify='center' alignItems='flex-start' zeroMinWidth container item>
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
                    <Grid xs className={classes.gridItem} alignItems='center' zeroMinWidth container item>
                        <Typography variant='body2'>
                            {card}
                        </Typography>
                    </Grid>

                    <Grid justify='flex-end' className={classes.actions} alignItems='center' container>
                        {
                            fired === false &&
                            <>
                                {
                                    isVacancy === false &&
                                    <IconButton className={classes.iconButton}>
                                        <NotInterested fontSize='small' />
                                    </IconButton>
                                }
                                <IconButton className={classes.iconButton}>
                                    <Edit fontSize='small' />
                                </IconButton>
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

export default withStyles(styles)(ListItem);
