import { computed, action } from 'mobx';

import { IRootStore } from './../interfaces/IRootStore';
import AsyncStore from './AsyncStore';
import { IUserStore } from '../interfaces/IUserStore';
import { ADMIN } from '../constants/Roles';
import { IUser } from '../interfaces';

export default class UserStore extends AsyncStore implements IUserStore {
    rootStore: IRootStore;
    user: IUser;

    constructor(rootStore: IRootStore) {
        super();
        this.rootStore = rootStore;
        this.loadUserProfile();
    }

    @computed
    get role(): string {
        return ADMIN;
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
