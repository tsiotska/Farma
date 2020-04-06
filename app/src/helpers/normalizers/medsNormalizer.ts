import { IValuesMap, objectArrayNormalizer } from './normalizer';
import { IMedicine } from './../../interfaces/IMedicine';
import { getRandomColor } from '../getRandomColor';

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

export const medsNormalizer = ({ data }: any) => objectArrayNormalizer(
    data,
    defaultMedicine,
    valuesMap,
    {
        requiredProps: [ 'id', 'name' ],
        objectNormalizer: (dataObject: any, defaultValue: IMedicine, namesMap: IValuesMap) => {
            const normalizedObject: IMedicine = { ...defaultValue, color: getRandomColor() };

            for (const prop in dataObject) {
                const propName = namesMap[prop];

                if (!propName) continue;

                normalizedObject[propName] = dataObject[prop];
            }

            return normalizedObject;
        }
    }
).sort((a, b) => a.id - b.id);
