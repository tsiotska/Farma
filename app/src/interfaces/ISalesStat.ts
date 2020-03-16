export interface ISalesStat {
    medId: number;
    money: number;
    amount: number;
    kpd: number;
    periods: IPeriodSalesStat[];
}

export interface IPeriodSalesStat {
    money: number;
    amount: number;
}
