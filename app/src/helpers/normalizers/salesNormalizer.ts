import { ISalesStat, IPeriodSalesStat } from './../../interfaces/ISalesStat';

export const salesNormalizer = ({ data: { data }}: any): ISalesStat[] => {
    const res: ISalesStat[] = [];

    for (const id in data) {
        const medId = +id;

        if (!Number.isInteger(medId)) continue;

        const {
            money,
            amount,
            kpd,
            periods
        } = data[medId];

        const normalizedPeriods: IPeriodSalesStat[] = periods.map((x: any) => ({
            money: x.money,
            amount: x.amount
        }));

        res.push({
            medId,
            money,
            amount,
            kpd,
            periods: normalizedPeriods
        });
    }

    return res;
};
