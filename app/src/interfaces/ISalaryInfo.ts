export interface IMedSalary {
    amount: number;
    bonus: number;
    price: number;
}

export interface ISalaryInfo {
    // plannedCosts: number;
    salary: number;
    extraCosts: number;
    kpi: number; // Key Performance Indicators, KPI
    meds: { [key: number]: IMedSalary };
}

export interface IUserSales {
    [key: number]: { amount: number, money: number };
}
