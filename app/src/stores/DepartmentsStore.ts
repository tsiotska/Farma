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
import { ADMIN, FIELD_FORCE_MANAGER, REGIONAL_MANAGER, MEDICAL_AGENT } from '../constants/Roles';
import { IRegion } from '../interfaces/IRegion';

export class DepartmentsStore extends AsyncStore implements IDepartmentsStore {
    rootStore: IRootStore;

    @observable departments: IDepartment[] = [];
    @observable currentDepartment: IDepartment = null;
    @observable meds: Map<number, IMedicine> = new Map();
    @observable positions: Map<number, IPosition> = new Map();
    @observable medicalDepartments: Map<number, ILPU> = new Map();
    @observable workers: IWorker[] = [];
    @observable firedWorkers: IWorker[] = [];
    @observable regions: Map<number, IRegion> = new Map();

    constructor(rootStore: IRootStore) {
        super();
        this.rootStore = rootStore;
        reaction(() => this.currentDepartment, this.loadMeds);
        this.initializeStore();
    }

    @action.bound
    initializeStore() {
        this.loadDepartments();
        this.loadRegions(true);
        this.loadPositions(true);
        this.loadMedicalDepartments(true);
    }

    @action.bound
    resetStore() {
        this.meds = new Map();
        this.workers = [];
        this.firedWorkers = [];
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
    async loadMedicalDepartments(isInitial: boolean = false) {
        const requestName = 'loadMedicalDepartments';
        const { api } = this.rootStore;

        if (isInitial) this.setRetryCount(requestName, Config.MAX_RENEW_COUNT);

        const res = await this.dispatchRequest(
            api.getMedicalDepartments(),
            requestName
        );

        if (res) {
            const mapped: Array<[number, ILPU]> = res.map(x => ([x.id, x]));
            this.medicalDepartments = new Map(mapped);
            return;
        }

        this.retryPolicy(this.loadMedicalDepartments, requestName);
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
        const { userStore: { user, role } } = this.rootStore;

        const userId = user
            ? user.id
            : null;

        const departmentId = this.currentDepartment
            ? this.currentDepartment.id
            : null;

        const queryParam = fired
            ? '?fired=1'
            : '';

        if (userId === null || departmentId === null) return null;

        switch (role) {
            case ADMIN: return `api/branch/${this.currentDepartment.id}/ffm/worker${queryParam}`;
            case FIELD_FORCE_MANAGER: return `api/branch/${this.currentDepartment.id}/ffm/worker${queryParam}`;
            case REGIONAL_MANAGER: return `api/branch/${this.currentDepartment.id}/rm/${userId}/worker${queryParam}`;
            case MEDICAL_AGENT: return `api/branch/${this.currentDepartment.id}/mp/${userId}/worker${queryParam}`;
            default: return null;
        }
    }
}
