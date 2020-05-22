import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles, createStyles, WithStyles, Grid } from '@material-ui/core';
import { IDepartment } from '../../interfaces/IDepartment';
import { INotification } from '../../interfaces/iNotification';
import { toJS, computed, reaction, observable } from 'mobx';
import { IAsyncStatus } from '../../stores/AsyncStore';
import Notification from './Notification';
import { ILPU } from '../../interfaces/ILPU';
import Snackbar from '../../components/Snackbar';
import DeletePopover from '../../components/DeletePopover';
import { SNACKBAR_TYPE } from '../../constants/Snackbars';
import { IDeletePopoverSettings } from '../../stores/UIStore';

const styles = createStyles({});

interface IProps extends WithStyles<typeof styles> {
    setCurrentDepartment?: (department: IDepartment) => void;
    loadNotifications?: () => void;
    notifications?: INotification[];
    getAsyncStatus?: (key: string) => IAsyncStatus;
    loadNotificationsUsers?: () => void;
    reviewNotifications?: () => void;
    notificationsCount?: number;

    openDelPopper?: (settings: IDeletePopoverSettings) => void;
    acceptNotification?: (type: string, id: number) => boolean;
    deleteNotification?: (type: string, id: number) => boolean;
    returnNotification?: (type: string, id: number) => boolean;
}

@inject(({
             appState: {
                 departmentsStore: {
                     setCurrentDepartment,
                     acceptNotification,
                     deleteNotification,
                     returnNotification
                 },
                 userStore: {
                     loadNotifications,
                     notifications,
                     getAsyncStatus,
                     loadNotificationsUsers,
                     reviewNotifications,
                     notificationsCount,
                 },
                 uiStore: {
                     openDelPopper
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
    openDelPopper,
    acceptNotification,
    deleteNotification,
    returnNotification
}))
@observer
class Notifications extends Component<IProps> {
    @observable snackbarType: SNACKBAR_TYPE = SNACKBAR_TYPE.SUCCESS;
    @observable snackbarMessage: string = null;
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

    deleteConfirmHandler = (confirmed: boolean, type: string, id: number) => {
        this.props.openDelPopper(null);
        if (confirmed) {
            this.delete(type, id);
        }
    }

    deleteClickHandler = (currentTarget: any, type: string, id: number) => this.props.openDelPopper({
        anchorEl: currentTarget,
        callback: (confirmed: boolean) => this.deleteConfirmHandler(confirmed, type, id),
        name: 'deleteNotification'
    })

    snackbarCloseHandler = () => {
        this.snackbarMessage = null;
    }

    componentWillUnmount() {
        window.clearTimeout(this.timeout);
        this.reactionDisposer();
    }

    delete = async (type: string, id: number) => {
        const { deleteNotification } = this.props;
        const isDeleted = await deleteNotification(type, id);
        if (isDeleted) this.updateNotifications();
        this.snackbarType = isDeleted
            ? SNACKBAR_TYPE.SUCCESS
            : SNACKBAR_TYPE.ERROR;
        this.snackbarMessage = isDeleted
            ? 'Повідомлення успішно видалено'
            : 'Не вдалося видалити повідомлення';
    }

    accept = async (type: string, id: number) => {
        const { acceptNotification } = this.props;
        const isAccepted = await acceptNotification(type, id);
        if (isAccepted) this.updateNotifications();
        this.snackbarType = isAccepted
            ? SNACKBAR_TYPE.SUCCESS
            : SNACKBAR_TYPE.ERROR;
        this.snackbarMessage = isAccepted
            ? 'Повідомлення успішно підтверджено'
            : 'Не вдалося підтвердити повідомлення';
    }

    return = async (type: string, id: number) => {
        const { returnNotification } = this.props;
        const isReturned = await returnNotification(type, id);
        if (isReturned) this.updateNotifications();
        this.snackbarType = isReturned
            ? SNACKBAR_TYPE.SUCCESS
            : SNACKBAR_TYPE.ERROR;
        this.snackbarMessage = isReturned
            ? 'Повідомлення успішно повернено'
            : 'Не вдалося повернути повідомлення';
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
                                {before}
                                <Notification
                                    notification={notification}
                                    deleteClickHandler={this.deleteClickHandler}
                                    acceptNotification={this.accept}
                                    returnNotification={this.return}
                                />
                            </React.Fragment>
                        );
                    })
                }
                <Snackbar
                    open={!!this.snackbarMessage}
                    onClose={this.snackbarCloseHandler}
                    type={this.snackbarType}
                    message={this.snackbarMessage}
                />
                <DeletePopover
                    name='deleteNotification'
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                />
            </Grid>
        );
    }
}

export default withStyles(styles)(Notifications);
