import { ADD_MEDICINE_MODAL, ADD_LPU_MODAL } from './../constants/Modals';
import AsyncStore from './AsyncStore';
import { IUIStore } from '../interfaces/IUIStore';
import { observable, action } from 'mobx';
import { SALARY_PREVIEW_MODAL, ADD_DEPARTMENT_MODAL } from '../constants/Modals';
import { SortableProps } from '../components/LpuFilterPopper/LpuFilterPopper';

export enum SORT_ORDER {
    ASCENDING, // a-z
    DESCENDING // z-a
}

export interface ISortBy {
    order: SORT_ORDER;
    propName: SortableProps;
}

export interface IFilterBy {
    propName: SortableProps;
    value: string;
}

export class UIStore implements IUIStore {
    @observable salesHeaderHeight: number;
    @observable openedModal: string;
    @observable modalPayload: any;
    @observable itemsPerPage: Readonly<number> = 50;
    @observable currentPage: number = 0;

    @observable LpuSortSettings: ISortBy = null;
    @observable LpuFilterSettings: IFilterBy = null;

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
    filterLpuBy(propName: SortableProps, value: string) {
        this.LpuFilterSettings = { propName, value };
    }

    @action.bound
    clearLpuFilters() {
        this.LpuFilterSettings = null;
    }
}
