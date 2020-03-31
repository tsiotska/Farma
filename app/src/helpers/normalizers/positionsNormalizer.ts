import { IValuesMap, objectArrayNormalizer } from './normalizer';
import { IPosition } from '../../interfaces/IPosition';
import { PERMISSIONS } from '../../constants/Permissions';

const defaultPosition: IPosition = {
    id: null,
    name: null,
    alias: null,
    permissions: []
};

const valuesMap: IValuesMap = {
    id: 'id',
    name: 'name',
    alias: 'alias',
    permissions: 'permissions'
};

export const positionsNormalizer = ({ data: { data }}: any) => objectArrayNormalizer(
    data,
    defaultPosition,
    valuesMap,
    {
        requiredProps: [ 'id', 'name' ],
        valueNormalizers: {
            permissions: (value: string[]) =>
                value.map(x => (
                    !!PERMISSIONS[x]
                    ? x
                    : undefined
                )).filter(x => !!x)
        }
    }
);
