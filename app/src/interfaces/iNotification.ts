import { NOTIFICATIONS_TYPE } from '../constants/NotificationsType';
import { IUser } from './IUser';

export interface INotification {
    id: string | number;
    user: number | IUser;
    department: number;
    message: string;
    date: Date;
    type: NOTIFICATIONS_TYPE;
    isNew: boolean;
    payload?: any;
    action?: string;
}
