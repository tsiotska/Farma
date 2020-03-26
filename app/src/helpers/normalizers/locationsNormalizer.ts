import { objectArrayNormalizer, IValuesMap } from './normalizer';
import { ILocation } from '../../interfaces/ILocation';

const defaultRegion: ILocation = {
    id: null,
    name: null
};

const valuesMap: IValuesMap = {
    id: 'id',
    name: 'name'
};

export const locationsNormalizer = ({ data: { data } }: any) => objectArrayNormalizer(
    data,
    defaultRegion,
    valuesMap,
    { requiredProps: ['id', 'name'] }
);
