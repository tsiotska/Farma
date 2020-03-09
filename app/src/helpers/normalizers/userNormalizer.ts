import { ADMIN, FIELD_FORCE_MANAGER, REGIONAL_MANAGER, MEDICAL_AGENT } from './../../constants/Roles';
import { IValuesMap, objectArrayNormalizer } from './normalizer';
import { IUser } from '../../interfaces';

const defaultUser: IUser = {
    id: null,
    name: null,
    position: null,
    avatar: null,
    doctorsCount: null,
    pharmacyCount: null,
    region: null,
    level: null,
    city: null,
};

const valuesMap: IValuesMap = {
    id: 'id',
    full_name: 'name',
    position: 'position',
    avatar: 'avatar',
    count_doctor: 'doctorsCount',
    count_pharmacy: 'pharmacyCount',
    region: 'region',
    level: 'level',
    city: 'city',
};

export const userNormalizer = ({ data: { data }}: any) => objectArrayNormalizer(
    data,
    defaultUser,
    valuesMap,
    {
        requiredProps: [ 'id', 'full_name',  'position', 'avatar' ],
        valueNormalizers: {
            position: (value: number) => {
                switch (value) {
                    case 1: return ADMIN;
                    case 2: return FIELD_FORCE_MANAGER;
                    case 3: return REGIONAL_MANAGER;
                    case 4: return MEDICAL_AGENT;
                    default: return null;
                }
            }
        }
    }
);
