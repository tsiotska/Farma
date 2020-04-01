import { IDepartment } from './IDepartment';
import { IMedicine } from './IMedicine';
import { ILocation } from './ILocation';
import { IUserCommonInfo } from './IUser';
import { ILPU } from './ILPU';

export interface IDepartmentsStore {
    departments: IDepartment[];
    currentDepartment: IDepartment;
    currentDepartmentId: number;
    locations: Map<number, ILocation>;
    pharmacies: ILPU[];
    locationsAgents: Map<number, IUserCommonInfo>;
    meds: Map<number, IMedicine>;
    resetStore: () => void;
    initializeStore: () => void;
    loadLocationsAgents: () => void;
    loadLocations: () => void;
}
