import { IMedSalary, ISalaryInfo, IUserSales } from '../../interfaces/ISalaryInfo';

export interface INormalizerResult {
    sales: IUserSales;
    levels: Array<[number, ISalaryInfo]>;
}

export const salaryNormalizer = ({ data: { data: { levels, sales } }}: any): INormalizerResult => {
    const userLevels: any[] = [];

    if (!levels) return { sales: {}, levels: [] };

    const keyPattern = new RegExp(/^(МП|РМ)[1-5]$/);
    for (const key in levels) {
        if (keyPattern.test(key) === false) continue;

        const {
            plan_money,
            salary,
            add_costs,
            kpi,
            drugs
        } = levels[key];

        const meds: { [key: number]: IMedSalary } = drugs.reduce(
            (total: any, { drug, ...rest }: any) => ({ ...total, [drug]: rest }),
            {}
        );

        const newObject: ISalaryInfo = {
            extraCosts: add_costs || null,
            kpi: kpi || null,
            plannedCosts: plan_money || null,
            salary: salary || null,
            meds
        };

        const i = +key[2];
        if (Number.isNaN(i) === false) {
            userLevels.push([ i, newObject ]);
        }
    }

    const userSales: IUserSales = sales.reduce(
        (total: any, { drug, ...rest }: any) => ({ ...total, [drug]: rest }),
        {}
    );

    return { sales: userSales, levels: userLevels };
};