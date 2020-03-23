import { IRootStore } from './../interfaces/IRootStore';
import AsyncStore from './AsyncStore';
import { ISalesStore } from './../interfaces/ISalesStore';
import { observable, action, reaction } from 'mobx';
import { IDepartment } from '../interfaces/IDepartment';
import { ISalesStat } from '../interfaces/ISalesStat';
import { format, differenceInCalendarDays, differenceInCalendarMonths } from 'date-fns';
import { stringify } from 'query-string';
import { ILocaleSalesStat } from '../interfaces/ILocaleSalesStat';

export type DisplayMode = 'pack' | 'currency';

export default class SalesStore extends AsyncStore implements ISalesStore {
    readonly rootStore: IRootStore;
    readonly apiDateMask: string = 'yyyy-MM-dd';

    @observable dateFrom: Date;
    @observable dateTo: Date;
    @observable displayMode: DisplayMode = 'pack';
    @observable medsSalesStat: ISalesStat[] = [];
    @observable localeSalesStat: ILocaleSalesStat[] = [];
    @observable needSalesStat: boolean = false;
    @observable currentDepartmentId: number;
    @observable medsDisplayStatus: Map<number, boolean> = new Map();

    constructor(rootStore: IRootStore) {
        super();
        this.rootStore = rootStore;
        this.resetStore();
        reaction(
            () => [this.rootStore.departmentsStore.currentDepartment, this.needSalesStat],
            async ([ currentDepartment, isSalesStatNeeded]: [ IDepartment, boolean ]) => {
                if (!isSalesStatNeeded) return;

                const newDepartmentId: number = currentDepartment
                ? currentDepartment.id
                : -1;

                if (this.currentDepartmentId !== newDepartmentId) {
                    this.medsSalesStat = [];
                    this.localeSalesStat = [];
                }

                this.currentDepartmentId = newDepartmentId;
                await this.loadMedsStat();
                await this.loadLocaleSalesStat();
            }
        );
    }

    @action.bound
    resetStore() {
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

        this.displayMode = 'pack';
        this.medsSalesStat = [];
        this.localeSalesStat = [];
        this.needSalesStat = false;
        this.currentDepartmentId = null;
        this.medsDisplayStatus = new Map();
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
    async loadMedsStat() {
        const requestName = 'loadMedsStat';
        const { api } = this.rootStore;

        if (this.currentDepartmentId === -1) return;

        this.setLoading(requestName, this.currentDepartmentId);
        const url = this.getLoadStatUrl(this.currentDepartmentId);
        const res = await api.getSalesStat(url);

        const storedId = this.getRequestParams(requestName);

        // if fetched data is not relevant, there is another api call to fetch actual data, so there is no need to process this api call result
        if (storedId !== this.currentDepartmentId) return;

        // if fetched data is relevant we process it
        const callback = res
        ? this.setSuccess
        : this.setError;

        callback(requestName);
        this.clearParams(requestName);

        this.medsSalesStat = res;
    }

    @action.bound
    async loadLocaleSalesStat() {
        const requestName = 'loadLocaleSalesStat';
        const { api } = this.rootStore;

        if (this.currentDepartmentId === -1) return;

        this.setLoading(requestName, this.currentDepartmentId);
        const url = this.getLocaleSalesStatUrl(this.currentDepartmentId);
        const res = await api.getLocaleSalesStat(url);

        const storedId = this.getRequestParams(requestName);

        if (storedId !== this.currentDepartmentId) return;

        const callback = res
        ? this.setSuccess
        : this.setError;

        callback(requestName);
        this.clearParams(requestName);

        this.localeSalesStat = res;
    }

    @action.bound
    initMedsDisplayStatuses() {
        const { departmentsStore: { meds }} = this.rootStore;
        const values: Array<[number, boolean]> = [...meds.keys()].map(id => ([ id, true ]));
        this.medsDisplayStatus = new Map(values);
    }

    private getLocaleSalesStatUrl(departmentId: number): string {
        const apiUrl = `api/branch/${departmentId}/ffm/sales/region`;

        const urlParamsObject = {
            from: format(this.dateFrom, this.apiDateMask),
            to: format(this.dateTo, this.apiDateMask),
        };

        const urlParams = stringify(urlParamsObject);

        return `${apiUrl}?${urlParams}`;
    }

    private getLoadStatUrl(departmentId: number): string {
        const apiUrl = `api/branch/${departmentId}/ffm/sales`;

        let group_by: string = 'year';
        if (differenceInCalendarDays(this.dateTo, this.dateFrom) <= 30) group_by = 'day';
        else if (differenceInCalendarMonths(this.dateTo, this.dateFrom) <= 12) group_by = 'month';

        const urlParamsObject = {
            from: format(this.dateFrom, this.apiDateMask),
            to: format(this.dateTo, this.apiDateMask),
            group_by
        };

        const urlParams = stringify(urlParamsObject);

        return `${apiUrl}?${urlParams}`;
    }
}
