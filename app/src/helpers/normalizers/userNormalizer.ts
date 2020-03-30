import { IValuesMap, defaultObjectNormalizer, objectArrayNormalizer } from './normalizer';
import { IUser } from '../../interfaces';
import { USER_ROLE } from '../../constants/Roles';

export const defaultUser: IUser = {
    id: null,
    name: null,
    position: null,
    avatar: null,
    doctorsCount: null,
    pharmacyCount: null,
    region: null,
    level: null,
    city: null,
    department: null
};

const valuesMap: IValuesMap = {
    id: 'id',
    full_name: 'name',
    position: 'position',
    avatar: 'avatar',
    count_doctor: 'doctorsCount',
    count_pharmacy: 'pharmacyCount',
    region: 'region',

    branch: 'department',
    level: 'level',
    city: 'city',
};

const requiredProps = [ 'id', 'full_name',  'position' ];

const UserValueNormalizers = {
    position: (position: number) => {
        switch (position) {
            case USER_ROLE.ADMIN: return USER_ROLE.ADMIN;
            case USER_ROLE.FIELD_FORCE_MANAGER: return USER_ROLE.FIELD_FORCE_MANAGER;
            case USER_ROLE.REGIONAL_MANAGER: return USER_ROLE.REGIONAL_MANAGER;
            case USER_ROLE.MEDICAL_AGENT: return USER_ROLE.MEDICAL_AGENT;
            case USER_ROLE.SUPER_ADMIN: return USER_ROLE.SUPER_ADMIN;
            case USER_ROLE.PRODUCT_MANAGER: return USER_ROLE.PRODUCT_MANAGER;
            default: return USER_ROLE.UNKNOWN;
        }
    }
};

export const userNormalizer = ({ data: { data }}: any) => requiredProps.every(prop => prop in data)
? defaultUserNormalizer(data, defaultUser, valuesMap, UserValueNormalizers)
: null;

export const defaultUserNormalizer = (
    data: any,
    defaultValue: IUser,
    namesMap: IValuesMap,
    valueNormalizers = {}
    ) => defaultObjectNormalizer(
        data,
        defaultValue,
        namesMap,
        { valueNormalizers }
    );

export const multipleUserNormalizer = ({ data: { data }}: any) => objectArrayNormalizer(
    data,
    defaultUser,
    valuesMap,
    { objectNormalizer: defaultUserNormalizer }
);
