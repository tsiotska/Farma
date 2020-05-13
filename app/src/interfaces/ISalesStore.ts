export interface ISalesStore {
    dateFrom: Date;
    dateTo: Date;
    resetStore: () => void;
    setIgnoredLocations: (numbers: Set<number>) => void;
}
