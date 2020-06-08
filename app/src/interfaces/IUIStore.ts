import { ISortBy, IFilterBy, ISalesPharmacyFilter, ISnackbar } from '../stores/UIStore';
import { observable } from 'mobx';

export interface IUIStore {
    salesHeaderHeight: number;
    itemsPerPage: Readonly<number>;
    currentPage: number;
    sortSettings: ISortBy;
    filterSettings: IFilterBy;
    modalPayload: any;
    salesPharmacyFilter: ISalesPharmacyFilter;
    isSynchronizing: boolean;
    synchronizingSnackbar: ISnackbar;
}
