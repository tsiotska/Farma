import {
    SALES_ROUTE,
    MARKS_ROUTE,
    SALARY_ROUTE,
    WORKERS_ROUTE,
    MEDICINES_ROUTE,
    PHARMACY_ROUTE
} from './../../constants/Router';

import Sales from '../Sales';
import Marks from '../Marks';
import Salary from '../Salary';
import Workers from '../Workers';
import Pharmacy from '../Pharmacy';
import Medicines from '../Medicines';

export interface IRoleContent {
    path: string;
    component: any;
    title: string;
}

const sales = { title: 'Продажи', path: SALES_ROUTE, component: Sales };
const marks = { title: 'Баллы', path: MARKS_ROUTE, component: Marks };
const salary = { title: 'Заработная  плата', path: SALARY_ROUTE, component: Salary };
const workers = { title: 'Сотрудники', path: WORKERS_ROUTE, component: Workers };
const meds = { title: 'Препараты', path: MEDICINES_ROUTE, component: Medicines };
const pharmacy = { title: 'ЛПУ/Аптеки', path: PHARMACY_ROUTE, component: Pharmacy };

export const adminContent: IRoleContent[] = [
    sales,
    marks,
    salary,
    workers,
    meds,
    pharmacy,
];

export const FFMContent: IRoleContent[] = [
    sales,
    marks,
    salary,
    workers,
    meds,
    pharmacy,
];

export const RMContent: IRoleContent[] = [
    sales,
    marks,
    workers
];

export const MAContent: IRoleContent[] = [
    sales,
    marks,
    workers,
    pharmacy
];
