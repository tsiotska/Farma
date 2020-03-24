export interface ICommonStat {
    money: number;
    amount: number;
}

export interface IDaySalesStat extends ICommonStat {
    day: number;
}

export interface IMonthSalesStat extends ICommonStat {
    month: number;
}

export interface IYearSalesStat extends ICommonStat {
    year: number;
}

export type IPeriodSalesStat = IDaySalesStat | IMonthSalesStat | IYearSalesStat;

export interface IMedSalesInfo extends ICommonStat {
    medId: number;
}

export interface ISalesStat {
    id: number;
    stat: IMedSalesInfo[];
}

export interface IMedsSalesStat extends IMedSalesInfo {
    kpd: number;
    periods: IPeriodSalesStat[];
}
