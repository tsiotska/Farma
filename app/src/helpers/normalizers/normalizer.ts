export interface IValuesMap {
    [key: string]: string;
}

export interface IOptions<T> {
    requiredProps?: string[];
    valueNormalizers?: Partial<Record<keyof T, (value: any, dataObject?: any) => any>>;
    objectNormalizer?: (dataObject: T, defaultValue: T, namesMap: IValuesMap, valueNormalizers?: Partial<Record<keyof T, (data: any) => any>>) => T;
}

export const objectArrayNormalizer = <T>(
    data: any[],
    defaultValue: T,
    namesMap: IValuesMap,
    {
        valueNormalizers = {},
        requiredProps = [],
        objectNormalizer = defaultObjectNormalizer
    }: IOptions<T>
): T[] => {
    const result: T[] = [];

    if (!data || !Array.isArray(data)) return result;

    data.forEach((unnormalizedObject: any) => {
        const haveRequiredProps = requiredProps.every(prop => prop in unnormalizedObject);

        if (!haveRequiredProps) return;

        const newObject = objectNormalizer(
            unnormalizedObject,
            defaultValue,
            namesMap,
            valueNormalizers
        );

        result.push(newObject);
    });
    return result;
};

export const defaultObjectNormalizer = <T>(
    dataObject: any,
    defaultValue: T,
    namesMap: IValuesMap,
    valueNormalizers = {}
): T => {
    const normalizedObject: T = { ...defaultValue };

    for (const prop in dataObject) {
        const propName = namesMap[prop];

        if (!propName) continue;

        const unnormalizedValue = dataObject[prop];

        const value = propName in valueNormalizers
            ? valueNormalizers[propName](unnormalizedValue, dataObject)
            : unnormalizedValue;

        normalizedObject[propName] = value;
    }

    return normalizedObject;
};
