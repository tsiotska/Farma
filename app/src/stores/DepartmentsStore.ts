import { IDepartment } from './../interfaces/IDepartment';
import { IRootStore } from './../interfaces/IRootStore';
import AsyncStore from './AsyncStore';
import { observable, action, reaction } from 'mobx';
import { IDepartmentsStore } from '../interfaces/IDepartmentsStore';
import { IMedicine } from '../interfaces/IMedicine';

export class DepartmentsStore extends AsyncStore implements IDepartmentsStore {
    rootStore: IRootStore;

    @observable departments: IDepartment[] = [];
    @observable currentDepartment: IDepartment = null;
    @observable meds: IMedicine[] = [];

    constructor(rootStore: IRootStore) {
        super();
        this.rootStore = rootStore;
        reaction(() => this.currentDepartment, this.loadMeds);
        this.loadDepartments();
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
}
