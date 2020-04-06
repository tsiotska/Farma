export const ROOT_ROUTE: string = `/`;

export const LOGIN_ROUTE: string = `/login`;

export const ADMIN_ROUTE: string = `/admin`;
export const DEPARTMENT_ROUTE: string = `/department/:departmentId`;
export const SALES_ROUTE: string = `${DEPARTMENT_ROUTE}/sales`;
export const MARKS_ROUTE: string = `${DEPARTMENT_ROUTE}/marks`;
export const SALARY_ROUTE: string = `${DEPARTMENT_ROUTE}/salary`;
export const WORKERS_ROUTE: string = `${DEPARTMENT_ROUTE}/workers`;
export const MEDICINES_ROUTE: string = `${DEPARTMENT_ROUTE}/medicines`;
export const PHARMACY_ROUTE: string = `${DEPARTMENT_ROUTE}/pharmacy`;
export const LPU_ROUTE: string = `${DEPARTMENT_ROUTE}/lpu`;

// routes, where navigation is resolved
export const NAVIGATION_ROUTES: string[] = [
    SALES_ROUTE,
    MARKS_ROUTE,
    SALARY_ROUTE,
    WORKERS_ROUTE,
    MEDICINES_ROUTE,
    PHARMACY_ROUTE,
    LPU_ROUTE
];

export const ADMIN_ROUTES: string[] = [
    ...NAVIGATION_ROUTES,
    ADMIN_ROUTE
];

export const AUTH_ROUTES: string[] = [
];
