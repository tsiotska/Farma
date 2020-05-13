import { IRootStore } from './../interfaces/IRootStore';
import AsyncStore from './AsyncStore';
import { ISalesStore } from './../interfaces/ISalesStore';
import { observable, action, computed, toJS } from 'mobx';
import {
    endOfMonth,
    format,
    differenceInCalendarDays,
    differenceInCalendarMonths,
    subMonths
} from 'date-fns';
import { stringify } from 'query-string';
import { IMedsSalesStat, ISalesStat } from '../interfaces/ISalesStat';
import { USER_ROLE } from '../constants/Roles';
import { IUserCommonInfo } from '../interfaces/IUser';
import { ILPU } from '../interfaces/ILPU';
import { ILocation } from '../interfaces/ILocation';

export enum STAT_DISPLAY_MODE {
    PACK,
    CURRENCY
}
type AgentTargetProperty = 'city' | 'region' | null;

export default class SalesStore extends AsyncStore implements ISalesStore {
    readonly rootStore: IRootStore;
    readonly apiDateMask: string = 'yyyy-MM-dd';

    @observable dateFrom: Date;
    @observable dateTo: Date;
    @observable displayMode: STAT_DISPLAY_MODE = STAT_DISPLAY_MODE.PACK;

    @observable ignoredMeds: Set<number> = new Set();

    // data for chart
    @observable chartSalesStat: IMedsSalesStat[] = null;
    // data for drugsTable
    @observable locationSalesStat: ISalesStat[] = null;
    @observable ignoredLocations: Set<number> = new Set();
    // data for drugsTable
    @observable agentSalesStat: ISalesStat[] = null;
    @observable ignoredAgents: Set<number> = new Set();

    constructor(rootStore: IRootStore) {
        super();
        this.rootStore = rootStore;
        this.resetStore();
    }

    @computed
    get isAnyAgentIgnored(): boolean {
        return !!this.ignoredAgents.size;
    }

    @computed
    get isAnyLocationIgnored(): boolean {
        return !!this.ignoredLocations.size;
    }

    @computed
    get pharmaciesMap(): Map<number, ILPU> {
        const {
            departmentsStore: { pharmacies },
            userStore: { role }
        } = this.rootStore;

        const statExist = Array.isArray(this.locationSalesStat);
        const shouldReturnData = role === USER_ROLE.MEDICAL_AGENT;

        let data: Array<[number, ILPU]> = [];

        if (statExist && shouldReturnData && pharmacies) {
            const ids = this.locationSalesStat.map(({ id }) => id);
            data = pharmacies
                .filter(({ id }) => ids.includes(id))
                .map(x => ([ x.id, x ]));
        }

        return new Map(data);
    }

    // @computed
    // get sortedLocationSalesStat(): ISalesStat[] {
    //     // const {
    //     //     userStore: { role },
    //     //     uiStore: { salesPharmacyFilter: { map }}
    //     // } = this.rootStore;

    //     // if (role !== USER_ROLE.MEDICAL_AGENT || !map || !this.locationSalesStat) {
    //     //     return this.locationSalesStat;
    //     // }

    //     // return this.locationSalesStat.sort((a, b) => {
    //     //     const aIndx = map.indexOf(a.id);
    //     //     const bIndx = map.indexOf(b.id);
    //     //     return aIndx - bIndx;
    //     // });
    //     return this.locationSalesStat;
    // }

    @computed
    get sortedLocationSalesStat(): ISalesStat[] {
        const {
            userStore: { role },
            uiStore: { salesPharmacyFilter: { map }}
        } = this.rootStore;

        const sameStatusSortCallback = (role !== USER_ROLE.MEDICAL_AGENT || !map || !this.locationSalesStat)
        ? () => 0
        : (a: ISalesStat, b: ISalesStat) => {
            const aIndx = map.indexOf(a.id);
            const bIndx = map.indexOf(b.id);
            return aIndx - bIndx;
        };

        const callback = (a: ISalesStat, b: ISalesStat) => {
            const isLeftIgnored = this.ignoredLocations.has(a.id);
            const isRightIgnored = this.ignoredLocations.has(b.id);
            if (isLeftIgnored === isRightIgnored) return sameStatusSortCallback(a, b);
            return isLeftIgnored === true
                ? 1
                : -1;
        };

        return this.locationSalesStat
            ? this.locationSalesStat.slice().sort(callback)
            : this.locationSalesStat;
    }

