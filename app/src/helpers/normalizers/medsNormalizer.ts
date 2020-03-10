import { IValuesMap, objectArrayNormalizer } from './normalizer';
import { IMedicine } from './../../interfaces/IMedicine';

const defaultMedicine: IMedicine = {
    id: null,
    name: null,
    image: null,
    releaseForm: null,
    dosage: null,
    manufacturer: null,
    bonus: null,
    price: null,
};

const valuesMap: IValuesMap = {
    id: 'id',
    name: 'name',
    image: 'image',
    release_form: 'releaseForm',
    dosage: 'dosage',
    manufacturer: 'manufacturer',
    bonus: 'bonus',
    price: 'price',
};

export const medsNormalizer = ({ data: { data }}: any) => objectArrayNormalizer(
    data,
    defaultMedicine,
    valuesMap,
    {
        requiredProps: [ 'id', 'name' ]
    }
);
