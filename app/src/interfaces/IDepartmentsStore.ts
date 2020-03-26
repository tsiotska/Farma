import { IDepartment } from './IDepartment';
import { IMedicine } from './IMedicine';

export interface IDepartmentsStore {
    departments: IDepartment[];
    currentDepartment: IDepartment;
    currentDepartmentId: number;
    resetStore: () => void;
    initializeStore: () => void;
    loadLocationsAgents: () => void;
    loadLocations: () => void;
    meds: Map<number, IMedicine>;
}
