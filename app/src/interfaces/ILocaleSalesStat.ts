import { ICommonStat } from './ISalesStat';

export interface IMedSalesStat extends ICommonStat {
    medId: number;
}

export interface ILocaleSalesStat {
    id: number;
    stat: IMedSalesStat[];
}
