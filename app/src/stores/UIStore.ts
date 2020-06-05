import { IRootStore } from './../interfaces/IRootStore';
import { SNACKBAR_TYPE } from './../constants/Snackbars';
import { IUIStore } from '../interfaces/IUIStore';
import { observable, action, toJS } from 'mobx';
import { LPUSortableProps } from '../components/LpuFilterPopper/LpuFilterPopper';
import { DoctorsSortableProps } from '../components/DoctorsFilterPopper/DoctorsFilterPopper';
import { ILPU } from '../interfaces/ILPU';

export enum SORT_ORDER {
    ASCENDING = 1, // a-z
    DESCENDING // z-a
}

export interface ISortBy {
    order: SORT_ORDER;
    propName: LPUSortableProps | DoctorsSortableProps;
}

export interface IFilterBy {
    propName: LPUSortableProps | DoctorsSortableProps;
    ignoredItems: any[];
}

export interface IDeletePopoverSettings {
    name: string;
    anchorEl: Element;
    callback: (confirm: boolean, type?: string, id?: number) => void;
}

export interface ISalesPharmacyFilter {
    order: SORT_ORDER;
    ignoredLpus: Set<number>;
    map?: number[];
}

export interface ISnackbar {
    type: SNACKBAR_TYPE;
    message: string;
}

export class UIStore implements IUIStore {
    rootStore: IRootStore;
    @observable notificationSnackbar: ISnackbar = {
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

    @observable sortSettings: ISortBy = null;
    @observable filterSettings: IFilterBy = null;

    @observable salesPharmacyFilter: ISalesPharmacyFilter = {
        order: null,
        ignoredLpus: new Set(),
        map: []
    };
    @observable isSynchronizing: boolean = false;
    @observable synchronizingSnackbar: ISnackbar = {
        type: SNACKBAR_TYPE.SUCCESS,
        message: ''
    };

    constructor(rootStore: IRootStore) {
        this.rootStore = rootStore;
    }

    @action.bound
    setPharmacyFilters(value: ISalesPharmacyFilter) {
        const { salesStore: { setIgnoredLocations } } = this.rootStore;
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
    setSynchronizing(val: boolean) {
        this.isSynchronizing = val;
    }

    @action.bound
    setSnackbarType(isSynchronized: boolean) {
        this.synchronizingSnackbar.type = isSynchronized
            ? SNACKBAR_TYPE.SUCCESS
            : SNACKBAR_TYPE.ERROR;
        this.synchronizingSnackbar.message = isSynchronized
            ? 'Синхронізовано'
            : 'Не вдалося синхронізувати';
    }

    @action.bound
    synchSnackbarCloseHandler() {
        this.synchronizingSnackbar.message = '';
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
    sortDataBy(propName: LPUSortableProps | DoctorsSortableProps, order: SORT_ORDER) {
        this.sortSettings = { propName, order };
    }

    @action.bound
    clearSorting() {
        this.sortSettings = null;
    }

    @action.bound
    filterDataBy(propName: LPUSortableProps | DoctorsSortableProps, ignoredItems: ILPU[]) {
        this.filterSettings = { propName, ignoredItems: [...ignoredItems] };
    }

    @action.bound
    clearFilters() {
        this.filterSettings = null;
    }

    @action.bound
    openNotificationSnackbar(newNotification: ISnackbar) {
        if (newNotification === null) this.notificationSnackbar.message = null;
        const snackbarIsOpen = !!this.notificationSnackbar.message;
        if (snackbarIsOpen) this.notificationSnackbar.message = '';
        setTimeout(() => {
            this.notificationSnackbar = newNotification;
        }, 300);
    }
}
