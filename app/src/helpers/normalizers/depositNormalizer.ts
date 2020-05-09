import { IDeposit } from '../../interfaces/IDeposit';
import { IValuesMap, objectArrayNormalizer } from './normalizer';

export const defaultDeposit: IDeposit = {
    message: null,
    date: null,
    deposit: null
};

const valuesMap: IValuesMap = {
    message: 'message',
    datetime: 'date',
    deposit: 'deposit'
};

export const depositNormalizer = ({ data: { data } }: any) => objectArrayNormalizer(
    data,
    defaultDeposit,
    valuesMap,
    { requiredProps: ['message', 'date', 'deposit'] }
);
