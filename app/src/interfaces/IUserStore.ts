import { IUser } from './IUser';
import { USER_ROLE } from '../constants/Roles';

export interface IUserStore {
    user: IUser;
    isAdmin: boolean;
    previewUser: IUser;
    role: USER_ROLE;
}
