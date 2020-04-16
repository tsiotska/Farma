import { IValuesMap, objectArrayNormalizer } from './normalizer';
import { IDoctor } from './../../interfaces/IDoctor';

export const defaultDoctor: IDoctor = {
    id: null,
    name: null,
    LPUId: null,
    FFMCommit: null,
    RMCommit: null,
    specialty: null,
    workPhone: null,
    mobilePhone: null,
    card: null,
    created: null,
    confirmed: null,
};

export const doctorValuesMap: IValuesMap = {
    id: 'id',
    name: 'name',
    hcf: 'LPUId',
    ffm_confirmed: 'FFMCommit',
    rm_confirmed: 'RMCommit',
    speciality: 'specialty',
    work_phone: 'workPhone',
    mobile_phone: 'mobilePhone',
    bank_card: 'card',
    created: 'created',
    confirmed: 'confirmed',
};

export const docktorsNormalizer = ({ data: { data }}: any): IDoctor[] => objectArrayNormalizer(
    data,
    defaultDoctor,
    doctorValuesMap,
    { requiredProps: [ 'id' ] }
);
