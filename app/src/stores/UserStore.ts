import { IUserCredentials } from './../interfaces/IUser';
import { computed, action, observable, toJS } from 'mobx';

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
        console.log(toJS(this.previewUser));
        return this.previewUser
        ? this.previewUser.position
        : USER_ROLE.UNKNOWN;
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

        this.setLoading(requestName);
        this.user = await api.getUser();
        if (this.user) this.navHistory.push(this.user);

        const callback = this.user
        ? this.setSuccess
        : this.setError;

        callback(requestName);

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

        if (loggedIn) {
            const userFetched = await this.loadUserProfile();

            const callback = userFetched
            ? this.setSuccess
            : this.setError;
            callback(requestName);

            return userFetched;
        } else {
            this.setError(requestName);
            return false;
        }
    }
}
