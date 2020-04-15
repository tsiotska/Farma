import { NOTIFICATIONS_TYPE } from '../constants/NotificationsType';

export interface INotification {
    user: number;
    department: number;
    message: string;
    date: Date;
    type: NOTIFICATIONS_TYPE;
    isNew: boolean;
    payload?: any;
}
