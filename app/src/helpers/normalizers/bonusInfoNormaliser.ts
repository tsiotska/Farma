import { objectArrayNormalizer, IValuesMap, defaultObjectNormalizer } from './normalizer';
import { IBonusInfo, IDrugSale, IMark, IAgentInfo } from './../../interfaces/IBonusInfo';
import groupBy from 'lodash/groupBy';

const defaultDrugSale: IDrugSale = {
    id: null,
    amount: null,
    mark: null,
};

const defaultMark: IMark = {
    drugId: null,
    mark: null,
    payments: null,
    deposit: null,
};

const defaultAgentInfo: IAgentInfo = {
    id: null,
    lastPayment: null,
    lastDeposit: null,
    marks: new Map(),
};

const defaultBonusInfo: IBonusInfo = {
    id: null,
    month: null,
    payments: null,
    deposit: null,
    status: null,
    sales: new Map(),
    agents: [],
};

const bonusInfoValuesMap: IValuesMap = {
    id: 'id',
    month: 'month',
    payments: 'payments',
    deposit: 'deposit',
    status_ok: 'status'
};

const drugSaleValuesMap: IValuesMap = {
    drug: 'id',
    amount: 'amount',
    mark: 'mark',
};

const marksValuesMap: IValuesMap = {
    drug: 'drugId',
    drug_mark: 'mark',
    payments: 'payments',
    deposit: 'deposit',
};

const agentsValuesMap: IValuesMap = {
    id: 'id',
    last_payments: 'lastPayment',
    last_deposit: 'lastDeposit',
};

export const bonusInfoNormalizer = ({ data: { data }}: any): any => objectArrayNormalizer(
    data,
    defaultBonusInfo,
    bonusInfoValuesMap,
    {
        requiredProps: [ 'id', 'month', 'payments', 'deposit' ],
        valueNormalizers: { status: (value: number) => !!value }
    }
);

export const bonusesDataNormalizer = ({
    data: {
        data: {
            sales,
            agents,
            marks
        }
    }
}: any): {
    sales: Map<number, IDrugSale>,
    agents: IAgentInfo[]
} => {
    const normalizedSales: Array<[number, IDrugSale]> = objectArrayNormalizer(
        sales,
        defaultDrugSale,
        drugSaleValuesMap,
        { requiredProps: ['drug', 'amount', 'mark']}
    ).map(x => ([ x.id, x ]));

    const groupedMarks = groupBy(marks, 'agent');

    const normalizedAgents: IAgentInfo[] = objectArrayNormalizer(
        agents,
        defaultAgentInfo,
        agentsValuesMap,
        { requiredProps: [ 'id', 'last_payments', 'last_deposit' ] }
    ).map(agent => {
        const agentMarks = groupedMarks[agent.id];

        if (agentMarks) {
            const normalizedMarks: Array<[number, IMark]> = objectArrayNormalizer(
                agentMarks,
                defaultMark,
                marksValuesMap,
                {}
            ).map(x => ([x.drugId, x]));

            agent.marks = new Map(normalizedMarks);
        }

        return agent;
    });

    return {
        sales: new Map(normalizedSales),
        agents: normalizedAgents
    };
};
