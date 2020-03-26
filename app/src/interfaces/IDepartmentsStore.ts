import { IDepartment } from './IDepartment';
import { IMedicine } from './IMedicine';

export interface IDepartmentsStore {
    departments: IDepartment[];
    currentDepartment: IDepartment;
    currentDepartmentId: number;
    resetStore: () => void;
    initializeStore: () => void;
    loadLocationsAgents: () => void;
    meds: Map<number, IMedicine>;
}
