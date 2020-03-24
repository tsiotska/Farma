import { observable, action, reaction, toJS } from 'mobx';
import { ILPU } from './../interfaces/ILPU';
import { IDepartment } from './../interfaces/IDepartment';
import { IRootStore } from './../interfaces/IRootStore';
import AsyncStore from './AsyncStore';
import { IDepartmentsStore } from '../interfaces/IDepartmentsStore';
import { IMedicine } from '../interfaces/IMedicine';
import { IPosition } from '../interfaces/IPosition';
import Config from '../../Config';
import { getRandomColor } from '../helpers/getRandomColor';
import { IWorker } from '../interfaces/IWorker';
import { USER_ROLE } from '../constants/Roles';
import { IRegion } from '../interfaces/IRegion';

export interface IExpandedWorker {
    id: number;
    subworkers: IWorker[];
}

export class DepartmentsStore extends AsyncStore implements IDepartmentsStore {
    rootStore: IRootStore;

    // util data
    @observable meds: Map<number, IMedicine> = new Map();
    @observable positions: Map<number, IPosition> = new Map();
    @observable LPUs: Map<number, ILPU> = new Map();
    @observable regions: Map<number, IRegion> = new Map();

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

    @action.bound
    initializeStore() {
        this.loadDepartments();
        this.loadRegions(true);
        this.loadPositions(true);
        this.loadLPUs(true);
    }

    @action.bound
    resetStore() {
        this.meds = new Map();
        this.workers = [];
        this.firedWorkers = [];
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

        if (!this.currentDepartment) this.setCurrentDepartment(res[0]);
    }

    @action.bound
    async loadMeds() {
        const requestName = 'loadMeds';
        const { api, salesStore: { initMedsDisplayStatuses } } = this.rootStore;

        if (!this.currentDepartment) return;

        this.meds.clear();

        const request = api.getMeds(this.currentDepartment.id);

        const res = await this.dispatchRequest(request, requestName);

        if (res) {
            const mapped: Array<[number, IMedicine]> = res.map(x => (
                [x.id, { ...x, color: getRandomColor() }]
            ));
            this.meds = new Map(mapped);
            initMedsDisplayStatuses();
        }
    }

    @action.bound
    async loadPositions(isInitial: boolean = false) {
        const requestName = 'loadPositions';
        const { api } = this.rootStore;

        if (isInitial) this.setRetryCount(requestName, Config.MAX_RENEW_COUNT);

        const res = await this.dispatchRequest(
            api.getPositions(),
            requestName
        );

        if (res) {
            const mapped: Array<[number, IPosition]> = res.map(x => ([x.id, x]));
            this.positions = new Map(mapped);
            return;
        }

        this.retryPolicy(this.loadPositions, requestName);
    }

    @action.bound
    async loadLPUs(isInitial: boolean = false) {
        const requestName = 'loadLPUs';
        const { api } = this.rootStore;

        if (isInitial) this.setRetryCount(requestName, Config.MAX_RENEW_COUNT);

        const res = await this.dispatchRequest(
            api.getMedicalDepartments(),
            requestName
        );

        if (res) {
            const mapped: Array<[number, ILPU]> = res.map(x => ([x.id, x]));
            this.LPUs = new Map(mapped);
            return;
        }

        this.retryPolicy(this.loadLPUs, requestName);
    }

    @action.bound
    async loadRegions(isInitial: boolean = false) {
        const requestName = 'loadRegions';
        const { api } = this.rootStore;

        if (isInitial) this.setRetryCount(requestName, Config.MAX_RENEW_COUNT);

        const res = await this.dispatchRequest(
            api.getRegions(),
            requestName
        );

        if (res) {
            const mapped: Array<[number, IRegion]> = res.map(x => ([ x.id, x ]));
            this.regions = new Map(mapped);
            return;
        }

        this.retryPolicy(this.loadRegions, requestName);
    }

    @action.bound
    async loadDoctors() {
        console.log('load doctors');
    }

    @action.bound
    async loadSubworkers() {
        const requestName = 'loadSubworkers';
        const { api } = this.rootStore;

        const branchId = this.currentDepartment
        ? this.currentDepartment.id
        : null;

        const workerId = this.expandedWorker
        ? this.expandedWorker.id
        : null;

        if (branchId === null || workerId === null) return;
        this.setLoading(requestName);
        const res = await api.getWorkers(`/api/branch/${branchId}/rm/${workerId}/worker`);

        const isRelevant = branchId === (this.currentDepartment && this.currentDepartment.id)
        && workerId === (this.expandedWorker && this.expandedWorker.id);
        if (!isRelevant) return;

        this.expandedWorker.subworkers = res;

        const callback = res
        ? this.setSuccess
        : this.setError;

        callback(requestName);
    }

    private retryPolicy(requestMethod: () => any, requestName: string) {
        const currentRetryCount = this.getRetryCount(requestName);

        const newRetryCount = currentRetryCount > 1
            ? currentRetryCount - 1
            : 0;

        if (newRetryCount) {
            this.setRetryCount(requestName, newRetryCount);
            setTimeout(requestMethod, Config.RETRY_INTERVAL);
        }
    }

    private getWorkersApiUrl(fired?: boolean): string {
        const { userStore: { previewUser, role } } = this.rootStore;

        const userId = previewUser
            ? previewUser.id
            : null;

        const departmentId = this.currentDepartment
            ? this.currentDepartment.id
            : null;

        const queryParam = fired
            ? '?fired=1'
            : '';

        if (userId === null || departmentId === null) return null;

        switch (role) {
            case USER_ROLE.ADMIN: return `api/branch/${this.currentDepartment.id}/ffm/worker${queryParam}`;
            case USER_ROLE.FIELD_FORCE_MANAGER: return `api/branch/${this.currentDepartment.id}/ffm/worker${queryParam}`;
            case USER_ROLE.REGIONAL_MANAGER: return `api/branch/${this.currentDepartment.id}/rm/${userId}/worker${queryParam}`;
            case USER_ROLE.MEDICAL_AGENT: return `api/branch/${this.currentDepartment.id}/mp/${userId}/worker${queryParam}`;
            default: return null;
        }
    }
}
