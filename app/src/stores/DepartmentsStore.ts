import { IDepartment } from './../interfaces/IDepartment';
import { IRootStore } from './../interfaces/IRootStore';
import AsyncStore from './AsyncStore';
import { observable, action, toJS } from 'mobx';
import { IDepartmentsStore } from '../interfaces/IDepartmentsStore';

export class DepartmentsStore extends AsyncStore implements IDepartmentsStore {
    rootStore: IRootStore;

    @observable departments: IDepartment[] = [];
    @observable currentDepartment: IDepartment = null;

    constructor(rootStore: IRootStore) {
        super();
        this.rootStore = rootStore;
        this.loadDepartments();
    }

    @action.bound
    setCurrentDepartment(departmentName: string) {
        this.currentDepartment = this.departments.find(({ name }) => name === departmentName);
        console.log('current dep: ', toJS(this.currentDepartment));
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
}
