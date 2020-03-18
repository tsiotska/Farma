import { objectArrayNormalizer, IValuesMap } from './normalizer';
import { ILocaleSalesStat, IMedSalesStat } from '../../interfaces/ILocaleSalesStat';

const defaultLocaleSalesStat: ILocaleSalesStat = {
    id: null, // regionId, LPUId, etc
    stat: []
};

const localesStatValuesMap: IValuesMap = {
    region: 'id',
    stat: 'stat'
};

const defaultMedSalesStat: IMedSalesStat = {
    medId: null,
    money: null,
    amount: null
};

const medsStatValuesMap: IValuesMap = {
    medId: 'medId',
    money: 'money',
    amount: 'amount'
};

export const localeSalesStatNormalizer = ({ data: { data }}: any): ILocaleSalesStat[] => objectArrayNormalizer(
    data,
    defaultLocaleSalesStat,
    localesStatValuesMap,
    {
        requiredProps: [ 'region', 'stat' ],
        valueNormalizers: {
            stat: (statArray: any[]): IMedSalesStat[] => objectArrayNormalizer(
                statArray,
                defaultMedSalesStat,
                medsStatValuesMap,
                { requiredProps: [ 'medId' ] }
            ).sort((a, b) => a.medId - b.medId)
        }
    }
);
