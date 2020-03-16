import { IValuesMap, objectArrayNormalizer } from './normalizer';
import { ILPU } from './../../interfaces/ILPU';

const defaultLPU: ILPU = {
    id: null,
    name: null
};

const valuesMap: IValuesMap = {
    id: 'id',
    name: 'name'
};

export const lpuNormalizer = ({ data: { data }}: any) => objectArrayNormalizer(
    data,
    defaultLPU,
    valuesMap,
    { requiredProps: [ 'id', 'name' ]}
);
