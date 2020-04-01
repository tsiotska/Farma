import { IUserStore } from './IUserStore';
import { ISalesStore } from './ISalesStore';
import { IDepartmentsStore } from './IDepartmentsStore';
import { ILocalizationStore } from './ILocalizationStore';
import { APIRequester } from '../api/APIRequester';
import { IUIStore } from './IUIStore';

export interface IRootStore {
    localizationStore: ILocalizationStore;
    api: APIRequester;
    departmentsStore: IDepartmentsStore;
    salesStore: ISalesStore;
    userStore: IUserStore;
    uiStore: IUIStore;
}
