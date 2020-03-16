import { ISalesStat, IPeriodSalesStat } from './../../interfaces/ISalesStat';

const mockPeriods: IPeriodSalesStat[] = [
    {
        money: 1,
        amount: 2,
    },
    {
        money: 10,
        amount: 2,
    },
];

export const mockSales: ISalesStat[] = [
    {
        medId: 1,
        money: 12,
        amount: 32,
        kpd: 12,
        periods: mockPeriods,
    },
    {
        medId: 2,
        money: 123,
        amount: 322,
        kpd: 58,
        periods: mockPeriods,
    },
];
