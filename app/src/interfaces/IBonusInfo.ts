export interface IDrugSale {
    id: number;
    amount: number;
    mark: number;
}

export interface IMark {
    drugId: number;
    // mark: number;
    payments: number;
    deposit: number;
}

export interface IAgentInfo {
    id: number;
    lastPayment: number;
    lastDeposit: number;
    marks: Map<number, IMark>;
}

export interface IBonusInfo {
    id: number;
    month: number;
    payments: number;
    deposit: number;
    status: boolean;
    sales: Map<number, IDrugSale>;
    agents: IAgentInfo[];
}
