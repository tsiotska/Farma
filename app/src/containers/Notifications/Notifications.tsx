import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles, createStyles, WithStyles, Grid } from '@material-ui/core';
import { IDepartment } from '../../interfaces/IDepartment';
import { INotification } from '../../interfaces/iNotification';
import { toJS, computed } from 'mobx';
import { IAsyncStatus } from '../../stores/AsyncStore';
import Notification from './Notification';

const styles = createStyles({});

interface IProps extends WithStyles<typeof styles> {
    setCurrentDepartment?: (department: IDepartment) => void;
    loadNotifications?: () => void;
    notifications?: INotification[];
    getAsyncStatus?: (key: string) => IAsyncStatus;
}

@inject(({
    appState: {
        departmentsStore: {
            setCurrentDepartment
        },
        userStore: {
            loadNotifications,
            notifications,
            getAsyncStatus
        }
    }
}) => ({
    setCurrentDepartment,
    loadNotifications,
    notifications,
    getAsyncStatus
}))
@observer
class Notifications extends Component<IProps> {
    constructor(props: IProps) {
        super(props);
        this.props.setCurrentDepartment(null);
    }

    @computed
    get isLoading(): boolean {
        return this.props.getAsyncStatus('loadNotifications').loading;
    }

    componentDidMount() {
        this.props.loadNotifications();
    }

    render() {
        const { notifications, classes } = this.props;
        console.log('notifications: ', toJS(notifications));

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
                                <Notification notification={notification} />
                            </React.Fragment>
                        );
                    })
                }
            </Grid>
        );
    }
}

export default withStyles(styles)(Notifications);
