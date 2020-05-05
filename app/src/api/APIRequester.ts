import { salariesNormalizer } from './../helpers/normalizers/salariesNormalizer';
import { workersNormalizer, workerNormalizer } from './../helpers/workersNormalizer';
import { IUserCredentials } from './../interfaces/IUser';
import { medsStatNormalizer } from './../helpers/normalizers/medsStatNormalizer';
import { ILPU } from './../interfaces/ILPU';
import { positionsNormalizer } from './../helpers/normalizers/positionsNormalizer';
import { medsNormalizer } from './../helpers/normalizers/medsNormalizer';
import axios, { AxiosInstance } from 'axios';

import { IDepartment } from '../interfaces/IDepartment';
import { branchesNormalizer, branchNormalizer } from '../helpers/normalizers/branchesNormalizer';
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
import { USER_ROLE } from '../constants/Roles';
import { salaryNormalizer } from '../helpers/normalizers/salaryNormalizer';
import { ISalarySettings } from '../interfaces/ISalarySettings';
import { notificationsNormalizer } from '../helpers/normalizers/notificationsNormalizer';
import { INotification } from '../interfaces/iNotification';
import { IDoctor } from '../interfaces/IDoctor';
import { doctorsNormalizer } from '../helpers/normalizers/doctorsNormalizer';
import { bonusInfoNormalizer, bonusesDataNormalizer } from '../helpers/normalizers/bonusInfoNormaliser';
import { IDrugSale, IAgentInfo } from '../interfaces/IBonusInfo';
import { IUserSalary } from '../interfaces/IUserSalary';
import { ISpecialty } from '../interfaces/ISpecialty';
import { specialtyNormalizer } from '../helpers/normalizers/specialtyNormalizer';
import { CONFIRM_STATUS } from '../constants/ConfirmationStatuses';

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

        if (hasError === false) {
            try {
                return successCallback(request);
            } catch {
                return errorCallback(request);
            }
        }

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
        .then(({ data: { data } }) => medsNormalizer({ data: [data]}))
        .catch(this.defaultErrorHandler());
    }

    getMeds(departmentId: number): Promise<IMedicine[]> {
        return this.instance.get(`api/branch/${departmentId}/drug`)
            .then(({ data }: any) => medsNormalizer(data))
            .catch(this.defaultErrorHandler());
    }

    editMedicine(depId: number, medId: number, data: FormData): Promise<boolean> {
        return this.instance.put(`/api/branch/${depId}/drug/${medId}`, data)
            .then(() => true)
            .catch(() => false);
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

    getInCityLpus(depId: number, cityId: number): Promise<ILPU[]> {
        return this.instance.get(`/api/branch/${depId}/ffm/hcf?city=${cityId}`)
            .then(lpuNormalizer)
            .catch(this.defaultErrorHandler([]));
    }

    getMedicalDepartments(departmentId: number, user: IUser, unconfirmed: boolean = false, page?: number): Promise<ILPU[]> {
        const {position, id} = user;
        const urlParam = unconfirmed
            ? '?unconfirmed=1'
            : `?page=${page}`;
        let url: string;
        if (position === USER_ROLE.FIELD_FORCE_MANAGER) url = `/api/branch/${departmentId}/ffm/hcf${urlParam}`;
        else if (position === USER_ROLE.REGIONAL_MANAGER) url = `/api/branch/${departmentId}/rm/${id}/hcf${urlParam}`;
        else if (position === USER_ROLE.MEDICAL_AGENT) url = `/api/branch/${departmentId}/mp/${id}/hcf${urlParam}`;

        if (!url) return;
        return this.instance.get(url)
            .then(lpuNormalizer)
            .catch(this.defaultErrorHandler());
    }

    addLpu(postData: any): Promise<ILPU> {
        return this.instance.post('/api/hcf', postData)
            .then(({ data: { data }}) => lpuNormalizer({ data: [ data ]}))
            .catch(this.defaultErrorHandler());
    }

    addPharmacy(postData: any): Promise<ILPU> {
        return this.instance.post(`/api/pharmacy`, postData)
            .then(({ data: { data }}) => lpuNormalizer({ data: [ data ]}))
            .catch(this.defaultErrorHandler());
    }

    editLpu(id: number, data: any): Promise<boolean> {
        return this.instance.put(`/api/hcf/${id}`, data)
            .then(() => true)
            .catch(this.defaultErrorHandler(false));
    }

    editPharmacy(depId: number, data: any): Promise<boolean> {
        return this.instance.put(`/api/pharmacy/${depId}`, data)
        .then(() => true)
        .catch(this.defaultErrorHandler(false));
    }

    deleteLpu(id: number): Promise<boolean> {
        return this.instance.delete(`/api/hcf/${id}`)
            .then(() => true)
            .catch(this.defaultErrorHandler(false));
    }

    deletePharmacy(id: number): Promise<boolean> {
        return this.instance.delete(`/api/pharmacy/${id}`)
            .then(() => true)
            .catch(this.defaultErrorHandler(false));
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

    restoreMedicine(depId: number, medId: number) {
        return this.instance.put(`/api/branch/${depId}/drug/${medId}/restore`)
            .then(() => true)
            .catch(this.defaultErrorHandler(false));
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

    getOblasti(): Promise<ILocation[]> {
        return this.instance.get('/api/oblast')
        .then(({ data: { data } }) => (
            Array.isArray(data)
            ? data.map(
                (name: string, id: number) => ({
                    id,
                    name
                }))
            : []
        ))
        .catch(this.defaultErrorHandler([]));
    }

    getLocations(url: string): Promise<ILocation[]> {
        return this.instance.get(url)
            .then(locationsNormalizer)
            .catch(this.defaultErrorHandler());
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

    getExcel(url: string, customFileName?: string): Promise<any> {
        const defaultFileName = 'file.xlsx';
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
                customFileName || (
                    (fileName && fileName.match(/.xlsx$/))
                    ? fileName
                    : defaultFileName
                )
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
            payments: payments || null
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

    updateCommonSettings({ kpi, payments }: ISalarySettings) {
        const data: any = {
            default_amount_kpi: kpi,
            payments
        };
        return this.instance.put('/api/settings', data)
            .then(() => true)
            .catch(this.defaultErrorHandler(false));
    }

    getNotifications(): Promise<INotification[]> {
        return this.instance.get('/api/notify')
            .then(notificationsNormalizer)
            .catch(this.defaultErrorHandler());
    }

    getNotificationsCount(): Promise<number> {
        return this.instance.get('/api/notify?new=1')
            .then(({ data: { data: { notify_new }}}: any) => (+notify_new || 0))
            .catch(this.defaultErrorHandler(0));
    }

    reviewNotifications(): Promise<boolean> {
        return this.instance.put('/api/notify')
            .then(() => true)
            .catch(this.defaultErrorHandler(false));
    }

    getDoctors(departmentId: number, mpId: number, unconfirmed?: boolean): Promise<IDoctor[]> {
        const query = unconfirmed
            ? '?unconfirmed=1'
            : '';

        return this.instance.get(`/api/branch/${departmentId}/mp/${mpId}/agent${query}`)
            .then(doctorsNormalizer)
            .catch(this.defaultErrorHandler(null));
    }

    createDepartment(departmentData: FormData): Promise<IDepartment> {
        return this.instance.post('/api/branch', departmentData)
            .then(branchNormalizer)
            .catch(this.defaultErrorHandler());
    }

    createWorker(userData: FormData, departmentId?: number): Promise<IWorker> {
        const url = departmentId
        ? `/api/branch/${departmentId}/worker`
        : '/api/worker';

        return this.instance.post(url, userData)
            .then(workerNormalizer)
            .catch(this.defaultErrorHandler());
    }

    createFFM(ffmData: FormData, departmentId: number): Promise<IUser> {
        return this.instance.post(`/api/branch/${departmentId}/worker`, ffmData)
            .then(userNormalizer)
            .catch(this.defaultErrorHandler());
    }

    getBonusInfo(depId: number, year: number, { id, position }: IUser) {
        const urls: any = {
            [USER_ROLE.FIELD_FORCE_MANAGER]: `api/branch/${depId}/ffm/marks`,
            [USER_ROLE.REGIONAL_MANAGER]: `api/branch/${depId}/rm/${id}/marks`,
            [USER_ROLE.MEDICAL_AGENT]: `api/branch/${depId}/mp/${id}/marks`,
        };

        const url = urls[position];

        if (!url) return null;

        return this.instance.get(`${url}?year=${year}`)
            .then(bonusInfoNormalizer)
            .catch(this.defaultErrorHandler());
    }

    getBonusesData(
        depId: number,
        { position, id }: IUser,
        year: number,
        month: number
    ): Promise<{
        sales: Map<number, IDrugSale>,
        agents: IAgentInfo[]
    }> {
        const urlParams = `?year=${year}&month=${month}`;

        const urls: { [key: number]: string } = {
            [USER_ROLE.FIELD_FORCE_MANAGER]: `/api/branch/${depId}/ffm/mark${urlParams}`,
            [USER_ROLE.REGIONAL_MANAGER]: `/api/branch/${depId}/rm/${id}/mark${urlParams}`,
            [USER_ROLE.MEDICAL_AGENT]: `/api/branch/${depId}/mp/${id}/mark${urlParams}`,
        };

        const url = urls[position];

        return url
        ? this.instance.get(url)
            .then(bonusesDataNormalizer)
            .catch(this.defaultErrorHandler())
        : null;
    }

    updateBonusesData(
        depId: number,
        userId: number,
        year: number,
        month: number,
        data: any
    ): Promise<boolean> {
        return this.instance.put(`/api/branch/${depId}/mp/${userId}/mark?year=${year}&month=${month}`, data)
            .then(() => true)
            .catch(this.defaultErrorHandler(false));
    }

    getRMsSalaries(branchId: number, year: number, month: number): Promise<IUserSalary[]> {
        return this.instance.get(`/api/branch/${branchId}/ffm/salary?year=${year}&month=${month}`)
            .then(salariesNormalizer)
            .catch(this.defaultErrorHandler());
    }

    getMPsSalaries(branchId: number, userId: number, year: number, month: number): Promise<IUserSalary[]> {
        return this.instance.get(`/api/branch/${branchId}/rm/${userId}/salary?year=${year}&month=${month}`)
        .then(salariesNormalizer)
        .catch(this.defaultErrorHandler());
    }

    calculateSalaries(branchId: number, year: number, month: number): Promise<boolean> {
        return this.instance.post(`/api/branch/${branchId}/salary?month=${month}&year=${year}`)
            .then(() => true)
            .catch(this.defaultErrorHandler(false));
    }

    deleteDrug(departmentId: number, drugId: number): Promise<boolean> {
        return this.instance.delete(`/api/branch/${departmentId}/drug/${drugId}`)
            .then(() => true)
            .catch(this.defaultErrorHandler(false));
    }

    getSpecialties(): Promise<ISpecialty[]> {
        return this.instance.get('/api/agent/speciality')
            .then(specialtyNormalizer)
            .catch(this.defaultErrorHandler());
    }

    getTypes(targetProp: 'hcf' | 'pharmacy'): Promise<string[]> {
        return this.instance.get(`api/${targetProp}/type`)
            .then(({ data: { data }}) => (
                Array.isArray(data)
                ? data
                : []
            ))
            .catch(this.defaultErrorHandler([]));
    }

    accept(id: number, objectType: 'agent' | 'hcf' | 'pharmacy'): Promise<CONFIRM_STATUS> {
        return this.instance.put(`api/${objectType}/${id}/accept`)
        .then(({ status }) => {
            return status === 200
            ? CONFIRM_STATUS.ACCEPTED
            : CONFIRM_STATUS.CONFIRMED;
        })
        .catch(this.defaultErrorHandler(CONFIRM_STATUS.REJECTED));
    }
}
