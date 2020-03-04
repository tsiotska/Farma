import { parse } from 'query-string';

export const getParamFromQueryString = (searchString: string, param: string): string | undefined => {
    const params: any = parse(searchString);
    return params[param];
};
