import { ISortBy, IFilterBy, ISalesPharmacyFilter } from '../stores/UIStore';

export interface IUIStore {
    salesHeaderHeight: number;
    itemsPerPage: Readonly<number>;
    currentPage: number;
    sortSettings: ISortBy;
    filterSettings: IFilterBy;
    modalPayload: any;
    salesPharmacyFilter: ISalesPharmacyFilter;
}
