import AsyncStore from './AsyncStore';
import { IUIStore } from '../interfaces/IUIStore';
import { observable, action } from 'mobx';
import { SALARY_PREVIEW_MODAL, ADD_DEPARTMENT_MODAL } from '../constants/Modals';

export class UIStore implements IUIStore {
    @observable salesHeaderHeight: number;
    @observable openedModal: string = ADD_DEPARTMENT_MODAL;
    @observable modalPayload: any;
    @observable itemsPerPage: Readonly<number> = 50;
    @observable currentPage: number = 0;

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
}
