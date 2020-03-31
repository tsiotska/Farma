import { ICacheStore } from '../interfaces/ICacheStore';

export class CacheStore implements ICacheStore {
    getCachedData = <T>(url: string, normalizer: (data: any) => T): T => {
        const cachedData = window.sessionStorage.getItem(url);
        try {
            return normalizer(JSON.parse(cachedData));
        } catch {
            return null;
        }
    }

    setCachedData = (url: string, json: string): boolean => {
        try {
            window.sessionStorage.setItem(url, json);
            return true;
        } catch {
            return false;
        }
    }

    stringifyData(data: any): string {
        try {
            return JSON.stringify(data);
        } catch {
            return null;
        }
    }
}
