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
    deposit: null,
    lastPayment: null,
    lastDeposit: null,
    marks: new Map(),
};

const defaultBonusInfo: IBonusInfo = {
    month: null,
    payments: null,
    deposit: null,
    status: null,
    sales: new Map(),
    agents: [],
};

const bonusInfoValuesMap: IValuesMap = {
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
    deposit: 'deposit',
    last_payments: 'lastPayment',
    last_deposit: 'lastDeposit',
};

export const bonusInfoNormalizer = ({ data: { data }}: any): any => objectArrayNormalizer(
    data,
    defaultBonusInfo,
    bonusInfoValuesMap,
    {
        requiredProps: ['month', 'payments', 'deposit' ],
        valueNormalizers: {
            // status: (value: number) => !!value,
            status: () => false,
            month: (value: number) => value - 1 >= 0 ? value - 1 : 0
        }
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
    let groupedMarks = groupBy(marks, 'agent');

    const normalizedAgents: IAgentInfo[] = objectArrayNormalizer(
        agents,
        defaultAgentInfo,
        agentsValuesMap,
        { requiredProps: [ 'id', 'last_payments', 'last_deposit' ] }
    ).map(agent => {
        const { [agent.id]: agentMarks, ...rest } = groupedMarks;

        groupedMarks = rest;

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

    if (groupedMarks !== {}) {
        Object.entries(groupedMarks).forEach(([ stringUserId, userMarks ]) => {
            if (Array.isArray(userMarks) && userMarks.length) {
                const userId = +stringUserId;
                if (!userId) return;
                const normalizedMarks: Array<[number, IMark]> = objectArrayNormalizer(
                    userMarks,
                    defaultMark,
                    marksValuesMap,
                    {}
                ).map(x => ([ x.drugId, x ]));
                normalizedAgents.push({
                    ...defaultAgentInfo,
                    id: userId,
                    marks: new Map(normalizedMarks)
                });
            }
        });
    }

    const normalizedSales: Array<[number, IDrugSale]> = objectArrayNormalizer(
        sales,
        defaultDrugSale,
        drugSaleValuesMap,
        { requiredProps: ['drug', 'amount', 'mark']}
    ).map(x => ([ x.id, x ]));

    return {
        sales: new Map(normalizedSales),
        agents: normalizedAgents
    };
};
