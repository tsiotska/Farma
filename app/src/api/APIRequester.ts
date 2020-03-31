import { workersNormalizer } from './../helpers/workersNormalizer';
import { IUserCredentials } from './../interfaces/IUser';
import { medsStatNormalizer } from './../helpers/normalizers/medsStatNormalizer';
import { ILPU } from './../interfaces/ILPU';
import { positionsNormalizer } from './../helpers/normalizers/positionsNormalizer';
import { medsNormalizer } from './../helpers/normalizers/medsNormalizer';
import axios, { AxiosInstance } from 'axios';

import Config from '../../Config';
import { IDepartment } from '../interfaces/IDepartment';
import { branchesNormalizer } from '../helpers/normalizers/branchesNormalizer';
import { IUser } from '../interfaces';
import { userNormalizer, multipleUserNormalizer } from '../helpers/normalizers/userNormalizer';
import { IMedicine } from '../interfaces/IMedicine';
import { IPosition } from '../interfaces/IPosition';
import { lpuNormalizer } from '../helpers/normalizers/lpuNormalizer';
import { salesStatNormalizer } from '../helpers/normalizers/salesStatNormalizer';
import { IWorker } from '../interfaces/IWorker';
import { ILocation } from '../interfaces/ILocation';
import { locationsNormalizer } from '../helpers/normalizers/locationsNormalizer';
import { IMedsSalesStat, ISalesStat } from '../interfaces/ISalesStat';
import { ICacheStore } from '../interfaces/ICacheStore';
import { CacheStore } from '../stores/CacheStore';

export interface ICachedPromise <T> {
    promise: Promise<T>;
    cache: any;
}

/**
 * Class representing API requester
 * @class APIRequester
 */
export class APIRequester {
    protected cacheStore: ICacheStore;
    protected instance: AxiosInstance;
    constructor() {
        this.cacheStore = new CacheStore();
        this.instance = axios.create({
            baseURL: Config.API_URL.trim(),
            withCredentials: true
        });
    }

    defaultErrorHandler = (response: any = null) => (e: any) => {
        console.error('error: ', e);
        return response;
    }

    login({ email, password }: IUserCredentials): Promise<boolean> {
        const preparedCredentials: IUserCredentials = {
            email: email.trim(),
            password: password.trim()
        };

        return this.instance.post('/api/signin', preparedCredentials)
            .then(() => true)
            .catch(this.defaultErrorHandler(false));
    }

    logout(): Promise<any> {
        return this.instance.post('/api/signout')
            .then(() => true)
            .catch(this.defaultErrorHandler(false));
    }

    getBranches(): Promise<IDepartment[]> {
        return this.instance.get('/api/branch')
            .then(branchesNormalizer)
            .catch(this.defaultErrorHandler());
    }

    getUser(userId?: number): Promise<IUser> {
        const url = userId
        ? `api/profile/${userId}`
        : `api/profile`;
        return this.instance.get(url)
            .then(userNormalizer)
            .catch(this.defaultErrorHandler());
    }

    getMeds(departmentId: number): ICachedPromise<IMedicine[]> {
        const url = `api/branch/${departmentId}/drug`;
        const cache = this.cacheStore.getCachedData(url, medsNormalizer);
        const promise =  this.instance.get(url)
            .then(({ data, request: { response }}) => {
                this.cacheStore.setCachedData(url, response);
                return medsNormalizer(data);
            })
            .catch(this.defaultErrorHandler());
        return { cache, promise };
    }

    getPositions(): Promise<IPosition[]> {
        return this.instance.get('api/position')
            .then(positionsNormalizer)
            .catch(this.defaultErrorHandler());
    }

    getMedicalDepartments(): Promise<ILPU[]> {
        return this.instance.get('api/hcf')
            .then(lpuNormalizer)
            .catch(this.defaultErrorHandler());
    }

    getMedsSalesStat(url: string): ICachedPromise<IMedsSalesStat[]> {
        const cache = this.cacheStore.getCachedData(url, medsStatNormalizer);
        const promise = this.instance.get(url)
            .then(({ data, request: { response }}) => {
                this.cacheStore.setCachedData(url, response);
                return medsStatNormalizer(data);
            })
            .catch(this.defaultErrorHandler());
        return { cache, promise };
    }

    getSalesStat(url: string): ICachedPromise<ISalesStat[]> {
        const cache = this.cacheStore.getCachedData(url, salesStatNormalizer);
        const promise = this.instance.get(url)
            .then(({ data, request: { response }}) => {
                this.cacheStore.setCachedData(url, response);
                return salesStatNormalizer(data);
            })
            .catch(this.defaultErrorHandler());
        return { cache, promise };
    }

    getWorkers(url: string): Promise<IWorker[]> {
        return this.instance.get(url)
            .then(workersNormalizer)
            .catch(this.defaultErrorHandler());
    }

    getLocations(url: string): Promise<ILocation[]> {
        return this.instance.get(url)
            .then(locationsNormalizer)
            .catch(this.defaultErrorHandler());
    }

    getLocationAgents(branchId: number, positionId: number): Promise<IUser[]> {
        return this.instance.get(`/api/branch/${branchId}/user/${positionId}`)
            .then(multipleUserNormalizer)
            .catch(this.defaultErrorHandler());
    }

    getPharmacies(): Promise<ILPU[]> {
        return this.instance.get(`/api/pharmacy`)
            .then(lpuNormalizer)
            .catch(this.defaultErrorHandler());
    }
}
