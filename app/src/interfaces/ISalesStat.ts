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

export interface ISalesStat extends ICommonStat {
    medId: number;
    kpd: number;
    periods: IPeriodSalesStat[];
}
