import { IValuesMap, defaultObjectNormalizer } from './normalizer';
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

export const userNormalizer = ({ data: { data }}: any) => {
    const requiredProps = [ 'id', 'full_name',  'position' ];
    const hasRequiredProps = requiredProps.every(prop => prop in data);

    return hasRequiredProps
    ? defaultObjectNormalizer(data, defaultUser, valuesMap)
    : null;
};
