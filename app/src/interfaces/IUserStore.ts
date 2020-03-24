import { IUser } from './IUser';
import { USER_ROLE } from '../constants/Roles';

export interface IUserStore {
    user: IUser;
    previewUser: IUser;
    role: USER_ROLE;
}
