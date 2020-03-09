import { IValuesMap, objectArrayNormalizer } from './normalizer';
import { IDepartment } from '../../interfaces/IDepartment';

const defaultBranch: IDepartment = {
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
    {
        requiredProps: ['id', 'name', 'image'],
        valueNormalizers: {
            name:  (value: string) => value.toLowerCase()
        }
    }
);
