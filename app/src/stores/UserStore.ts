import { IUserCredentials } from './../interfaces/IUser';
import { computed, action, observable } from 'mobx';

import { IRootStore } from './../interfaces/IRootStore';
import AsyncStore from './AsyncStore';
import { IUserStore } from '../interfaces/IUserStore';
import { IUser } from '../interfaces';
import {
    UNKNOWN,
    FIELD_FORCE_MANAGER,
    ADMIN,
    REGIONAL_MANAGER,
    MEDICAL_AGENT
} from '../constants/Roles';

export default class UserStore extends AsyncStore implements IUserStore {
    rootStore: IRootStore;
    @observable user: IUser;

    constructor(rootStore: IRootStore) {
        super();
        this.rootStore = rootStore;
        this.loadUserProfile();
    }

    @computed
    get isUserFetched(): boolean {
        const { success, error } = this.getAsyncStatus('loadUserProfile');
        return success || error;
    }

    @computed
    get isUserLoading(): boolean {
        return this.getAsyncStatus('loadUserProfile').loading;
    }

    @computed
    get role(): string {
        const position = this.user
        ? this.user.position
        : -1;

        switch (position) {
            case 1: return ADMIN;
            case 2: return FIELD_FORCE_MANAGER;
            case 3: return REGIONAL_MANAGER;
            case 4: return MEDICAL_AGENT;
            default: return UNKNOWN;
        }
    }

    @action.bound
    async loadUserProfile() {
        const requestName = 'loadUserProfile';
        const { api } = this.rootStore;

        this.setLoading(requestName);
        const user = await api.getUser();

        if (user) {
            this.user = user;
            this.setError(requestName);
        } else {
            this.setSuccess(requestName);
        }

        return !!user;
    }

    @action.bound
    logout() {
        const requestName = 'logout';
        const {
            api,
            departmentsStore: { initializeStore: reInitDepartmentsStore  },
            salesStore: { initializeStore: reInitSalesStore }
        } = this.rootStore;

        this.dispatchRequest(api.logout(), requestName);
        this.user = null;
        reInitDepartmentsStore();
        reInitSalesStore();
    }

    @action.bound
    async login(credentials: IUserCredentials): Promise<boolean> {
        const requestName = 'login';
        const { api } = this.rootStore;

        this.setLoading(requestName);
        const loggedIn: boolean = await api.login(credentials);

        if (!loggedIn) {
            this.setError(requestName);
            return false;
        }

        const userFetched = await this.loadUserProfile();
        this.setSuccess(requestName);
        return userFetched;
    }
}
