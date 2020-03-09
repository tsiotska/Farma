import { IDepartment } from './../interfaces/IDepartment';
import { IRootStore } from './../interfaces/IRootStore';
import AsyncStore from './AsyncStore';
import { observable, action } from 'mobx';
import { IDepartmentsStore } from '../interfaces/IDepartmentsStore';
import { CARDIO_ROUTE, UROLOGY_ROUTE } from '../constants/Router';

export class DepartmentsStore extends AsyncStore implements IDepartmentsStore {
    rootStore: IRootStore;
    readonly departmentRoutes: Map<string, string> = new Map([
        ['cardiology', CARDIO_ROUTE],
        ['urology', UROLOGY_ROUTE]
    ]);

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
    }

    @action.bound
    async loadDepartments() {
        const requestName = 'loadDepartments';
        const { api } = this.rootStore;

        const res = await this.dispatchRequest(api.getBranches(), requestName);

        if (!res) return;

        const withPathNames = res.map(this.connectDepartmentWithRoute).filter(({ path }) => !!path);

        this.departments = withPathNames;
    }

    private connectDepartmentWithRoute = ({ name, ...rest }: IDepartment) => ({
        name,
        ...rest,
        path: this.departmentRoutes.get(name),
    })
}
