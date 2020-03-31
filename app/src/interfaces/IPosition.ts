import { PERMISSIONS } from '../constants/Permissions';

export interface IPosition {
    id: number;
    name: string;
    alias: string;
    permissions: PERMISSIONS[];
}
