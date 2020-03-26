import TextCell from '../../../components/DrugsTable/TextCell';

export interface ITablePreset {
    rowPrepend: any;
    headerPrepend: any;
    propName: 'locationSalesStat' | 'agentSalesStat';
    title?: string;
}

export const FFM_PRESET: ITablePreset[] = [
    { rowPrepend: TextCell, headerPrepend: TextCell, propName: 'agentSalesStat', title: 'Региональные менеджеры' },
    { rowPrepend: TextCell, headerPrepend: TextCell, propName: 'locationSalesStat', title: 'Регионы' },
];

export const MR_PRESET: ITablePreset[] = [
    { rowPrepend: null, headerPrepend: null, propName: 'agentSalesStat', title: 'Медицинские представители' },
    { rowPrepend: null, headerPrepend: null, propName: 'locationSalesStat' },
];

export const MA_PRESET: ITablePreset[] = [
    { rowPrepend: null, headerPrepend: null, propName: 'locationSalesStat', title: 'ЛПУ / Аптека' },
];
