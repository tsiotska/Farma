import { workersNormalizer } from './../helpers/workersNormalizer';
import { IUserCredentials, IUserCommonInfo } from './../interfaces/IUser';
import { medsStatNormalizer } from './../helpers/normalizers/medsStatNormalizer';
import { ILPU } from './../interfaces/ILPU';
import { positionsNormalizer } from './../helpers/normalizers/positionsNormalizer';
import { mockDrugs } from './mock/mockDrugs';
import { medsNormalizer } from './../helpers/normalizers/medsNormalizer';
import axios, { AxiosInstance } from 'axios';

import Config from '../../Config';
import { IDepartment } from '../interfaces/IDepartment';
import { branchesNormalizer } from '../helpers/normalizers/branchesNormalizer';
import { IUser } from '../interfaces';
import { userNormalizer } from '../helpers/normalizers/userNormalizer';
import { IMedicine } from '../interfaces/IMedicine';
import { IPosition } from '../interfaces/IPosition';
import { lpuNormalizer } from '../helpers/normalizers/lpuNormalizer';
import { mockSales } from './mock/mockSales';
import { salesStatNormalizer } from '../helpers/normalizers/salesStatNormalizer';
import { mockRegionSalesState } from './mock/mockRegionSalesStat';
import { IWorker } from '../interfaces/IWorker';
import { ILocation } from '../interfaces/ILocation';
import { locationsNormalizer } from '../helpers/normalizers/locationsNormalizer';
import { IMedsSalesStat, ISalesStat } from '../interfaces/ISalesStat';
import { agentNormalizer } from '../helpers/normalizers/agentNormalizer';

/**
 * Class representing API requester
 * @class APIRequester
 */
export class APIRequester {
    protected instance: AxiosInstance;
    constructor() {
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
        return this.instance.delete('/api/signout')
            .then(() => true)
            .catch(this.defaultErrorHandler(false));
    }

    getBranches(): Promise<IDepartment[]> {
        const mockDepartments: IDepartment[] = [
            {
                id: 1,
                name: 'urology',
                image: null,
            },
            {
                id: 2,
                name: 'cardiology',
                image: null,
            },
        ];

        return this.instance.get('/api/branch')
            .then(branchesNormalizer)
            .catch(this.defaultErrorHandler(mockDepartments));
    }

    getUser(): Promise<IUser> {
        const mockUser: IUser = {
            id: 1,
            name: 'Мушастикова Ольга Владимировна',
            position: 1,
            avatar: null,
            doctorsCount: null,
            pharmacyCount: null,
            region: null,
            level: null,
            city: null,
        };

        return this.instance.get('api/profile')
            .then(userNormalizer)
            .catch(this.defaultErrorHandler());
        // .catch(this.defaultErrorHandler(mockUser));
    }

    getMeds(departmentId: number): Promise<IMedicine[]> {
        return this.instance.get(`api/branch/${departmentId}/drug`)
            .then(medsNormalizer)
            .catch(this.defaultErrorHandler(mockDrugs));
    }

    getPositions(): Promise<IPosition[]> {
        const mockPositions: IPosition[] = [
            {
                id: 1,
                name: 'admin',
                alias: 'adm'
            }
        ];

        return this.instance.get('api/position')
            .then(positionsNormalizer)
            .catch(this.defaultErrorHandler(mockPositions));
    }

    getMedicalDepartments(): Promise<ILPU[]> {
        const mockMedicalDepartments: ILPU[] = [
            {
                id: 1,
                name: 'test lpu'
            }
        ];

        return this.instance.get('api/lpu')
            .then(lpuNormalizer)
            .catch(this.defaultErrorHandler(mockMedicalDepartments));
    }

    getMedsSalesStat(url: string): Promise<IMedsSalesStat[]> {
        return this.instance.get(url)
            .then(medsStatNormalizer)
            .catch(this.defaultErrorHandler());
    }

    getSalesStat(url: string): Promise<ISalesStat[]> {
        return this.instance.get(url)
            .then(salesStatNormalizer)
            .catch(this.defaultErrorHandler());
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

    getLocationAgents(branchId: number, positionId: number): Promise<IUserCommonInfo[]> {
        return this.instance.get(`/api/branch/${branchId}/user/${positionId}`)
        .then(agentNormalizer)
        .catch(this.defaultErrorHandler());
    }
}
