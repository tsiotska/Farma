import { IValuesMap, objectArrayNormalizer } from './normalizers/normalizer';
import { IWorker } from '../interfaces/IWorker';

const defaultWorker: IWorker = {
    id: null,
    name: null,
    avatar: null,
    position: null,
    fired: null,
    hired: null,
    created: null,
    email: null,
    phone: null,
    card: null,
    isVacancy: false
};

const valuesMap: IValuesMap = {
    id: 'id',
    full_name: 'name',
    avatar: 'avatar',
    position: 'position',
    fired: 'fired',
    hired: 'hired',
    created: 'created',
    email: 'email',
    phone: 'phone',
    bank_card: 'card',
    vacancy: 'isVacancy'
};

export const workersNormalizer = ({ data: { data }}: any): IWorker[] => objectArrayNormalizer(
    data,
    defaultWorker,
    valuesMap,
    {
        requiredProps: [ 'id' ],
        valueNormalizers: {
            fired: (value: string) => new Date(value),
            hired: (value: string) =>  new Date(value),
            created: (value: string) =>  new Date(value),
            isVacancy: (value: any) => !!value
        }
    }
);
