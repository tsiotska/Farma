export interface ITablePreset {
    rowPrepend: any;
    headerPrepend: any;
    propName: 'locationSalesStat' | 'agentSalesStat';
}

export const FFM_PRESET: ITablePreset[] = [
    { rowPrepend: null, headerPrepend: null, propName: 'agentSalesStat' },
    { rowPrepend: null, headerPrepend: null, propName: 'locationSalesStat' },
];

export const MR_PRESET: ITablePreset[] = [
    { rowPrepend: null, headerPrepend: null, propName: 'agentSalesStat' },
    { rowPrepend: null, headerPrepend: null, propName: 'locationSalesStat' },
];

export const MA_PRESET: ITablePreset[] = [
    { rowPrepend: null, headerPrepend: null, propName: 'locationSalesStat' },
];
