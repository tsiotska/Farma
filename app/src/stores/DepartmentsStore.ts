import { observable, action, reaction, toJS, computed, when } from 'mobx';
import { ILPU } from './../interfaces/ILPU';
import { IDepartment } from './../interfaces/IDepartment';
import { IRootStore } from './../interfaces/IRootStore';
import AsyncStore from './AsyncStore';
import { IDepartmentsStore } from '../interfaces/IDepartmentsStore';
import { IMedicine } from '../interfaces/IMedicine';
import { IPosition } from '../interfaces/IPosition';
import { getRandomColor } from '../helpers/getRandomColor';
import { IWorker } from '../interfaces/IWorker';
import { USER_ROLE } from '../constants/Roles';
import { ILocation } from '../interfaces/ILocation';
import { IUser } from '../interfaces/IUser';

export interface IExpandedWorker {
    id: number;
    subworkers: IWorker[];
}

export class DepartmentsStore extends AsyncStore implements IDepartmentsStore {
    rootStore: IRootStore;

    // util data
    @observable meds: Map<number, IMedicine> = new Map();
    @observable positions: Map<number, IPosition> = new Map();
    @observable LPUs: ILPU[] = null;
    @observable pharmacies: ILPU[] = null;

    @observable locations: Map<number, ILocation> = new Map();
    @observable locationsAgents: Map<number, IUser> = new Map();

    @observable departments: IDepartment[] = [];
    @observable currentDepartment: IDepartment = null;

    @observable workers: IWorker[] = [];
    @observable expandedWorker: IExpandedWorker = null;
    @observable firedWorkers: IWorker[] = [];

    constructor(rootStore: IRootStore) {
        super();
        this.rootStore = rootStore;
        reaction(() => this.currentDepartment, this.departmentChangeHandler);
        this.initializeStore();
    }

    private departmentChangeHandler = () => {
        this.loadMeds();
        this.expandedWorker = null;
        this.workers = [];
        this.firedWorkers = [];
    }

    @computed
    get currentDepartmentId(): number {
        return this.currentDepartment
        ? this.currentDepartment.id
        : null;
    }

    @action.bound
    async initializeStore() {
        await when(() => !!this.rootStore.userStore.user);
        this.loadDepartments();
        this.loadPositions(true);
    }

    @action.bound
    resetStore() {
        this.meds = new Map();
        this.workers = [];
        this.firedWorkers = [];
        this.currentDepartment = null;
    }

    @action.bound
    setExpandedWorker = (workerId: number | null) => {
        if (workerId === null) {
            this.expandedWorker = null;
            return;
        }

        this.expandedWorker = {
            id: workerId,
            subworkers: null
        };
        window.setTimeout(
            this.loadSubworkers,
            500
        );
    }

    @action.bound
    setCurrentDepartment(department: string | IDepartment) {
        if (typeof department === 'string') {
            this.currentDepartment = this.departments.find(({ name }) => name === department);
        } else {
            this.currentDepartment = department;
        }
    }

    @action.bound
    async loadPharmacies() {
        const requestName = 'loadPharmacies';
        const { api } = this.rootStore;

        const res = await this.dispatchRequest(
            api.getPharmacies(),
            requestName
        );

        if (res) {
            this.pharmacies = res;
            return;
        }
    }

    @action.bound
    async loadLPUs() {
        const requestName = 'loadLPUs';
        const { api } = this.rootStore;

        const res = await this.dispatchRequest(
            api.getMedicalDepartments(),
            requestName
        );

        if (res) this.LPUs = res;
    }

    @action.bound
    async loadWorkers() {
        const requestName = 'loadWorkers';
        const { api } = this.rootStore;

        const url = this.getWorkersApiUrl();
        if (url === null) return;

        const res = await this.dispatchRequest(api.getWorkers(url), requestName);

        if (res) this.workers = res;
    }

    @action.bound
    async loadFiredWorkers() {
        const requestName = 'loadFiredWorkers';
        const { api } = this.rootStore;

        const url = this.getWorkersApiUrl(true);
        if (url === null) return;

        const res = await this.dispatchRequest(api.getWorkers(url), requestName);

        if (res) this.firedWorkers = res;
    }

    @action.bound
    async loadDepartments() {
        const requestName = 'loadDepartments';
        const { api } = this.rootStore;

        const res = await this.dispatchRequest(api.getBranches(), requestName);

        if (!res || !res.length) return;

        this.departments = res;
    }

