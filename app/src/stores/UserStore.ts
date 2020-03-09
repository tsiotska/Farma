import { computed, action, observable } from 'mobx';

import { IRootStore } from './../interfaces/IRootStore';
import AsyncStore from './AsyncStore';
import { IUserStore } from '../interfaces/IUserStore';
import { IUser } from '../interfaces';

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
        return this.user
        ? this.user.position
        : null;
    }

    @action.bound
    async loadUserProfile() {
        const requestName = 'loadUserProfile';
        const { api } = this.rootStore;

        const user = await this.dispatchRequest(api.getUser(), requestName);

        if (user) this.user = user;
    }

    @action.bound
    logout() {
        const requestName = 'logout';
        const { api } = this.rootStore;

        this.dispatchRequest(api.logout(), requestName);
    }
}
