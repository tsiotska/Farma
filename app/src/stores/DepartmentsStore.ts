import { IDepartment } from './../interfaces/IDepartment';
import { IRootStore } from './../interfaces/IRootStore';
import AsyncStore from './AsyncStore';
import { observable, action, reaction } from 'mobx';
import { IDepartmentsStore } from '../interfaces/IDepartmentsStore';
import { IMedicine } from '../interfaces/IMedicine';
import { IPosition } from '../interfaces/IPosition';
import Config from '../../Config';

export class DepartmentsStore extends AsyncStore implements IDepartmentsStore {
    rootStore: IRootStore;

    @observable departments: IDepartment[] = [];
    @observable currentDepartment: IDepartment = null;
    @observable meds: IMedicine[] = [];
    @observable positions: Map<number, IPosition> = new Map();

    constructor(rootStore: IRootStore) {
        super();
        this.rootStore = rootStore;
        reaction(() => this.currentDepartment, this.loadMeds);
        this.loadDepartments();
        this.loadPositions(true);
    }

    @action.bound
    setCurrentDepartment(departmentName: string) {
        this.currentDepartment = this.departments.find(({ name }) => name === departmentName);
    }

    @action.bound
    async loadDepartments() {
        const requestName = 'loadDepartments';
        const { api } = this.rootStore;

        const res = await this.dispatchRequest(api.getBranches(), requestName);

        if (!res || !res.length) return;

        this.departments = res;

        if (!this.currentDepartment) this.currentDepartment = res[0];
    }

    @action.bound
    async loadMeds() {
        const requestName = 'loadMeds';
        const { api } = this.rootStore;

        if (!this.currentDepartment) return;

        this.meds = [];

        const request = api.getMeds(this.currentDepartment.name);

        const res = await this.dispatchRequest(request, requestName);

        if (res) this.meds = res;
    }

    @action.bound
    async loadPositions(isInitial: boolean = false) {
        const requestName = 'loadPositions';
        const { api } = this.rootStore;

        if (isInitial) this.setRetryCount(requestName, Config.MAX_RENEW_COUNT);

        const res = await this.dispatchRequest(api.getPositions(), requestName);

        if (res) {
            const mapped: Array<[number, IPosition]> = res.map(x => ([ x.id, x ]));
            this.positions = new Map(mapped);
            return;
        }

        const currentRetryCount = this.getRetryCount(requestName);

        const newRetryCount = currentRetryCount > 1
        ? currentRetryCount - 1
        : 0;

        if (newRetryCount) {
            this.setRetryCount(requestName, newRetryCount);
            setTimeout(this.loadPositions, 5000);
        }
    }
}
