import { salesNormalizer } from './../helpers/normalizers/salesNormalizer';
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
import { ISalesStat } from '../interfaces/ISalesStat';
import { mockSales } from './mock/mockSales';

/**
 * Class representing API requester
 * @class APIRequester
 */
export class APIRequester {
    protected instance: AxiosInstance;
    constructor() {
        console.log('apiurl: ', Config.API_URL);
        this.instance = axios.create({
            baseURL: Config.API_URL,
            withCredentials: true
        });
    }

    defaultErrorHandler = (response: any = null) => (e: any) => {
        console.error('error: ', e);
        return response;
    }

    logout(): Promise<any> {
        return this.instance.post('/api/signout')
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

        return this.instance.get('api/branch')
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

        return this.instance.get('api/user')
        .then(userNormalizer)
        .catch(this.defaultErrorHandler(mockUser));
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

    getSalesStat(url: string): Promise<ISalesStat[]> {
        return this.instance.get(url)
        .then(salesNormalizer)
        .catch(this.defaultErrorHandler(mockSales));
    }
}
