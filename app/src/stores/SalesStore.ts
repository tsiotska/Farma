import { IRootStore } from './../interfaces/IRootStore';
import AsyncStore from './AsyncStore';
import { ISalesStore } from './../interfaces/ISalesStore';
import { observable, action, reaction } from 'mobx';
import { format, differenceInCalendarDays, differenceInCalendarMonths } from 'date-fns';
import { stringify } from 'query-string';
import { IMedsSalesStat, ISalesStat } from '../interfaces/ISalesStat';
import { USER_ROLE } from '../constants/Roles';

export type DisplayMode = 'pack' | 'currency';

export default class SalesStore extends AsyncStore implements ISalesStore {
    readonly rootStore: IRootStore;
    readonly apiDateMask: string = 'yyyy-MM-dd';

    @observable dateFrom: Date;
    @observable dateTo: Date;
    @observable displayMode: DisplayMode = 'pack';

    @observable needSalesStat: boolean = false;
    // @observable currentDepartmentId: number;
    @observable medsDisplayStatus: Map<number, boolean> = new Map();

    // data for chart
    @observable chartSalesStat: IMedsSalesStat[] = null;
    // data for drugsTable
    @observable locationSalesStat: ISalesStat[] = null;
    // data for drugsTable
    @observable agentSalesStat: ISalesStat[] = null;

    constructor(rootStore: IRootStore) {
        super();
        this.rootStore = rootStore;
        this.resetStore();
        reaction(
            () => [
                this.needSalesStat,
                this.rootStore.departmentsStore.currentDepartmentId,
                this.rootStore.userStore.previewUser
            ],
            ([ isSalesStatNeeded ]: [ number ]) => {
                if (!isSalesStatNeeded) return;
                const { departmentsStore: { loadLocationsAgents }} = this.rootStore;
                loadLocationsAgents();
                this.loadAllStat();
            }
        );
    }

    @action.bound
    async loadAllStat(withReset: boolean = true) {
        const { userStore: { role }} = this.rootStore;

        if (withReset) {
            this.chartSalesStat = null;
            this.locationSalesStat = null;
            this.agentSalesStat = null;
        }

        await this.loadMedsStat();
        if (role === USER_ROLE.FIELD_FORCE_MANAGER || role === USER_ROLE.REGIONAL_MANAGER) {
            await this.loadAgentSalesStat();
        }
        await this.loadLocaleSalesStat();
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
        this.chartSalesStat = null;
        this.locationSalesStat = null;
        this.agentSalesStat = null;
        this.needSalesStat = false;
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
    initMedsDisplayStatuses() {
        const { departmentsStore: { meds }} = this.rootStore;
        const values: Array<[number, boolean]> = [...meds.keys()].map(id => ([ id, true ]));
        this.medsDisplayStatus = new Map(values);
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
        const { api, departmentsStore: { currentDepartmentId } } = this.rootStore;
        const url = this.getMedsStatUrl(currentDepartmentId);

        if (currentDepartmentId === -1 || !url) return;

        this.setLoading(requestName, currentDepartmentId);
        const res = await api.getMedsSalesStat(url);

        const storedId = this.getRequestParams(requestName);
        // if fetched data is not relevant, there is another api call to fetch actual data, so there is no need to process this api call result
        if (storedId !== this.rootStore.departmentsStore.currentDepartmentId) return;
        this.chartSalesStat = res;

        // if fetched data is relevant we process it
        const callback = res
        ? this.setSuccess
        : this.setError;

        callback(requestName);
        this.clearParams(requestName);
    }

    @action.bound
    async loadLocaleSalesStat() {
        const requestName = 'loadLocaleSalesStat';
        const { api, departmentsStore: { currentDepartmentId } } = this.rootStore;
        const url = this.getLocationStatUrl(currentDepartmentId);

        if (currentDepartmentId === -1 || !url) return;

        this.setLoading(requestName, currentDepartmentId);
        const res = await api.getSalesStat(url);

        const storedId = this.getRequestParams(requestName);
        if (storedId !== this.rootStore.departmentsStore.currentDepartmentId) return;
        this.locationSalesStat = res;

        const callback = res
        ? this.setSuccess
        : this.setError;

        callback(requestName);
        this.clearParams(requestName);
    }

    @action.bound
    async loadAgentSalesStat() {
        const requestName = 'loadAgentSalesStat';
        const { api, departmentsStore: { currentDepartmentId } } = this.rootStore;
        const url = this.getAgentStatUrl(currentDepartmentId);

        if (currentDepartmentId === -1 || !url) return;

        this.setLoading(requestName, currentDepartmentId);
        const res = await api.getSalesStat(url);

        const storedId = this.getRequestParams(requestName);
        if (storedId !== this.rootStore.departmentsStore.currentDepartmentId) return;
        this.agentSalesStat = res;

        const callback = res
        ? this.setSuccess
        : this.setError;

        callback(requestName);
        this.clearParams(requestName);
    }

    private getAgentStatUrl(departmentId: number) {
        const { userStore: { role, previewUser }} = this.rootStore;

        const userId = previewUser
        ? previewUser.id
        : -1;

        const urlParams = stringify({
            from: format(this.dateFrom, this.apiDateMask),
            to: format(this.dateTo, this.apiDateMask),
        });

        switch (role) {
            case USER_ROLE.FIELD_FORCE_MANAGER:
                return `/api/branch/${departmentId}/ffm/sales/rm?${urlParams}`;
            case USER_ROLE.REGIONAL_MANAGER:
                return `/api/branch/${departmentId}/rm/${userId}/sales/mp?${urlParams}`;
            default: return null;
        }
    }

    private getLocationStatUrl(departmentId: number): string {
        const { userStore: { role, previewUser }} = this.rootStore;

        const userId = previewUser
        ? previewUser.id
        : -1;

        const urlParams = stringify({
            from: format(this.dateFrom, this.apiDateMask),
            to: format(this.dateTo, this.apiDateMask),
        });

        switch (role) {
            case USER_ROLE.FIELD_FORCE_MANAGER:
                return `api/branch/${departmentId}/ffm/sales/region?${urlParams}`;
            case USER_ROLE.REGIONAL_MANAGER:
                return `/api/branch/${departmentId}/rm/${userId}/sales/city?${urlParams}`;
            case USER_ROLE.MEDICAL_AGENT:
                return `/api/branch/${departmentId}/mp/${userId}/sales/pharmacy?${urlParams}`;
            default: return null;
        }
    }

    private getMedsStatUrl(departmentId: number): string {
        const { userStore: { role, previewUser } } = this.rootStore;

        const userId = previewUser
        ? previewUser.id
        : -1;

        let group_by: string = 'year';
        if (differenceInCalendarDays(this.dateTo, this.dateFrom) <= 30) group_by = 'day';
        else if (differenceInCalendarMonths(this.dateTo, this.dateFrom) <= 12) group_by = 'month';

        const urlParams = stringify({
            from: format(this.dateFrom, this.apiDateMask),
            to: format(this.dateTo, this.apiDateMask),
            group_by
        });

        switch (role) {
            case USER_ROLE.FIELD_FORCE_MANAGER:
                return `api/branch/${departmentId}/ffm/sales?${urlParams}`;
            case USER_ROLE.REGIONAL_MANAGER:
                return `/api/branch/${departmentId}/rm/${userId}/sales?${urlParams}`;
            case USER_ROLE.MEDICAL_AGENT:
                return `/api/branch/${departmentId}/mp/${userId}/sales?${urlParams}`;
            default: return null;
        }
    }
}
