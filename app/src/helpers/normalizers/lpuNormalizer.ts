import { IValuesMap, objectArrayNormalizer } from './normalizer';
import { ILPU } from './../../interfaces/ILPU';

export const defaultLPU: ILPU = {
    id: null,
    name: null,
    type: null,
    region: null,
    oblast: null,
    city: null,
    address: null,
    phone1: null,
    phone2: null,
    ffmConfirm: null,
    rmConfirm: null,
};

export const lpuValuesMap: IValuesMap = {
    id: 'id',
    name: 'name',
    hcf_type: 'type',
    region: 'region',
    city: 'city',
    address: 'address',
    phone: 'phone',
    oblast: 'oblast',
    phone1: 'phone1',
    phone2: 'phone2',
    ffm_confirmed: 'ffmConfirm',
    rm_confirmed: 'rmConfirm',
};

export const lpuNormalizer = ({ data: { data }}: any) => objectArrayNormalizer(
    data,
    defaultLPU,
    lpuValuesMap,
    { requiredProps: [ 'id', 'name' ]}
);