    @computed
    get sortedAgentsSalesStat(): ISalesStat[] {
        const callback = (a: ISalesStat, b: ISalesStat) => {
            const isLeftIgnored = this.ignoredAgents.has(a.id);
            const isRightIgnored = this.ignoredAgents.has(b.id);
            if (isLeftIgnored === isRightIgnored) return 0;
            return isLeftIgnored === true
                ? 1
                : -1;
        };
        return this.agentSalesStat
            ? this.agentSalesStat.slice().sort(callback)
            : this.agentSalesStat;
    }

    @computed
    get agentsTargetProperty(): AgentTargetProperty {
        const { departmentsStore: { locationsAgents } } = this.rootStore;
        for (const [, agent] of locationsAgents) {
            const { city, region } = agent;
            if (region !== null) return 'region';
            if (city !== null) return 'city';
        }
        return null;
    }

    @computed
    get locations(): Map<number, ILocation> {
        const {
            userStore: { role },
            departmentsStore: { cities, regions }
        } = this.rootStore;

        return role === USER_ROLE.FIELD_FORCE_MANAGER
            ? regions
            : cities;
    }

    @action.bound
    async loadAllStat(withReset: boolean = true) {
        const { userStore: { role }} = this.rootStore;

        if (withReset) {
            this.chartSalesStat = null;
            this.locationSalesStat = null;
            this.agentSalesStat = null;
        }

        this.ignoredAgents.clear();
        this.ignoredLocations.clear();

        await this.loadMedsStat();
        if (role === USER_ROLE.FIELD_FORCE_MANAGER || role === USER_ROLE.REGIONAL_MANAGER) {
            await this.loadAgentSalesStat();
        }
        await this.loadLocaleSalesStat();
    }

    @action.bound
    resetStore() {
        // this.dateTo = endOfMonth(subMonths(new Date(), 1));

        this.dateTo = new Date();

        const fromYear = this.dateTo.getMonth() === 0
        ? this.dateTo.getFullYear() - 1
        : this.dateTo.getFullYear();

        this.dateFrom = new Date(fromYear, 0);

        this.displayMode = STAT_DISPLAY_MODE.PACK;
        this.chartSalesStat = null;
        this.locationSalesStat = null;
        this.agentSalesStat = null;
        this.ignoredMeds = new Set();
    }

    @action.bound
    setIgnoredLocations(numbers: Set<number>) {
        this.ignoredLocations = new Set(numbers.values());
    }

    @action.bound
    toggleIgnoredLocation = (locationId: number) => {
        const { departmentsStore: { locationsAgents }} = this.rootStore;

        if (this.ignoredLocations.has(locationId)) {
            this.ignoredLocations.delete(locationId);
        } else {
            this.ignoredLocations.add(locationId);
        }

        const callback = this.ignoredLocations.has(locationId)
            ? this.ignoredAgents.add
            : this.ignoredAgents.delete;

        locationsAgents.forEach((agent) => {
            const { id, [this.agentsTargetProperty]: location} = agent;
            if (location === locationId) callback.call(this.ignoredAgents, id);
        });
        // this.sortAgentsSales();
        // this.sortLocationsSales();
    }

