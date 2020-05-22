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
    FFMCommit: null,
    RMCommit: null,
    confirmed: true,
    lpuName: null,
    lpu: null,
    regionName: null
};

export const lpuValuesMap: IValuesMap = {
    id: 'id',
    name: 'name',
    org_type: 'type',
    region: 'region',
    city: 'city',
    address: 'address',
    phone: 'phone',
    oblast: 'oblast',
    phone1: 'phone1',
    phone2: 'phone2',
    ffm_confirmed: 'FFMCommit',
    rm_confirmed: 'RMCommit',
    confirmed: 'confirmed',
    hcf: 'lpu',
    hcf_name: 'lpuName',
    region_name: 'regionName'
};

export const lpuNormalizer = ({ data: { data }}: any) => objectArrayNormalizer(
    data,
    defaultLPU,
    lpuValuesMap,
    {
        requiredProps: [ 'id', 'name' ],
        valueNormalizers: {
            name: (value: string) => value ? value.toLowerCase() : null,
            city: (value: string) => value ? value.toLowerCase() : null,
            address: (value: string) => value ? value.toLowerCase() : null,
            oblast: (value: string) => value ? value.toLowerCase() : null,
        }
    }
);
