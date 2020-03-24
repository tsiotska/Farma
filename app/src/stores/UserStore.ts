import { IUserCredentials } from './../interfaces/IUser';
import { computed, action, observable } from 'mobx';

import { IRootStore } from './../interfaces/IRootStore';
import AsyncStore from './AsyncStore';
import { IUserStore } from '../interfaces/IUserStore';
import { IUser } from '../interfaces';
import { USER_ROLE } from '../constants/Roles';

export default class UserStore extends AsyncStore implements IUserStore {
    rootStore: IRootStore;
    @observable user: IUser;
    // used for nav
    @observable navHistory: IUser[] = [];

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
    get previewUser(): IUser {
        return this.navHistory[this.navHistory.length - 1] || null;
    }

    @computed
    get role(): USER_ROLE {
        const position = this.previewUser
        ? this.previewUser.position
        : -1;

        switch (position) {
            case 1: return USER_ROLE.ADMIN;
            case 2: return USER_ROLE.FIELD_FORCE_MANAGER;
            case 3: return USER_ROLE.REGIONAL_MANAGER;
            case 4: return USER_ROLE.MEDICAL_AGENT;
            default: return USER_ROLE.UNKNOWN;
        }
    }

    @action.bound
    historyPush(newUser: IUser) {
        this.navHistory.push(newUser);
    }

    @action.bound
    historyGoTo(userId: number) {
        const userIndex = this.navHistory.findIndex(({ id }) => id === userId);
        this.navHistory.splice(userIndex);
    }

    @action.bound
    async loadUserProfile() {
        const requestName = 'loadUserProfile';
        const { api } = this.rootStore;

        this.user = await this.dispatchRequest(api.getUser(), requestName);
        if (this.user) this.navHistory.push(this.user);

        return !!this.user;
    }

    @action.bound
    logout() {
        const requestName = 'logout';
        const {
            api,
            departmentsStore: { resetStore: resetDepartmentsStore  },
            salesStore: { resetStore: resetSalesStore }
        } = this.rootStore;

        this.dispatchRequest(api.logout(), requestName);
        this.user = null;
        this.navHistory = [];
        resetDepartmentsStore();
        resetSalesStore();
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
