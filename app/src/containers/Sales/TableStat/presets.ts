import TextCell from '../../../components/DrugsTable/TextCell';

export interface ITablePreset {
    rowPrepend: any;
    headerPrepend: any;
    propName: 'locationSalesStat' | 'agentSalesStat';
    title: string;
}

export const FFM_PRESET: ITablePreset[] = [
    { rowPrepend: TextCell, headerPrepend: TextCell, propName: 'agentSalesStat', title: 'agentSalesStat' },
    { rowPrepend: TextCell, headerPrepend: TextCell, propName: 'locationSalesStat', title: 'locationSalesStat' },
];

export const MR_PRESET: ITablePreset[] = [
    { rowPrepend: null, headerPrepend: null, propName: 'agentSalesStat', title: '' },
    { rowPrepend: null, headerPrepend: null, propName: 'locationSalesStat', title: '' },
];

export const MA_PRESET: ITablePreset[] = [
    { rowPrepend: null, headerPrepend: null, propName: 'locationSalesStat', title: '' },
];
