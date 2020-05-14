import { IValuesMap, defaultObjectNormalizer, objectArrayNormalizer } from './normalizer';
export interface IMedSales {
    medId: number;
    amount: number;
    money: number;
}

export interface IPeriodSalesStat {
    id: number; // location or agent id
    sales: Record<string, IMedSales[]>;
}

export const defaultSalesItem: IMedSales = {
    medId: null,
    amount: null,
    money: null
};

const defaultPeriodSalesStat: IPeriodSalesStat = {
    id: null,
    sales: null
};

const salesItemValuesMap: IValuesMap = {
    id: 'medId',
    amount: 'amount',
    money: 'money',
};

const medsStatNormalizer = (data: any[]) => objectArrayNormalizer(
    data,
    defaultSalesItem,
    salesItemValuesMap,
    { requiredProps: ['id', 'amount', 'money'] }
);

export const periodSalesNormalizer = ({ data: { data }}: any): IPeriodSalesStat[] => {
    return Object.entries(data).map(([ id, periods ]) => {
        const sales = Object.entries(periods).reduce((total, [month, medsStat]) => ({
            ...total,
            [month]: medsStatNormalizer(medsStat)
        }), {});
        return { id: +id, sales };
    });
};
