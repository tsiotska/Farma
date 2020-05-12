import { IValuesMap, objectArrayNormalizer } from './normalizer';
import { IUserSalary } from '../../interfaces/IUserSalary';
import { positionNormalizer } from './userNormalizer';

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
    subSalaries: null,
    date: null
};

const namesMap: IValuesMap = {
    user: 'id',
    level: 'level',
    salary: 'salary',
    add_costs: 'extraCosts',
    bonus: 'bonus',
    kpi: 'kpi',
    fact_money: 'money',
    total: 'total',
    position: 'position',
    date: 'datetime'
};

export const salariesNormalizer = ({ data: { data }}: any) => objectArrayNormalizer(
    data,
    defaultUserSalary,
    namesMap,
    {
        valueNormalizers: {
            level: (str: string) => {
                const numValue = +str.slice(-1);
                return (Number.isNaN(numValue) === false && numValue >= 0 && numValue <= 5)
                    ? numValue
                    : 0;
            },
            position: positionNormalizer
        }
    }
);

// {
//     "status": "OK",
//     "data": [
//         {
//             "user": 3,
//             "level": "РМ1",
//             "salary": 0.0,
//             "add_costs": 0.0,
//             "bonus": 0.0,
//             "kpi": 0.0,
//             "fact_money": 0.0,
//             "total": 0.0,
//             "position": 3
//         },
//         {
//             "user": 8,
//             "level": "РМ1",
//             "salary": 0.0,
//             "add_costs": 0.0,
//             "bonus": 0.0,
//             "kpi": 0.0,
//             "fact_money": 0.0,
//             "total": 0.0,
//             "position": 3
//         }
//     ]
// }
