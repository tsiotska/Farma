import AsyncStore from './AsyncStore';
import { IUIStore } from '../interfaces/IUIStore';
import { observable, action } from 'mobx';

export class UIStore extends AsyncStore implements IUIStore {
    @observable salesHeaderHeight: number;

    @action.bound
    setSalesHeaderHeight(value: number) {
        this.salesHeaderHeight = value > 0
        ? value
        : 0;
    }
}
