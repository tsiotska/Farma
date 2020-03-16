import { IValuesMap, objectArrayNormalizer } from './normalizer';
import { IDoctor } from './../../interfaces/IDoctor';

const defaultDoctor: IDoctor = {
    id: null,
    name: null,
    LPUId: null,
    FFMCommit: null,
    RMCommit: null,
    specialty: null,
    phone: null,
    card: null,
};

const valuesMap: IValuesMap = {
    id: 'id',
    name: 'name',
    LPUId: 'LPUId',
    FFMCommit: 'FFMCommit',
    RMCommit: 'RMCommit',
    specialty: 'specialty',
    phone: 'phone',
    card: 'card',
};

export const docktorsNormalizer = ({ data: { data }}: any): IDoctor[] => objectArrayNormalizer(
    data,
    defaultDoctor,
    valuesMap,
    { requiredProps: [ 'id' ] }
);
