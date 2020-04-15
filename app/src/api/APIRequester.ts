import { workersNormalizer } from './../helpers/workersNormalizer';
import { IUserCredentials } from './../interfaces/IUser';
import { medsStatNormalizer } from './../helpers/normalizers/medsStatNormalizer';
import { ILPU } from './../interfaces/ILPU';
import { positionsNormalizer } from './../helpers/normalizers/positionsNormalizer';
import { medsNormalizer } from './../helpers/normalizers/medsNormalizer';
import axios, { AxiosInstance } from 'axios';

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
import Config from '../../Config';
import delay from 'lodash/delay';
import { USER_ROLE } from '../constants/Roles';
import { ISalaryInfo } from '../interfaces/ISalaryInfo';
import { salaryNormalizer } from '../helpers/normalizers/salaryNormalizer';
import { ISalarySettings } from '../interfaces/ISalarySettings';
import { NOTIFICATIONS_TYPE } from '../constants/NotificationsType';
import { notificationsNormalizer } from '../helpers/normalizers/notificationsNormalizer';

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
            withCredentials: true,
        });

        // request logger
        // this.instance.interceptors.request.use(request => {
        //     console.trace('Starting Request', request)
        //     return request
        //   })
    }

    defaultErrorHandler = (response: any = null) => (e: any) => {
        console.error('error: ', e);
        return response;
    }

    requestRepeater = async <T>(
        promise: Promise<any>,
        successCallback: (data: any) => T,
        errorCallback: (data: any) => T,
        retryCount: number,
        retryInterval: number
    ): Promise<T> => {
        const { hasError, request } = await promise
            .then(r => ({ hasError: false, request: r }))
            .catch(r => ({ hasError: true, request: r }));

        if (retryCount === 0) {
            return hasError
            ? errorCallback(request)
            : successCallback(request);
        }

        if (hasError) {
            return (request.response && request.response.config)
            ? new Promise<T>(async (resolve) => {
                setTimeout(
                    () => resolve(
                        this.requestRepeater(
                                axios(request.response.config),
                                successCallback,
                                errorCallback,
                                retryCount - 1,
                                retryInterval
                            )
                        ),
                    retryInterval
                );
              })
            : errorCallback(request);
        } else {
            return successCallback(request);
        }
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
        return this.requestRepeater(
            this.instance.get('/api/branch'),
            branchesNormalizer,
            this.defaultErrorHandler(),
            5,
            1500
        );
    }

    getUser(userId?: number): Promise<IUser> {
        const url = userId
        ? `api/profile/${userId}`
        : `api/profile`;

        return this.instance.get(url)
            .then(userNormalizer)
            .catch(this.defaultErrorHandler());
    }

    addMedicine(departmentId: number, formData: any): Promise<any> {
        return this.instance.post(`/api/branch/${departmentId}/drug`, formData)
        .then(({ data }) => medsNormalizer({ data: [data]}))
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
        return this.requestRepeater(
            this.instance.get('api/position'),
            positionsNormalizer,
            this.defaultErrorHandler(),
            5,
            1500
        );
    }

    getMedicalDepartments(departmentId: number, user: IUser, unconfirmed: boolean = false): Promise<ILPU[]> {
        const { position, id } = user;

        const urlParam = unconfirmed
        ? '?unconfirmed=1'
        : '';

        let url: string;
        if (position === USER_ROLE.FIELD_FORCE_MANAGER) url = `/api/branch/${departmentId}/ffm/hcf${urlParam}`;
        else if (position === USER_ROLE.REGIONAL_MANAGER) url = `/api/branch/${departmentId}/rm/${id}/hcf${urlParam}`;
        else if (position === USER_ROLE.MEDICAL_AGENT) url = `/api/branch/${departmentId}/mp/${id}/hcf${urlParam}`;

        if (!url) return;

        return this.instance.get(url)
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
        return this.requestRepeater(
            this.instance.get(url),
            locationsNormalizer,
            this.defaultErrorHandler(),
            3,
            1500
        );
    }

    getAgents(branchId: number, positionId: number): Promise<IUser[]> {
        return this.instance.get(`/api/branch/${branchId}/user/${positionId}`)
            .then(multipleUserNormalizer)
            .catch(this.defaultErrorHandler());
    }

    getPharmacies(url: string): Promise<ILPU[]> {
        return this.instance.get(url)
            .then(lpuNormalizer)
            .catch(this.defaultErrorHandler());
    }

    getExcel(url: string): Promise<any> {
        return this.instance.get(url, { responseType: 'blob' })
        .then(({ headers, data }) => {
            const headerValue = headers['content-disposition'];
            const fileName = headerValue
                ? headerValue.split('=')[1]
                : null;
            const fileUrl = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = fileUrl;
            link.setAttribute(
                'download',
                (fileName && fileName.match(/.xlsx$/))
                    ? fileName
                    : 'file.xlsx'
            );
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch(() => {
            console.log('load excel error');
        });
    }

    getUserSalary(departmentId: number, userId: number): Promise<any> {
        return this.instance.get(`/api/branch/${departmentId}/salary/${userId}`)
            .then(salaryNormalizer)
            .catch(this.defaultErrorHandler());
    }

    getSalarySettings(): Promise<ISalarySettings> {
        return this.instance.get('/api/settings')
        .then(({ data: { data: { default_amount_kpi, payments }} }) => ({
            kpi: default_amount_kpi || null,
            paymements: payments || null
        }))
        .catch(this.defaultErrorHandler());
    }

    updateSalarySettings(departmentId: number, data: any): Promise<boolean> {
        return this.instance.put(`/api/branch/${departmentId}/salary`, data)
            .then(() => true)
            .catch(this.defaultErrorHandler(false));
    }

    updatePermissions(data: any): Promise<boolean> {
        return this.instance.put('/api/position', data)
            .then(() => true)
            .catch(this.defaultErrorHandler(false));
    }

    updateCommonSettings(settings: ISalarySettings) {
        return this.instance.put('/api/settings', settings)
            .then(() => true)
            .catch(this.defaultErrorHandler(false));
    }

    getNotifications() {
        return this.instance.get('/api/notify')
            .then(notificationsNormalizer)
            .catch(this.defaultErrorHandler());
    }

    getNotificationsCount(): Promise<number> {
        return this.instance.get('/api/notify?new=1')
            .then(({ data: { data: { notify_new }}}: any) => (+notify_new || 0))
            .catch(this.defaultErrorHandler(0));
    }
}
