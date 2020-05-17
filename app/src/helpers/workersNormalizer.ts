import { IValuesMap, objectArrayNormalizer, defaultObjectNormalizer } from './normalizers/normalizer';
import { IWorker } from '../interfaces/IWorker';

export const defaultWorker: IWorker = {
    id: null,
    name: null,
    image: null,
    position: null,
    fired: null,
    hired: null,
    created: null,
    email: null,
    workPhone: null,
    mobilePhone: null,
    card: null,
    isVacancy: false,
    region: null,
    city: null
};

export const workerValuesMap: IValuesMap = {
    id: 'id',
    full_name: 'name',
    image: 'image',
    position: 'position',
    fired: 'fired',
    hired: 'hired',
    created: 'created',
    email: 'email',
    mobile_phone: 'mobilePhone',
    work_phone: 'workPhone',
    bank_card: 'card',
    vacancy: 'isVacancy',
    region: 'region',
    city: 'city'
};

const valueNormalizers: any = {
    fired: (value: string) => new Date(value),
    hired: (value: string) =>  new Date(value),
    created: (value: string) =>  new Date(value),
    isVacancy: (value: any) => !!value,
    card: (value: any) => (
        value
        ? value.replace(/ /g, '')
        : null
    ),
};

const requiredProps = ['id'];

export const workersNormalizer = ({ data: { data }}: any): IWorker[] => objectArrayNormalizer(
    data,
    defaultWorker,
    workerValuesMap,
    {
        requiredProps,
        valueNormalizers
    }
);

export const workerNormalizer = ({ data: { data }}: any): IWorker =>
    requiredProps.every(x => x in data)
    ? defaultObjectNormalizer(
        data,
        defaultWorker,
        workerValuesMap,
        valueNormalizers
    ) : null;
