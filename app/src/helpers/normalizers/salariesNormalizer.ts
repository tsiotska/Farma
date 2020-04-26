import { IValuesMap, objectArrayNormalizer } from './normalizer';
import { IUserSalary } from '../../interfaces/IUserSalary';

const defaultUserSalary: IUserSalary = {
    id: null,
    level: null,
    salary: null,
    extraCosts: null,
    bonus: null,
    kpi: null,
    money: null,
    total: null,
    position: null,
};

const namesMap: IValuesMap = {
    id: 'id',
    level: 'level',
    salary: 'salary',
    extraCosts: 'extraCosts',
    bonus: 'bonus',
    kpi: 'kpi',
    money: 'money',
    total: 'total',
    position: 'position',
};

// export const salariesNormalizer = ({ data: { data }}: any) => objectArrayNormalizer(
//     data,
//     defaultUserSalary,
//     namesMap,
//     {
//         valueNormalizers: {
//             level: (value: string) =>
//         }
//     }
// );
