import { IValuesMap, objectArrayNormalizer } from './normalizer';
import { IPosition } from '../../interfaces/IPosition';

const defaultPosition: IPosition = {
    id: null,
    name: null,
    alias: null
};

const valuesMap: IValuesMap = {
    id: 'id',
    name: 'name',
    alias: 'alias',
};

export const positionsNormalizer = ({ data: { data }}: any) => objectArrayNormalizer(
    data,
    defaultPosition,
    valuesMap,
    {
        requiredProps: [ 'id', 'name' ]
    }
);
