import { ISalesStore } from './../interfaces/ISalesStore';
import { UIStore } from './UIStore';
import { DepartmentsStore } from './DepartmentsStore';
import {ILocalizationStore, IRootStore} from '../interfaces';
import {APIRequester} from '../api/APIRequester';
import LocalizationStore from './LocalizationStore';
import UserStore from './UserStore';
import { IUserStore } from '../interfaces/IUserStore';
import { IUIStore } from '../interfaces/IUIStore';
import SalesStore from './SalesStore';

/**
 * Class representing Root Store container that collects
 * all stores and injected as property in root component
 * provider after initialization.
 * @class
 */
export default class RootStore implements IRootStore {
    localizationStore: ILocalizationStore;
    departmentsStore: DepartmentsStore;
    userStore: IUserStore;
    uiStore: IUIStore;
    salesStore: ISalesStore;
    api: APIRequester;

    constructor() {
        this.api = new APIRequester();
        this.localizationStore = new LocalizationStore();
        this.departmentsStore = new DepartmentsStore(this);
        this.userStore = new UserStore(this);
        this.salesStore = new SalesStore(this);
        this.uiStore = new UIStore();
    }
}
