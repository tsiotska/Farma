import { IValuesMap, objectArrayNormalizer, defaultObjectNormalizer } from './normalizer';
import { IDoctor } from './../../interfaces/IDoctor';

export const defaultDoctor: IDoctor = {
    id: null,
    name: null,
    LPUId: null,
    LPUName: null,
    FFMCommit: null,
    RMCommit: null,
    specialty: null,
    workPhone: null,
    mobilePhone: null,
    card: null,
    created: null,
    confirmed: null,
    position: null,
    deposit: null,
    address: null,
    city: null
};

export const doctorValuesMap: IValuesMap = {
    id: 'id',
    full_name: 'name',
    hcf: 'LPUId',
    hcf_name: 'LPUName',
    ffm_confirmed: 'FFMCommit',
    rm_confirmed: 'RMCommit',
    speciality: 'specialty',
    work_phone: 'workPhone',
    mobile_phone: 'mobilePhone',
    bank_card: 'card',
    created: 'created',
    confirmed: 'confirmed',
    position: 'position',
    deposit: 'deposit',
    hcf_address: 'address',
    city: 'city'
};

const valueNormalizers = {
    name: (value: string) => value ? value.toLowerCase() : null,
    card: (value: string) => value ? value.replace(/ /g, '') : null
};

export const doctorsNormalizer = ({ data: { data }}: any): IDoctor[] => objectArrayNormalizer(
    data,
    defaultDoctor,
    doctorValuesMap,
    {
        requiredProps: [ 'id' ],
        valueNormalizers
    }
);

export const doctorNormalizer = ({ data: { data }}: any): IDoctor => defaultObjectNormalizer(
    data,
    defaultDoctor,
    doctorValuesMap,
    valueNormalizers
);
