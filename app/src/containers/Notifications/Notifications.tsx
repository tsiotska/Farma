import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles, createStyles, WithStyles } from '@material-ui/core';
import { IDepartment } from '../../interfaces/IDepartment';
import { INotification } from '../../interfaces/iNotification';
import { toJS, computed } from 'mobx';
import { IAsyncStatus } from '../../stores/AsyncStore';

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
        return (
            <div>
                notificatiosn
            </div>
        );
    }
}

export default withStyles(styles)(Notifications);
