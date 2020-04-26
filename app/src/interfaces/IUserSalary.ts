import { USER_ROLE } from './../constants/Roles';
export interface IUserSalary {
    id: number;
    level: number;
    salary: number;
    extraCosts: number;
    bonus: number;
    kpi: number;
    money: number;
    total: number;
    position: USER_ROLE;
    subSalaries: IUserSalary[];
}
