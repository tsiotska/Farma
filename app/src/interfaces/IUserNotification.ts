import { USER_ROLE } from '../constants/Roles';

export interface IUserNotification {
    id: number;
    name: string;
    email: string;
    position: USER_ROLE;
    workPhone: string;
    mobilePhone: string;
    card: string;
    image: string;
    created: Date;
    confirmed: boolean;
    deleted?: boolean;
}
