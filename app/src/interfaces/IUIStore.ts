import { ISortBy, IFilterBy } from '../stores/UIStore';

export interface IUIStore {
    salesHeaderHeight: number;
    itemsPerPage: Readonly<number>;
    currentPage: number;
    LpuSortSettings: ISortBy;
    LpuFilterSettings: IFilterBy;
}
