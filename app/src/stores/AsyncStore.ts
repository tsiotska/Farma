import { observable, action } from 'mobx';

export interface IAsyncStore {
    setLoading(key: string, params?: any): void;
    setSuccess(key: string): void;
    setError(key: string): void;

    clearParams(key: string): void;
    getRequestParams(key: string): any;
    getAsyncStatus(getAsyncStatus: string): Readonly<IAsyncStatus>;
}

export interface IAsyncStatus {
    loading: boolean;
    success: boolean;
    error: boolean;
}

/**
 * Class representing Async Store that provides
 * functionality for tracking asynchronous status
 * @class
 */
export default class AsyncStore implements IAsyncStore {
    @observable asyncStatusMap: Map<string, IAsyncStatus> = new Map();
    @observable requestParams: Map<string, any> = new Map();
    readonly defaultStatus: IAsyncStatus = {
        loading: false,
        success: false,
        error: false
    };

    public getAsyncStatus = (key: string): Readonly<IAsyncStatus> => {
        return this.asyncStatusMap.get(key) || this.defaultStatus;
    }

    public getRequestParams = (key: string): any => {
        return this.requestParams.get(key) || null;
    }

    @action.bound
    public setLoading(key: string, params?: any): void {
        if (params) this.requestParams.set(key, params);
        this.asyncStatusMap.set(key, {
            loading: true,
            success: false,
            error: false
        });
    }

    @action.bound
    public setSuccess(key: string): void {
        this.asyncStatusMap.set(key, {
            loading: false,
            success: true,
            error: false
        });
    }

    @action.bound
    public setError(key: string): void {
        this.asyncStatusMap.set(key, {
            loading: false,
            success: false,
            error: true
        });
    }

    @action.bound
    public clearParams(key: string): void {
        this.requestParams.delete(key);
    }

    @action.bound
    public async requestDispatcher<T>(request: Promise<T>, requestName: string, requestParams?: any): Promise<T> {
        this.setLoading(requestName, requestParams);
        const res = await request;

        const callback = res
        ? this.setSuccess
        : this.setError;

        callback(requestName);
        this.clearParams(requestName);

        return res;
    }
}
