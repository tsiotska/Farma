import { IMedsSalesStat, IPeriodSalesStat } from './../../interfaces/ISalesStat';

export const medsStatNormalizer = ({ data }: any): IMedsSalesStat[] => {
    const res: IMedsSalesStat[] = [];

    let period: string;
    for (const id in data) {
        const medId = +id;

        if (!Number.isInteger(medId)) continue;

        const {
            money,
            amount,
            kpd,
            periods
        } = data[medId];

        const normalizedPeriods: IPeriodSalesStat[] = periods.map((x: any) => {
            const { year, month, day } = x;

            if (!period) {
                if (day !== undefined) period = 'day';
                else if (month !== undefined) period = 'month';
                else if (year !== undefined) period = 'year';
                else return;
            }

            const periodValue = period === 'year'
            ? x[period]
            : x[period] - 1;

            return {
                money: x.money,
                amount: x.amount,
                [period]: periodValue
            };
        });

        res.push({
            medId,
            money,
            amount,
            kpd,
            periods: normalizedPeriods.filter(x => !!x)
        });
    }

    return res.sort((a, b) => a.medId - b.medId);
};
