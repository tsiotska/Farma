import { IUserCommonInfo } from '../../interfaces/IUser';
import { IValuesMap, objectArrayNormalizer } from './normalizer';

const defaultAgentInfo: IUserCommonInfo = {
    id: null,
    name: null,
    avatar: null,
    region: null,
    city: null,
};

const namesMap: IValuesMap = {
    id: 'id',
    full_name: 'name',
    avatar: 'avatar',
    region: 'region',
    city: 'city'
};

export const agentNormalizer = ({ data: { data }}: any) => objectArrayNormalizer(
    data,
    defaultAgentInfo,
    namesMap,
    { requiredProps: [ 'id', 'full_name', 'avatar' ] }
);
