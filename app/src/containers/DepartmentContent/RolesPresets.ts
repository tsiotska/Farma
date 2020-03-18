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
}

export const adminContent: IRoleContent[] = [
    { path: SALES_ROUTE, component: Sales },
    { path: MARKS_ROUTE, component: Marks },
    { path: SALARY_ROUTE, component: Salary },
    { path: WORKERS_ROUTE, component: Workers },
    { path: MEDICINES_ROUTE, component: Medicines },
    { path: PHARMACY_ROUTE, component: Pharmacy },
];

export const FFMContent: IRoleContent[] = [
    { path: SALES_ROUTE, component: Sales },
    { path: MARKS_ROUTE, component: Marks },
    { path: SALARY_ROUTE, component: Salary },
    { path: WORKERS_ROUTE, component: Workers },
    { path: MEDICINES_ROUTE, component: Medicines },
    { path: PHARMACY_ROUTE, component: Pharmacy },
];

export const RMContent: IRoleContent[] = [
    { path: SALES_ROUTE, component: Sales },
    { path: MARKS_ROUTE, component: Marks },
    { path: WORKERS_ROUTE, component: Workers },
];

export const MAContent: IRoleContent[] = [
    { path: SALES_ROUTE, component: Sales },
    { path: MARKS_ROUTE, component: Marks },
    { path: WORKERS_ROUTE, component: Workers },
    { path: PHARMACY_ROUTE, component: Pharmacy },
];
