import { IValuesMap, defaultObjectNormalizer, objectArrayNormalizer } from './normalizer';
import { IUser } from '../../interfaces';
import { USER_ROLE } from '../../constants/Roles';

export const defaultUser: IUser = {
    id: null,
    name: null,
    position: null,
    image: null,
    doctorsCount: null,
    pharmacyCount: null,
    lpuCount: null,
    region: null,
    level: null,
    city: null,
    department: null,
    depositMinus: null,
    depositPlus: null,
    bankCard: null,
    mobilePhone: null,
    email: null,
};

const valuesMap: IValuesMap = {
    id: 'id',
    full_name: 'name',
    position: 'position',
    image: 'image',
    count_doctor: 'doctorsCount',
    count_pharmacy: 'pharmacyCount',
    count_hcf: 'lpuCount',
    region: 'region',

    branch: 'department',
    level: 'level',
    city: 'city',

    count_deposit_plus: 'depositPlus',
    count_deposit_minus: 'depositMinus',

    bank_card: 'bankCard',
    mobile_phone: 'mobilePhone',
    email: 'email',
};

const requiredProps = ['id', 'full_name', 'position'];

export const positionNormalizer = (position: number) => {
    switch (position) {
        case USER_ROLE.ADMIN:
            return USER_ROLE.ADMIN;
        case USER_ROLE.FIELD_FORCE_MANAGER:
            return USER_ROLE.FIELD_FORCE_MANAGER;
        case USER_ROLE.REGIONAL_MANAGER:
            return USER_ROLE.REGIONAL_MANAGER;
        case USER_ROLE.MEDICAL_AGENT:
            return USER_ROLE.MEDICAL_AGENT;
        case USER_ROLE.SUPER_ADMIN:
            return USER_ROLE.SUPER_ADMIN;
        case USER_ROLE.PRODUCT_MANAGER:
            return USER_ROLE.PRODUCT_MANAGER;
        default:
            return USER_ROLE.UNKNOWN;
    }
};

const UserValueNormalizers = { position: positionNormalizer };

export const userNormalizer = ({ data: { data } }: any) => requiredProps.every(prop => prop in data)
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

export const multipleUserNormalizer = ({ data: { data } }: any) => objectArrayNormalizer(
    data,
    defaultUser,
    valuesMap,
    { objectNormalizer: defaultUserNormalizer }
);
