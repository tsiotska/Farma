import { IValuesMap, objectArrayNormalizer } from './normalizer';
import { IBranch } from '../../interfaces/IBranch';

const defaultBranch: IBranch = {
    id: null,
    name: null,
    image: null
};

const valuesMap: IValuesMap = {
    id: 'id',
    name: 'name',
    image: 'image'
};

export const branchesNormalizer = ({ data: { data }}: any) => objectArrayNormalizer(
    data,
    defaultBranch,
    valuesMap,
    { requiredProps: ['id', 'name', 'image'] }
);
