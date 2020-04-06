import {
    SALES_ROUTE,
    MARKS_ROUTE,
    SALARY_ROUTE,
    WORKERS_ROUTE,
    MEDICINES_ROUTE,
    PHARMACY_ROUTE,
    LPU_ROUTE,
    ADMIN_ROUTE
} from './../../constants/Router';

import Sales from '../Sales';
import Marks from '../Marks';
import Salary from '../Salary';
import Workers from '../Workers';
import Pharmacy from '../Pharmacy';
import Medicines from '../Medicines';
import Lpu from '../Lpu';
import AdminPage from '../AdminPage';

export interface IRoleContent {
    path: string;
    component: any;
    title: string;
}

const adminPage = { title: 'qewr', path: ADMIN_ROUTE, component: AdminPage };
const sales = { title: 'Продажі', path: SALES_ROUTE, component: Sales };
const marks = { title: 'Бали', path: MARKS_ROUTE, component: Marks };
const salary = { title: 'Заробітня плата', path: SALARY_ROUTE, component: Salary };
const workers = { title: 'Працівники', path: WORKERS_ROUTE, component: Workers };
const meds = { title: 'Препарати', path: MEDICINES_ROUTE, component: Medicines };
const pharmacy = { title: 'Аптеки', path: PHARMACY_ROUTE, component: Pharmacy };
const lpu = { title: 'ЛПУ', path: LPU_ROUTE, component: Lpu };

export const adminContent: IRoleContent[] = [
    adminPage
];

export const FFMContent: IRoleContent[] = [
    sales,
    marks,
    salary,
    workers,
    meds,
    pharmacy,
    lpu
];

export const RMContent: IRoleContent[] = [
    sales,
    marks,
    workers,
    pharmacy,
    lpu
];

export const MAContent: IRoleContent[] = [
    sales,
    marks,
    pharmacy,
    lpu
];
