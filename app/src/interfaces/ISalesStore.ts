export interface ISalesStore {
    dateFrom: Date;
    dateTo: Date;
    initializeStore: () => void;
    initMedsDisplayStatuses: () => void;
}
