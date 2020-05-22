import { IRootStore } from './../interfaces/IRootStore';
import { INotification } from './../interfaces/iNotification';
import { SNACKBAR_TYPE } from './../constants/Snackbars';
import { IUIStore } from '../interfaces/IUIStore';
import { observable, action, toJS } from 'mobx';
import { SortableProps } from '../components/LpuFilterPopper/LpuFilterPopper';
import { ILPU } from '../interfaces/ILPU';

export enum SORT_ORDER {
    ASCENDING = 1, // a-z
    DESCENDING // z-a
}

export interface ISortBy {
    order: SORT_ORDER;
    propName: SortableProps;
}

export interface IFilterBy {
    propName: SortableProps;
    ignoredItems: any[];
}

export interface IDeletePopoverSettings {
    name: string;
    anchorEl: Element;
    callback: (confirm: boolean) => void;
}

export interface ISalesPharmacyFilter {
    order: SORT_ORDER;
    ignoredLpus: Set<number>;
    map?: number[];
}

export interface INotificationSnackbar {
    type: SNACKBAR_TYPE;
    message: string;
}

export class UIStore implements IUIStore {
    rootStore: IRootStore;
    @observable notificationSnackbar: INotificationSnackbar = {
        type: SNACKBAR_TYPE.SUCCESS,
        message: ''
    };
    @observable salesHeaderHeight: number;
    @observable openedModal: string;
    @observable modalPayload: any;
    @observable itemsPerPage: Readonly<number> = 50;
    @observable currentPage: number = 0;
    @observable delPopoverSettings: IDeletePopoverSettings = {
        anchorEl: null,
        callback: null,
        name: ''
    };
    @observable isInfoPopperOpen: boolean = false;

    @observable LpuSortSettings: ISortBy = null;
    @observable LpuFilterSettings: IFilterBy = null;

    @observable salesPharmacyFilter: ISalesPharmacyFilter = {
        order: null,
        ignoredLpus: new Set(),
        map: []
    };

    constructor(rootStore: IRootStore) {
        this.rootStore = rootStore;
    }

    @action.bound
    setPharmacyFilters(value: ISalesPharmacyFilter) {
        const { salesStore: { setIgnoredLocations }} = this.rootStore;
        if (value !== null) {
            const { ignoredLpus } = value;
            setIgnoredLocations(ignoredLpus);
        } else {
            setIgnoredLocations(new Set());
        }

        this.salesPharmacyFilter = value === null
            ? { order: null, ignoredLpus: new Set(), map: [] }
            : { ...value, ignoredLpus: new Set() };
    }

    @action.bound
    setInfoPopper(val: boolean) {
        this.isInfoPopperOpen = val;
    }

    @action.bound
    openDelPopper(settings: IDeletePopoverSettings) {
        this.delPopoverSettings = settings === null
            ? { anchorEl: null, callback: null, name: '' }
            : { ...settings };
    }

    @action.bound
    setSalesHeaderHeight(value: number) {
        this.salesHeaderHeight = value > 0
        ? value
        : 0;
    }

    @action.bound
    openModal(modalName: string, payload: any = null) {
        this.openedModal = modalName;
        this.modalPayload = modalName === null
        ? null
        : payload;
    }

    @action.bound
    setCurrentPage(value: number) {
        this.currentPage = value;
    }

    @action.bound
    sortLpuBy(propName: SortableProps, order: SORT_ORDER) {
        this.LpuSortSettings = { propName, order };
    }

    @action.bound
    clearLpuSorting() {
        this.LpuSortSettings = null;
    }

    @action.bound
    filterLpuBy(propName: SortableProps, ignoredItems: ILPU[]) {
        this.LpuFilterSettings = { propName, ignoredItems: [...ignoredItems] };
    }

    @action.bound
    clearLpuFilters() {
        this.LpuFilterSettings = null;
    }

    @action.bound
    openNotificationSnackbar(newNotification: INotificationSnackbar) {
        if (newNotification === null) this.notificationSnackbar.message = null;
        const snackbarIsOpen = !!this.notificationSnackbar.message;
        if (snackbarIsOpen) this.notificationSnackbar.message = '';
        setTimeout(() => {
            this.notificationSnackbar = newNotification;
        }, 300);
    }
}
