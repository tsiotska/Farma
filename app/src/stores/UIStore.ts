import AsyncStore from './AsyncStore';
import { IUIStore } from '../interfaces/IUIStore';
import { observable, action } from 'mobx';
import { IUser } from '../interfaces';

export class UIStore extends AsyncStore implements IUIStore {
    @observable salesHeaderHeight: number;
    @observable openedModal: string;

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
}
