import {ILocalizationStore, IRootStore} from '../interfaces';
import {RouterStore} from 'mobx-react-router';
import {APIRequester} from '../api/APIRequester';
import {observable} from 'mobx';
import LocalizationStore from './LocalizationStore';

/**
 * Class representing Root Store container that collects
 * all stores and injected as property in root component
 * provider after initialization.
 * @class
 */
export default class RootStore implements IRootStore {
    public routingStore: RouterStore;
    public localizationStore: ILocalizationStore;
    public api: APIRequester;

    constructor(routingStore: RouterStore) {
        this.api = new APIRequester();
        this.routingStore = routingStore;
        this.localizationStore = new LocalizationStore();
    }

}
