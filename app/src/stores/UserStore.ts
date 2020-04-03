import { computed, action, observable, toJS } from 'mobx';

import { IUserCredentials, IUserCommonInfo } from './../interfaces/IUser';
import { IRootStore } from './../interfaces/IRootStore';
import AsyncStore from './AsyncStore';
import { IUserStore } from '../interfaces/IUserStore';
import { IUser } from '../interfaces';
import { USER_ROLE, singleDepartmentRoles, multiDepartmentRoles } from '../constants/Roles';
import { defaultUser } from '../helpers/normalizers/userNormalizer';

export default class UserStore extends AsyncStore implements IUserStore {
    rootStore: IRootStore;
    @observable user: IUser;
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
    get isAdmin(): boolean {
        return this.user
        ? multiDepartmentRoles.includes(this.user.position)
        : false;
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
        this.navHistory = this.navHistory.filter((_, i) => i <= userIndex);
    }

    @action.bound
    async loadUserInfo(agentInfo: IUserCommonInfo, role?: USER_ROLE) {
        const position = role || this.getNextRole();
        this.navHistory.push({ ...defaultUser, ...agentInfo, position });
        const res = await this.rootStore.api.getUser(agentInfo.id);
        if (!res) return;

        const agent = this.navHistory.find(({ id }) => id === res.id);
        if (agent) {
            for (const prop in res) {
                const agentValue = agent[prop];
                const newValue = res[prop];
                if (agentValue !== newValue && newValue) {
                    agent[prop] = newValue;
                }
            }
        }
    }

    @action.bound
    async renewHistory(ffm?: IUser) {
        this.clearHistory();
        this.loadUserInfo(ffm, USER_ROLE.FIELD_FORCE_MANAGER);
    }

    @action.bound
    clearHistory() {
        this.navHistory = [];
    }

    @action.bound
    async loadUserProfile() {
        const requestName = 'loadUserProfile';
        const {
            api,
            departmentsStore: {
                loadPositions,
                loadDepartments,
                setCurrentDepartment,
                loadFFMs
        } } = this.rootStore;

        this.setLoading(requestName);
        const user = await api.getUser();

        if (!user) {
            this.setError(requestName);
            return false;
        }

        await Promise.all([
            loadPositions(),
            loadDepartments()
        ]);

        if (singleDepartmentRoles.includes(user.position)) {
            setCurrentDepartment(user.department);
            this.navHistory.push(user);
        } else if (multiDepartmentRoles.includes(user.position)) {
            loadFFMs();
        }
        this.user = user;
        this.setSuccess(requestName);
        return true;
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

    private getNextRole(): USER_ROLE {
        switch (this.role) {
            case USER_ROLE.FIELD_FORCE_MANAGER: return USER_ROLE.FIELD_FORCE_MANAGER;
            case USER_ROLE.REGIONAL_MANAGER: return USER_ROLE.REGIONAL_MANAGER;
            default: return USER_ROLE.UNKNOWN;
        }
    }
}
