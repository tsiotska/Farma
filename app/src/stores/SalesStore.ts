import { IRootStore } from './../interfaces/IRootStore';
import AsyncStore from './AsyncStore';
import { ISalesStore } from './../interfaces/ISalesStore';
import { observable, action, reaction } from 'mobx';
import { IDepartment } from '../interfaces/IDepartment';
import { ISalesStat } from '../interfaces/ISalesStat';
import { format, differenceInCalendarDays, differenceInCalendarMonths } from 'date-fns';
import { stringify } from 'query-string';

export type DisplayMode = 'pack' | 'currency';

export default class SalesStore extends AsyncStore implements ISalesStore {
    readonly rootStore: IRootStore;
    readonly dateMask: string = 'yyyy-MM-dd';

    @observable dateFrom: Date;
    @observable dateTo: Date;
    @observable displayMode: DisplayMode = 'pack';
    @observable salesStat: ISalesStat[] = [];
    @observable needSalesStat: boolean = false;
    @observable currentDepartmentId: number;
    @observable medsDisplayStatus: Map<number, boolean> = new Map();

    constructor(rootStore: IRootStore) {
        super();
        this.rootStore = rootStore;

        reaction(
            () => [this.rootStore.departmentsStore.currentDepartment, this.needSalesStat],
            ([ currentDepartment, isSalesStatNeeded]: [ IDepartment, boolean ]) => {
                if (!isSalesStatNeeded) return;

                const newDepartmentId: number = currentDepartment
                ? currentDepartment.id
                : -1;

                if (this.currentDepartmentId !== newDepartmentId) this.salesStat = [];

                this.currentDepartmentId = newDepartmentId;
                this.loadStat(newDepartmentId);
            }
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
    setSalesStatDemand(value: boolean) {
        this.needSalesStat = value;
    }

    @action.bound
    toggleMedsDisplayStatus(id: number) {
        const current = this.medsDisplayStatus.get(id);
        this.medsDisplayStatus.set(id, !current);
    }

    @action.bound
    toggleAllMedsDisplayStatus() {
        const values = [...this.medsDisplayStatus.entries()];
        const shouldDisplayAll = values.some(x => x[1] === false);

        const newValue = shouldDisplayAll
        ? true
        : false;

        const newValues: Array<[number, boolean]> = values.map(([ key ]) => ([ key, newValue ]));

        this.medsDisplayStatus = new Map(newValues);
    }

    @action.bound
    async loadStat(departmentId: number) {
        const requestName = 'loadStat';
        const { api } = this.rootStore;

        if (departmentId === -1) return;

        this.setLoading(requestName, departmentId);

        const url = this.getLoadStatUrl(departmentId);
        const res = await api.getSalesStat(url);

        const storedId = this.getRequestParams(requestName);

        // if fetched data is not relevant, there is another api call to fetch actual data, so there is no need to process this api call result
        if (storedId !== departmentId) return;

        // if fetched data is relevant we process it
        const callback = res
        ? this.setSuccess
        : this.setError;

        callback(requestName);
        this.clearParams(requestName);

        this.salesStat = res;
        this.medsDisplayStatus = new Map(res.map(x => ([ x.medId, true ])));
    }

    private getLoadStatUrl(departmentId: number): string {
        const apiUrl = `api/branch/${departmentId}/ffm/sales`;

        let group_by: string = 'year';
        if (differenceInCalendarDays(this.dateTo, this.dateFrom) <= 30) group_by = 'day';
        else if (differenceInCalendarMonths(this.dateTo, this.dateFrom) <= 12) group_by = 'month';

        const urlParamsObject = {
            from: format(this.dateFrom, this.dateMask),
            to: format(this.dateTo, this.dateMask),
            group_by
        };

        const urlParams = stringify(urlParamsObject);

        return `${apiUrl}?${urlParams}`;
    }
}
