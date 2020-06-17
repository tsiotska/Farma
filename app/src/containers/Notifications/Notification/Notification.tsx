import React, { Component } from 'react';
import { createStyles, Divider, Grid, Paper, Typography, WithStyles, withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { INotification } from '../../../interfaces/iNotification';
import { IDepartment } from '../../../interfaces/IDepartment';
import { computed, toJS } from 'mobx';
import Config from '../../../../Config';
import UserShortInfo from '../../../components/UserShortInfo';
import cx from 'classnames';
import { NOTIFICATIONS_TYPE } from '../../../constants/NotificationsType';
import DoctorPanel from './DoctorPanel';
import HCFPanel from './HCFPanel';
import UserPanel from './UserPanel';
import Settings from '-!react-svg-loader!../../../../assets/icons/settings.svg';
import { isValid, lightFormat, format } from 'date-fns';
import { uaMonthsNames } from '../../../components/DateTimeUtils/DateTimeUtils';
import eoLocale from 'date-fns/locale/eo';

const styles = (theme: any) => createStyles({
    root: {
        margin: '8px 0',
        display: 'flex',
        flexDirection: 'column'
    },
    row: {
        padding: '0 8px',
    },
    titleRow: {
        borderBottom: '1px solid #e2e2e2'
    },
    subjectRow: {
        backgroundColor: '#fafbfc',
        overflow: 'hidden'
    },
    icon: {
        width: 36,
        height: 36,
    },
    divider: {
        backgroundColor: '#e2e2e2',
        margin: '0 16px'
    },
    userTextContainer: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        padding: '8px 0 8px 8px'
    },
    textSemiBold: {
        fontFamily: 'Source Sans Pro SemiBold'
    },
    text: {
        fontSize: '14px',
        fontFamily: 'Source Sans Pro',
        color: theme.palette.primary.gray.mainLight
    },
    date: {
        marginLeft: 'auto',
        paddingRight: 20
    }
});

interface IProps extends WithStyles<typeof styles> {
    notification: INotification;
    departments?: IDepartment[];

    acceptNotification?: (type: string, id: number) => void;
    deleteClickHandler?: (currentTarget: any, type: string, id: number) => void;
    returnNotification?: (type: string, id: number) => void;
}

@inject(({
             appState: {
                 departmentsStore: {
                     departments,
                 }
             }
         }) => ({
    departments,
}))
@observer
class Notification extends Component<IProps> {
    timeout: any = null;

    @computed
    get iconSrc(): string {
        const { departments, notification: { department } } = this.props;
        const currentDep = departments.find(({ id }) => id === department);
        return currentDep
            ? currentDep.image
            : null;
    }

    @computed
    get date(): string {
        const { notification: { date } } = this.props;
        const isDateValid = isValid(date);
        const month = isDateValid
            ? `${uaMonthsNames[date.getMonth()].slice(0, 3)} `
            : '';
        return isDateValid
            ? format(date, `dd '${month}'yyyy HH:mm`, {locale: eoLocale})
            : '';
    }

    render() {
        const {
            classes, notification: { type, action, user, message, payload, date },
            deleteClickHandler, acceptNotification, returnNotification
        } = this.props;
        return (
            <Paper className={classes.root}>
                <Grid className={cx(classes.row, classes.titleRow)} alignItems='center' container>
                    {
                        this.iconSrc
                            ? <Grid  alignItems='center' item>
                                <img src={`${Config.ASSETS_URL}/${this.iconSrc}`} className={classes.icon}/>
                            </Grid>
                            : <Grid  alignItems='center' item>
                                <Settings className={classes.icon}/>
                            </Grid>
                    }
                    <Divider className={classes.divider} orientation='vertical'/>
                    <Grid xs={4} wrap='nowrap' alignItems='center' zeroMinWidth container item>
                        {
                            typeof user === 'object' &&
                            <UserShortInfo
                                classes={{
                                    avatar: classes.icon,
                                    textContainer: classes.userTextContainer,
                                    credentials: classes.text,
                                    position: classes.text,
                                }}
                                user={user}
                                disableClick
                                hideLevel
                            />
                        }
                    </Grid>
                    <Divider className={classes.divider} orientation='vertical'/>
                    <Grid xs container item>
                        <Typography variant='body2' className={classes.textSemiBold}>
                            {message}
                        </Typography>
                    </Grid>
                    {date &&
                    <Grid xs container item>
                        <Typography variant='body2' className={cx(classes.textSemiBold, classes.date)}>
                            {this.date}
                        </Typography>
                    </Grid>
                    }
                </Grid>
                {
                    payload &&
                    <Grid className={cx(classes.row, classes.subjectRow)} alignItems='center' container>
                        {type === NOTIFICATIONS_TYPE.AGENT &&
                        <DoctorPanel
                            doctor={payload}
                            action={action}
                            type='agent'
                            acceptNotification={acceptNotification}
                            returnNotification={returnNotification}
                            deleteClickHandler={deleteClickHandler}
                        />}
                        {type === NOTIFICATIONS_TYPE.HCF &&
                        <HCFPanel
                            hcf={payload}
                            action={action}
                            type='hcf'
                            acceptNotification={acceptNotification}
                            returnNotification={returnNotification}
                            deleteClickHandler={deleteClickHandler}
                        />}
                        {type === NOTIFICATIONS_TYPE.PHARMACY &&
                        <HCFPanel
                            hcf={payload}
                            action={action}
                            type='pharmacy'
                            acceptNotification={acceptNotification}
                            returnNotification={returnNotification}
                            deleteClickHandler={deleteClickHandler}
                        />}
                        {type === NOTIFICATIONS_TYPE.USER &&
                        <UserPanel
                            user={payload}
                            action={action}
                            type='user'
                            acceptNotification={acceptNotification}
                            returnNotification={returnNotification}
                            deleteClickHandler={deleteClickHandler}
                        />}
                    </Grid>
                }
            </Paper>
        );
    }
}

export default withStyles(styles)(Notification);