    @action.bound
    async loadMeds() {
        const requestName = 'loadMeds';
        const { api } = this.rootStore;

        if (!this.currentDepartmentId) return;

        this.meds.clear();

        this.setLoading(requestName);
        const { cache, promise } = api.getMeds(this.currentDepartmentId);
        if (cache) this.medsHandler(cache);

        const requestResult = await promise;

        if (requestResult) {
            this.medsHandler(requestResult);
            this.setSuccess(requestName);
        } else {
            this.setError(requestName);
        }
    }

    private medsHandler = (meds: IMedicine[]) => {
        const { salesStore: { initMedsDisplayStatuses } } = this.rootStore;
        const mapped: Array<[number, IMedicine]> = meds.map(x => (
            [x.id, { ...x, color: getRandomColor() }]
        ));
        this.meds = new Map(mapped);
        initMedsDisplayStatuses();
    }

    @action.bound
    async loadPositions(isInitial: boolean = false) {
        const requestName = 'loadPositions';
        const { api } = this.rootStore;

        const res = await this.dispatchRequest(
            api.getPositions(),
            requestName
        );

        if (res) {
            const mapped: Array<[number, IPosition]> = res.map(x => ([x.id, x]));
            this.positions = new Map(mapped);
            return;
        }
    }

    @action.bound
    async loadLocations(isInitial: boolean = false) {
        const requestName = 'loadLocations';
        const { api, userStore: { role } } = this.rootStore;

        let url: string;
        if (role === USER_ROLE.FIELD_FORCE_MANAGER) url = 'api/region';
        else if (role === USER_ROLE.REGIONAL_MANAGER) url = 'api/city';
        if (!url) return;

        const res = await this.dispatchRequest(
            api.getLocations(url),
            requestName
        );

        if (res) {
            const mapped: Array<[number, ILocation]> = res.map(x => ([ x.id, x ]));
            this.locations = new Map(mapped);
            return;
        }
    }

    @action.bound
    async loadLocationsAgents() {
        const requestName = 'loadLocationsAgents';
        const { api, userStore: { role } } = this.rootStore;

        const branchId = this.currentDepartmentId;
        const userRole = role;

        let loadPositionsId: USER_ROLE;
        if (role === USER_ROLE.FIELD_FORCE_MANAGER) loadPositionsId = USER_ROLE.REGIONAL_MANAGER;
        if (role === USER_ROLE.REGIONAL_MANAGER) loadPositionsId = USER_ROLE.MEDICAL_AGENT;
        if (!branchId || !loadPositionsId) return;

        this.locationsAgents.clear();
        this.setLoading(requestName);
        const res = await api.getLocationAgents(branchId, loadPositionsId);

        if (branchId !== this.currentDepartmentId || userRole !== this.rootStore.userStore.role) return;

        if (res) {
            const mapped: Array<[number, IUser]> = res.map(x => ([ x.id, x ]));
            this.locationsAgents = new Map(mapped);
        }

        const callback = res
        ? this.setSuccess
        : this.setError;

        callback(requestName);
    }

    @action.bound
    async loadDoctors() {
        console.log('load doctors');
    }

    @action.bound
    async loadSubworkers() {
        const requestName = 'loadSubworkers';
        const { api } = this.rootStore;

        const workerId = this.expandedWorker
        ? this.expandedWorker.id
        : null;

        if (this.currentDepartmentId === null || workerId === null) return;
        this.setLoading(requestName, this.currentDepartmentId);
        const res = await api.getWorkers(`/api/branch/${this.currentDepartmentId}/rm/${workerId}/worker`);

        const isRelevant = this.getRequestParams(requestName) === this.currentDepartmentId
        && workerId === (this.expandedWorker && this.expandedWorker.id);
        if (!isRelevant) return;

        this.expandedWorker.subworkers = res;

        const callback = res
        ? this.setSuccess
        : this.setError;

        callback(requestName);
    }

    private getWorkersApiUrl(fired?: boolean): string {
        const { userStore: { previewUser, role } } = this.rootStore;

        const userId = previewUser
            ? previewUser.id
            : null;

        const queryParam = fired
            ? '?fired=1'
            : '';

        if (userId === null || this.currentDepartmentId === null) return null;

        switch (role) {
            case USER_ROLE.ADMIN: return `api/branch/${this.currentDepartmentId}/ffm/worker${queryParam}`;
            case USER_ROLE.FIELD_FORCE_MANAGER: return `api/branch/${this.currentDepartmentId}/ffm/worker${queryParam}`;
            case USER_ROLE.REGIONAL_MANAGER: return `api/branch/${this.currentDepartmentId}/rm/${userId}/worker${queryParam}`;
            case USER_ROLE.MEDICAL_AGENT: return `api/branch/${this.currentDepartmentId}/mp/${userId}/worker${queryParam}`;
            default: return null;
        }
    }
}
