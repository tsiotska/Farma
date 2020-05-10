import { IDepartment } from './IDepartment';
import { IMedicine } from './IMedicine';
import { ILocation } from './ILocation';
import { IUserCommonInfo } from './IUser';
import { ILPU } from './ILPU';
import { IPosition } from './IPosition';

export interface IDepartmentsStore {
    positions: Map<number, IPosition>;
    departments: IDepartment[];
    currentDepartment: IDepartment;
    currentDepartmentId: number;
    regions: Map<number, ILocation>;
    cities: Map<number, ILocation>;
    pharmacies: ILPU[];
    locationsAgents: Map<number, IUserCommonInfo>;
    meds: Map<number, IMedicine[]>;
    currentDepartmentMeds: IMedicine[];
    resetStore: () => void;
    loadLocationsAgents: () => void;
    loadLocations: () => void;
    loadDepartments: () => void;
    loadPositions: () => void;
    setCurrentDepartment?: (value: number | string | IDepartment) => void;
    loadFFMs: () => void;
}