    @action.bound
    toggleIgnoredAgents = (targetAgent: IUserCommonInfo) => {
        if (this.agentsTargetProperty === null) return;
        const { id, [this.agentsTargetProperty]: targetLocation } = targetAgent;
        const { departmentsStore: { locationsAgents }} = this.rootStore;

        if (this.ignoredAgents.has(id)) {
            this.ignoredAgents.delete(id);
            this.ignoredLocations.delete(targetLocation);
        } else {
            this.ignoredAgents.add(id);

            if (!Number.isInteger(targetLocation)) return;

            const agentsWithSameLocation: number[] = [];
            for (const [, agent] of locationsAgents) {
                const { id: agentId, [this.agentsTargetProperty]: location } = agent;
                if (location === targetLocation) agentsWithSameLocation.push(agentId);
            }

            if (agentsWithSameLocation.every(agentId => this.ignoredAgents.has(agentId))) {
                this.ignoredLocations.add(targetLocation);
            }
        }
        // this.sortAgentsSales();
        // this.sortLocationsSales();
    }

    @action.bound
    toggleAllIgnoredLocations() {
        const { departmentsStore: { locationsAgents }} = this.rootStore;

        if (this.ignoredLocations.size) {
            this.ignoredLocations.clear();
            this.ignoredAgents.clear();
        } else {
            this.ignoredLocations = new Set([...this.locations.keys()]);
            this.ignoredAgents = new Set([...locationsAgents.keys()]);
        }
    }

