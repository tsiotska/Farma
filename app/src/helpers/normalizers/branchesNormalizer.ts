import { IValuesMap, objectArrayNormalizer, defaultObjectNormalizer } from './normalizer';
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

const requiredProps = ['id', 'name', 'image'];
const valueNormalizers = {
    name:  (value: string) => value.toLowerCase()
};

export const branchesNormalizer = ({ data: { data }}: any) => objectArrayNormalizer(
    data,
    defaultBranch,
    valuesMap,
    { requiredProps, valueNormalizers }
);

export const branchNormalizer = ({ data: { data }}: any) => requiredProps.every(x => x in data)
    ?  defaultObjectNormalizer(
        data,
        defaultBranch,
        valuesMap,
        valueNormalizers
    )
    : null;
