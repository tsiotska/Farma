import { IRootStore } from './../interfaces/IRootStore';
import AsyncStore from './AsyncStore';
import { IUserStore } from '../interfaces/IUserStore';
import { computed, action } from 'mobx';

import { ADMIN } from '../constants/Roles';
import { IUser } from '../interfaces';

export default class UserStore extends AsyncStore implements IUserStore {
    rootStore: IRootStore;
    user: IUser;

    constructor(rootStore: IRootStore) {
        super();
        this.rootStore = rootStore;
    }

    @computed
    get role(): string {
        return ADMIN;
    }

    @action.bound
    async logout() {
        const requestName = 'logout';
        const { api } = this.rootStore;
        this.setLoading(requestName);
        await api.logout();
        this.setSuccess(requestName);
    }
}
