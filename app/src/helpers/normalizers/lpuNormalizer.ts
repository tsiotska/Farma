import { IValuesMap, objectArrayNormalizer } from './normalizer';
import { ILPU } from './../../interfaces/ILPU';

const defaultLPU: ILPU = {
    id: null,
    name: null,
    type: null,
    region: null,
    city: null,
    address: null,
    phone: null
};

const valuesMap: IValuesMap = {
    id: 'id',
    name: 'name',
    hcf_type: 'type',
    oblast: 'region',
    city: 'city',
    address: 'address',
    phone: 'phone',
};

export const lpuNormalizer = ({ data: { data }}: any) => objectArrayNormalizer(
    data,
    defaultLPU,
    valuesMap,
    { requiredProps: [ 'id', 'name' ]}
);
