import { objectArrayNormalizer, IValuesMap } from './normalizer';
import { IRegion } from '../../interfaces/IRegion';

const defaultRegion: IRegion = {
    id: null,
    name: null
};

const valuesMap: IValuesMap = {
    id: 'id',
    name: 'name'
};

export const regionNormalizer = ({ data: { data } }: any) => objectArrayNormalizer(
    data,
    defaultRegion,
    valuesMap,
    { requiredProps: ['id', 'name'] }
);
