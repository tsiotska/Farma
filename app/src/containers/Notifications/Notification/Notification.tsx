import React, { Component } from 'react';
import { createStyles, WithStyles, withStyles, Grid, Divider, Paper, Typography } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { INotification } from '../../../interfaces/iNotification';
import { IDepartment } from '../../../interfaces/IDepartment';
import { computed } from 'mobx';
import Config from '../../../../Config';
import UserShortInfo from '../../../components/UserShortInfo';
import cx from 'classnames';

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
        height: 60,
        borderBottom: '1px solid #e2e2e2'
    },
    subjectRow: {
        height: 48
    },
    icon: {
        width: 40,
        height: 40,
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
    }
});

interface IProps extends WithStyles<typeof styles> {
    notification: INotification;
    departments?: IDepartment[];
}

@inject(({
    appState: {
        departmentsStore: {
            departments
        }
    }
}) => ({
    departments
}))
@observer
class Notification extends Component<IProps> {
    @computed
    get iconSrc(): string {
        const { departments, notification: { department }} = this.props;
        const currentDep = departments.find(({ id }) => id === department);
        return currentDep
            ? currentDep.image
            : null;
    }

    render() {
        const { classes, notification: { user, message, payload } } = this.props;

        return (
            <Paper className={classes.root}>
                <Grid className={cx(classes.row, classes.titleRow)} alignItems='center' container>
                    {
                        this.iconSrc &&
                        <img src={`${Config.ASSETS_URL}/${this.iconSrc}`} className={classes.icon} />
                    }
                    <Divider className={classes.divider} orientation='vertical' />
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
                    <Divider className={classes.divider} orientation='vertical' />
                    <Grid xs container item>
                        <Typography variant='body2' className={classes.textSemiBold}>
                            { message }
                        </Typography>
                    </Grid>
                </Grid>
                {
                    payload &&
                    <Grid className={cx(classes.row, classes.subjectRow)} alignItems='center' container>
                        ROWS
                    </Grid>
                }
            </Paper>
        );
    }
}

export default withStyles(styles)(Notification);
