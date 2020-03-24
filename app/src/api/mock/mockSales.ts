import { IMedsSalesStat } from '../../interfaces/ISalesStat';

export const mockSales: IMedsSalesStat[] = [
    {
        medId: 1,
        money: 12,
        amount: 32,
        kpd: 12,
        periods: [
            {
                money: 123,
                amount: 5234,
                month: 1
            },
            {
                money: 1034,
                amount: 2122,
                month: 2
            },
        ]
    },
    {
        medId: 2,
        money: 123,
        amount: 322,
        kpd: 58,
        periods: [
            {
                money: 1122,
                amount: 22195,
                month: 1
            },
            {
                money: 1065,
                amount: 24375,
                month: 2
            },
        ],
    },
];
