import { USER_ROLE } from '../constants/Roles';

export interface IUserCredentials {
    email: string;
    password: string;
}

export interface IUserCommonInfo {
    id: number;
    name: string;
    avatar: string;
    region?: number;
    city?: number;
}

export interface IUser extends IUserCommonInfo {
    position: USER_ROLE;
    doctorsCount?: number;
    pharmacyCount?: number;

    level?: number;

    department?: number;
}
