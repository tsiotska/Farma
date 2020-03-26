export interface ITablePreset {
    groupBy: GROUP_BY;
}

export enum GROUP_BY {
    LOCATION,
    AGENT
}

export const FFM_PRESET: ITablePreset[] = [
    { groupBy: GROUP_BY.AGENT },
    { groupBy: GROUP_BY.LOCATION },
];

export const MR_PRESET: ITablePreset[] = [
    { groupBy: GROUP_BY.AGENT },
    { groupBy: GROUP_BY.LOCATION },
];

export const MA_PRESET: ITablePreset[] = [
    { groupBy: GROUP_BY.LOCATION }
];
