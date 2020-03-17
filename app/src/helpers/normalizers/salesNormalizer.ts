import { ISalesStat, IPeriodSalesStat } from './../../interfaces/ISalesStat';

export const salesNormalizer = ({ data: { data }}: any): ISalesStat[] => {
    const res: ISalesStat[] = [];

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

            return {
                money: x.money,
                amount: x.amount,
                [period]: x[period]
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

    return res;
};
