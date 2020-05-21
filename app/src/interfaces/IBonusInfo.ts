export interface IDrugSale {
    id: number;
    amount: number;
    mark: number;
}

export interface IMark {
    drugId: number;
    mark: number;
    payments: number;
    deposit: number;
}

export interface IAgentInfo {
    id: number;
    lastPayment: number;
    lastDeposit: number;
    deposit: number;
    isDone?: boolean;
    marks: Map<number, IMark>;
}

export interface IBonusInfo {
    month: number;
    payments: number;
    deposit: number;
    status: boolean;
    sales: Map<number, IDrugSale>;
    agents: IAgentInfo[];
}
