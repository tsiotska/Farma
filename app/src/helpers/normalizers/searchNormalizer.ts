import { ISearchResult } from '../../interfaces/ISearchResult';

const defaultSearchResult: ISearchResult = {
    id: null,
    lpuName: null,
    name: null,
    city: null,
    address: null,
    ffm: null,
    rm: null,
    mp: null,
    mpName: null,
};

export const searchNormalizer = ({ data: { data }}: any): ISearchResult[] => {
    if (!data || !Array.isArray(data)) return null;

    return data.map(({
        hcf_name,
        full_name,
        ffm_user,
        rm_user,
        mp_user,
        mp_name,
        ...rest
    }: any) => ({
        ...defaultSearchResult,
        ...rest,
        lpuName: hcf_name,
        name: full_name,
        ffm: ffm_user,
        rm: rm_user,
        mp: mp_user,
        mpName: mp_name,
    }));
};
