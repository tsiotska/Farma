import { UIStore } from './UIStore';
import { DepartmentsStore } from './DepartmentsStore';
import {ILocalizationStore, IRootStore} from '../interfaces';
import {RouterStore} from 'mobx-react-router';
import {APIRequester} from '../api/APIRequester';
import LocalizationStore from './LocalizationStore';
import UserStore from './UserStore';
import { IUserStore } from '../interfaces/IUserStore';
import { IUIStore } from '../interfaces/IUIStore';

/**
 * Class representing Root Store container that collects
 * all stores and injected as property in root component
 * provider after initialization.
 * @class
 */
export default class RootStore implements IRootStore {
    routingStore: RouterStore;
    localizationStore: ILocalizationStore;
    departmentsStore: DepartmentsStore;
    userStore: IUserStore;
    uiStore: IUIStore;
    api: APIRequester;

    constructor(routingStore: RouterStore) {
        this.api = new APIRequester();
        this.routingStore = routingStore;
        this.localizationStore = new LocalizationStore();
        this.userStore = new UserStore(this);
        this.departmentsStore = new DepartmentsStore(this);
        this.uiStore = new UIStore();
    }
}
