import { IDepartment } from './IDepartment';

export interface IDepartmentsStore {
    departments: IDepartment[];
    currentDepartment: IDepartment;
}
