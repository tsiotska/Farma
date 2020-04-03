import { IUser } from './IUser';

export interface IDepartment {
    id: number;
    name: string;
    image: string;
    ffm?: IUser;
}
