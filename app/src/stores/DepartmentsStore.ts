import { IDepartment } from './../interfaces/IDepartment';
import { IRootStore } from './../interfaces/IRootStore';
import AsyncStore from './AsyncStore';
import { observable } from 'mobx';
import { IDepartmentsStore } from './IDepartmentsStore';
import { CARDIO_ROUTE, UROLOGY_ROUTE } from '../constants/Router';

export class DepartmentsStore extends AsyncStore implements IDepartmentsStore {
    rootStore: IRootStore;

    readonly departmentRoutes: Map<string, string> = new Map([
        ['cardiology', CARDIO_ROUTE],
        ['urology', UROLOGY_ROUTE]
    ]);

    @observable departments: IDepartment[] = [];

    constructor(rootStore: IRootStore) {
        super();
        this.rootStore = rootStore;
        this.loadDepartments();
    }

    async loadDepartments() {
        const requestName = 'loadDepartments';
        const { api } = this.rootStore;

        const res = await this.requestDispatcher(api.getBranches(), requestName);

        if (!res) return;

        const withPathNames = res.map(this.connectDepartmentWithRoute).filter(({ path }) => !!path);

        this.departments = withPathNames;
    }

    private connectDepartmentWithRoute = ({ id, name, image }: IDepartment) => ({
        id,
        name,
        image,
        path: this.departmentRoutes.get(name)
    })
}
