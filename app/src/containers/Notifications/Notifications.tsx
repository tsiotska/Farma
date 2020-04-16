import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles, createStyles, WithStyles, Grid } from '@material-ui/core';
import { IDepartment } from '../../interfaces/IDepartment';
import { INotification } from '../../interfaces/iNotification';
import { toJS, computed, reaction } from 'mobx';
import { IAsyncStatus } from '../../stores/AsyncStore';
import Notification from './Notification';
import { ILPU } from '../../interfaces/ILPU';

const styles = createStyles({});

interface IProps extends WithStyles<typeof styles> {
    setCurrentDepartment?: (department: IDepartment) => void;
    loadNotifications?: () => void;
    notifications?: INotification[];
    getAsyncStatus?: (key: string) => IAsyncStatus;
    loadNotificationsUsers?: () => void;
    reviewNotifications?: () => void;
    notificationsCount?: number;
}

@inject(({
    appState: {
        departmentsStore: {
            setCurrentDepartment,
        },
        userStore: {
            loadNotifications,
            notifications,
            getAsyncStatus,
            loadNotificationsUsers,
            reviewNotifications,
            notificationsCount,
        }
    }
}) => ({
    setCurrentDepartment,
    loadNotifications,
    notifications,
    getAsyncStatus,
    loadNotificationsUsers,
    reviewNotifications,
    notificationsCount,
}))
@observer
class Notifications extends Component<IProps> {
    timeout: any = null;
    reactionDisposer: any = null;

    constructor(props: IProps) {
        super(props);
        this.props.setCurrentDepartment(null);
    }

    @computed
    get isLoading(): boolean {
        return this.props.getAsyncStatus('loadNotifications').loading;
    }

    updateNotifications = async () => {
        await this.props.loadNotifications();
        this.props.loadNotificationsUsers();
    }

    async componentDidMount() {
        const { reviewNotifications } = this.props;
        await this.updateNotifications();
        this.timeout = setTimeout(
            reviewNotifications,
            3000
        );
        this.reactionDisposer = reaction(
            () => this.props.notificationsCount,
            (count: number) => {
                if (!count) return;
                this.updateNotifications();
            }
        );
    }

    componentWillUnmount() {
        window.clearTimeout(this.timeout);
        this.reactionDisposer();
    }

    render() {
        const { notifications, classes } = this.props;

        let showSubheader: boolean = true;
        return (
            <Grid direction='column' container>
                {
                    notifications.map(notification => {
                        const { isNew, id } = notification;

                        let before: any = null;
                        if (showSubheader && isNew === false) {
                            showSubheader = false;
                            before = <p>Попередні сповіщення</p>;
                        }

                        return (
                            <React.Fragment key={id}>
                                { before }
                                <Notification
                                    notification={notification}
                                />
                            </React.Fragment>
                        );
                    })
                }
            </Grid>
        );
    }
}

export default withStyles(styles)(Notifications);