    @action.bound
    toggleAllIgnoredAgents() {
        const { departmentsStore: { locationsAgents }} = this.rootStore;

        if (this.ignoredAgents.size) {
            this.ignoredLocations.clear();
            this.ignoredAgents.clear();
        } else {
            this.ignoredLocations = new Set([...this.locations.keys()]);
            this.ignoredAgents = new Set([...locationsAgents.keys()]);
        }
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
    setDisplayMode(newMode: STAT_DISPLAY_MODE) {
        this.displayMode = newMode;
    }

    @action.bound
    toggleMedsDisplayStatus(id: number) {
        if (this.ignoredMeds.has(id)) {
            this.ignoredMeds.delete(id);
        } else {
            this.ignoredMeds.add(id);
        }
    }

    @action.bound
    toggleAllMedsDisplayStatus(departmentId: number) {
        const { departmentsStore: { meds }} = this.rootStore;
        const departmentMeds = meds.get(departmentId) || [];
        const ids = departmentMeds.map(({ id }) => id);
        const shouldDisplayAll = ids.some(x => this.ignoredMeds.has(x));

        if (shouldDisplayAll) {
            const ignoredItems = [...this.ignoredMeds.values()];
            const filtered = ignoredItems.filter(x => ids.includes(x) === false);
            this.ignoredMeds = new Set(filtered);
        } else {
            const ignoredItems = [...this.ignoredMeds.values(), ...ids];
            this.ignoredMeds = new Set(ignoredItems);
        }
    }

    @action.bound
    async loadMedsStat() {
        const requestName = 'loadMedsStat';
        const { api, departmentsStore: { currentDepartmentId } } = this.rootStore;
        const url = this.getMedsStatUrl(currentDepartmentId);

        if (!url) return;

        this.setLoading(requestName);
        const { cache, promise } = api.getMedsSalesStat(url);
        if (cache) this.chartSalesStat = cache;

        const res = await promise;
        // if fetched data is not relevant, there is another api call to fetch actual data, so there is no need to process this api call result
        const testUrl = this.getMedsStatUrl(this.rootStore.departmentsStore.currentDepartmentId);
        if (url !== testUrl) return;

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
        const id = currentDepartmentId;

        if (id === null || !url) return;

        this.setLoading(requestName);
        const { cache, promise } = api.getSalesStat(url);
        if (cache) this.locationSalesStat = cache;

        const res = await promise;

        if (id !== this.rootStore.departmentsStore.currentDepartmentId) return;

        this.locationSalesStat = res;

        const callback = res
        ? this.setSuccess
        : this.setError;
        callback(requestName);
    }

    @action.bound
    async loadAgentSalesStat() {
        const requestName = 'loadAgentSalesStat';
        const { api, departmentsStore: { currentDepartmentId } } = this.rootStore;
        const url = this.getAgentStatUrl(currentDepartmentId);
        const id = currentDepartmentId;

        if (id === null || !url) return;

        this.setLoading(requestName);
        const { cache, promise } = await api.getSalesStat(url);
        if (cache) this.agentSalesStat = cache;

        const res = await promise;

        if (id !== this.rootStore.departmentsStore.currentDepartmentId) return;
        this.agentSalesStat = res;

        const callback = res
        ? this.setSuccess
        : this.setError;

        callback(requestName);
        this.clearParams(requestName);
    }

    @action.bound
    async loadSalesExcel() {
        const { api, departmentsStore: { currentDepartmentId } } = this.rootStore;
        if (!currentDepartmentId) return;
        const url = this.getMedsStatUrl(currentDepartmentId, true);
        if (url) api.getExcel(url);
    }

    @action.bound
    async loadLocationsExcel() {
        const { api, departmentsStore: { currentDepartmentId } } = this.rootStore;
        const url = this.getLocationStatUrl(currentDepartmentId, true);
        if (currentDepartmentId === null || !url) return;
        api.getExcel(url);
    }

    @action.bound
    async loadAgentsSalesExcel() {
        const { api, departmentsStore: { currentDepartmentId } } = this.rootStore;
        const url = this.getAgentStatUrl(currentDepartmentId, true);
        if (currentDepartmentId === null || !url) return;
        api.getExcel(url);
    }

    private getAgentStatUrl(departmentId: number, excel?: boolean) {
        const { userStore: { role, previewUser }} = this.rootStore;

        const params: any = {
            from: format(this.dateFrom, this.apiDateMask),
            to: format(this.dateTo, this.apiDateMask),
        };

        if (excel) params.excel = 1;

        const urlParams = stringify(params);

        const userId = previewUser
        ? previewUser.id
        : -1;

        switch (role) {
            case USER_ROLE.FIELD_FORCE_MANAGER:
                return `/api/branch/${departmentId}/ffm/sales/rm?${urlParams}`;
            case USER_ROLE.REGIONAL_MANAGER:
                return `/api/branch/${departmentId}/rm/${userId}/sales/mp?${urlParams}`;
            default: return null;
        }
    }

    private getLocationStatUrl(departmentId: number, excel?: boolean): string {
        const { userStore: { role, previewUser }} = this.rootStore;

        const params: any = {
            from: format(this.dateFrom, this.apiDateMask),
            to: format(this.dateTo, this.apiDateMask),
        };

        if (excel) params.excel = 1;

        const urlParams = stringify(params);

        const userId = previewUser
        ? previewUser.id
        : -1;

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

    private getMedsStatUrl(departmentId: number, excel?: boolean): string {
        const { userStore: { user, previewUser } } = this.rootStore;

        const userId = previewUser
        ? previewUser.id
        : -1;

        let group_by: string = 'year';
        if (differenceInCalendarDays(this.dateTo, this.dateFrom) <= 30) group_by = 'day';
        else if (differenceInCalendarMonths(this.dateTo, this.dateFrom) <= 12) group_by = 'month';

        const params: any = {
            from: format(this.dateFrom, this.apiDateMask),
            to: format(this.dateTo, this.apiDateMask),
            group_by,
        };

        if (excel) params.excel = 1;

        const paramsStringified = stringify(params);

        const targetRole = previewUser
        ? previewUser.position
        : user.position;

        switch (targetRole) {
            case USER_ROLE.ADMIN:
                return `api/sales?${paramsStringified}`;
            case USER_ROLE.FIELD_FORCE_MANAGER:
                return `api/branch/${departmentId}/ffm/sales?${paramsStringified}`;
            case USER_ROLE.REGIONAL_MANAGER:
                return `/api/branch/${departmentId}/rm/${userId}/sales?${paramsStringified}`;
            case USER_ROLE.MEDICAL_AGENT:
                return `/api/branch/${departmentId}/mp/${userId}/sales?${paramsStringified}`;
            default: return null;
        }
    }
}
