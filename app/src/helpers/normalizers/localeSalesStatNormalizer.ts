import { objectArrayNormalizer, IValuesMap, IOptions } from './normalizer';
import { ISalesStat, IMedSalesInfo } from '../../interfaces/ISalesStat';
// import { ILocaleSalesStat, IMedSalesStat } from '../../interfaces/ILocaleSalesStat';

export const localeSalesStatNormalizer = ({ data: { data }}: any) => {
    const normalizerOptions: IOptions<IMedSalesInfo> = { requiredProps: [ 'drug' ] };
    const defaultMedSalesStat: IMedSalesInfo = {
        medId: null,
        money: null,
        amount: null
    };
    const medsStatValuesMap: IValuesMap = {
        drug: 'medId',
        money: 'money',
        amount: 'amount'
    };

    const res: ISalesStat[] = [];

    for (const regionId in data) {
        const id = +regionId;

        if (!Number.isInteger(id)) continue;

        const periodsStat = data[id];
        const stat = objectArrayNormalizer(
            periodsStat,
            defaultMedSalesStat,
            medsStatValuesMap,
            normalizerOptions
        );

        res.push({
            id,
            stat
        });
    }

    return res;
};
