import { IUserStore } from './IUserStore';
import { ISalesStore } from './ISalesStore';
import { IDepartmentsStore } from './IDepartmentsStore';
import { APIRequester } from '../api/APIRequester';
import { IUIStore } from './IUIStore';
import { History } from 'history';

export interface IRootStore {
    api: APIRequester;
    departmentsStore: IDepartmentsStore;
    salesStore: ISalesStore;
    userStore: IUserStore;
    uiStore: IUIStore;
}
