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

export type DisplayMode = 'pack' | 'currency';
type AgentTargetProperty = 'city' | 'region' | null;

export default class SalesStore extends AsyncStore implements ISalesStore {
    readonly rootStore: IRootStore;
    readonly apiDateMask: string = 'yyyy-MM-dd';

    @observable dateFrom: Date;
    @observable dateTo: Date;
    @observable displayMode: DisplayMode = 'pack';

    // @observable currentDepartmentId: number;
    @observable medsDisplayStatus: Map<number, boolean> = new Map();

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

        if (statExist && shouldReturnData) {
            const ids = this.locationSalesStat.map(({ id }) => id);
            data = pharmacies
                .filter(({ id }) => ids.includes(id))
                .map(x => ([ x.id, x ]));
        }

        return new Map(data);
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
        this.dateTo = endOfMonth(subMonths(new Date(), 1));

        const fromYear = this.dateTo.getMonth() === 0
        ? this.dateTo.getFullYear() - 1
        : this.dateTo.getFullYear();

        this.dateFrom = new Date(fromYear, 0);

        this.displayMode = 'pack';
        this.chartSalesStat = null;
        this.locationSalesStat = null;
        this.agentSalesStat = null;
        this.medsDisplayStatus = new Map();
    }

    @action.bound
    toggleIgnoredLocation = (locationId: number) => {
        const { departmentsStore: { locationsAgents }} = this.rootStore;

        if (this.ignoredLocations.has(locationId)) this.ignoredLocations.delete(locationId);
        else this.ignoredLocations.add(locationId);

        if (this.agentsTargetProperty === null) return;

        locationsAgents.forEach(agent => {
            const { id, [this.agentsTargetProperty]: location} = agent;
            if (location === locationId) this.ignoredAgents.add(id);
        });
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
    }

    @action.bound
    toggleAllIgnoredLocations() {
        const { departmentsStore: { locations, locationsAgents }} = this.rootStore;

        if (this.ignoredLocations.size) {
            this.ignoredLocations.clear();
            this.ignoredAgents.clear();
        } else {
            this.ignoredLocations = new Set([...locations.keys()]);
            this.ignoredAgents = new Set([...locationsAgents.keys()]);
        }
    }

    @action.bound
    toggleAllIgnoredAgents() {
        const { departmentsStore: { locations, locationsAgents }} = this.rootStore;

        if (this.ignoredAgents.size) {
            this.ignoredLocations.clear();
            this.ignoredAgents.clear();
        } else {
            this.ignoredLocations = new Set([...locations.keys()]);
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
    setDisplayMode(newMode: DisplayMode) {
        this.displayMode = newMode;
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
        const id = currentDepartmentId;

        if (id === null || !url) return;

        this.setLoading(requestName);
        const { cache, promise } = api.getMedsSalesStat(url);
        if (cache) this.chartSalesStat = cache;

        const res = await promise;

        // if fetched data is not relevant, there is another api call to fetch actual data, so there is no need to process this api call result
        if (id !== this.rootStore.departmentsStore.currentDepartmentId) return;
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
