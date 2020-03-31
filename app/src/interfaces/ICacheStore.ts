export interface ICacheStore {
    getCachedData: <T>(url: string, normalizer: (data: any) => T) => T;
    setCachedData: (url: string, data: any) => boolean;
}
