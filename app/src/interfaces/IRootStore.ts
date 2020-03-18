import { ISalesStore } from './ISalesStore';
import { IDepartmentsStore } from './IDepartmentsStore';
import { ILocalizationStore } from './ILocalizationStore';
import { APIRequester } from '../api/APIRequester';
import {RouterStore} from 'mobx-react-router';

export interface IRootStore {
    localizationStore: ILocalizationStore;
    api: APIRequester;
    routingStore: RouterStore;
    departmentsStore: IDepartmentsStore;
    salesStore: ISalesStore;
}
