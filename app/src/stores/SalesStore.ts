import { IRootStore } from './../interfaces/IRootStore';
import AsyncStore from './AsyncStore';
import { ISalesStore } from './../interfaces/ISalesStore';
import { observable, action, reaction } from 'mobx';
import { IDepartment } from '../interfaces/IDepartment';

export type DisplayMode = 'pack' | 'currency';

export default class SalesStore extends AsyncStore implements ISalesStore {
    rootStore: IRootStore;
    @observable dateFrom: Date;
    @observable dateTo: Date;
    @observable displayMode: DisplayMode = 'pack';

    constructor(rootStore: IRootStore) {
        super();
        this.rootStore = rootStore;

        reaction(
            () => this.rootStore.departmentsStore.currentDepartment,
            this.loadStat
        );

        const currentDate = new Date(Date.now());
        this.dateTo = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth()
        );

        const fromYear = currentDate.getMonth() === 0
        ? currentDate.getFullYear() - 1
        : currentDate.getFullYear();

        this.dateFrom = new Date(
            fromYear,
            0
        );
    }

    @action.bound
    setDateFrom(newDate: Date) {
        this.dateFrom = newDate;
    }

    @action.bound
    setDateTo(newDate: Date) {
        this.dateTo = newDate;
    }

    @action.bound
    setDisplayMode(newMode: DisplayMode) {
        this.displayMode = newMode;
    }

    @action.bound
    async loadStat(department: IDepartment) {
        console.log('load stat');
        /*
        const requestName = 'loadStat';
        const { api } = this.rootStore;

        const departmentId: number = department
        ? department.id
        : -1;

        if (departmentId === -1) return;

        this.setLoading(requestName, departmentId);
        const res = await api.getStat(departmentId);

        const storedId = this.getRequestParams(requestName);

        // if fetched data is not relevant
        if (storedId !== departmentId) return;

        const callback = res
        ? this.setSuccess
        : this.setError;

        callback(requestName);
        this.clearParams(requestName);
        */
        // TODO: ...
    }
}
