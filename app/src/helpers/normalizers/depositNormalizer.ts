import { IDeposit } from '../../interfaces/IDeposit';
import { IValuesMap, objectArrayNormalizer } from './normalizer';

export const defaultDeposit: IDeposit = {
    deposit: null,
    message: null,
    date: null
};

const valuesMap: IValuesMap = {
    deposit: 'deposit',
    message: 'message',
    datetime: 'date'
};

export const depositNormalizer = ({ data: { data } }: any) => objectArrayNormalizer(
    data,
    defaultDeposit,
    valuesMap,
    { requiredProps: ['deposit', 'message', 'datetime'] }
);
