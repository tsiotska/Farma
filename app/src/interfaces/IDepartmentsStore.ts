import { IDepartment } from './IDepartment';
import { IMedicine } from './IMedicine';

export interface IDepartmentsStore {
    departments: IDepartment[];
    currentDepartment: IDepartment;
    initializeStore: () => void;
    meds: Map<number, IMedicine>;
}
