import AsyncStore from './AsyncStore';
import { IUIStore } from '../interfaces/IUIStore';
import { observable, action } from 'mobx';

export class UIStore extends AsyncStore implements IUIStore {
    @observable salesHeaderHeight: number;
    @observable openedModal: string;
    @observable itemsPerPage: Readonly<number> = 50;
    @observable currentPage: number = 0;

    @action.bound
    setSalesHeaderHeight(value: number) {
        this.salesHeaderHeight = value > 0
        ? value
        : 0;
    }

    @action.bound
    openModal(modalName: string) {
        this.openedModal = modalName;
    }

    @action.bound
    setCurrentPage(value: number) {
        this.currentPage = value;
    }
}
