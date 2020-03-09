import { ADMIN } from './../constants/Roles';
import { medsNormalizer } from './../helpers/normalizers/medsNormalizer';
import axios, { AxiosInstance } from 'axios';

import Config from '../../Config';
import { IDepartment } from '../interfaces/IDepartment';
import { branchesNormalizer } from '../helpers/normalizers/branchesNormalizer';
import { IUser } from '../interfaces';
import { userNormalizer } from '../helpers/normalizers/userNormalizer';
import { IMedicine } from '../interfaces/IMedicine.';

/**
 * Class representing API requester
 * @class APIRequester
 */
export class APIRequester {
    protected instance: AxiosInstance;
    constructor() {
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

        return this.instance.get(`${Config.API_URL}api/branch`)
        .then(branchesNormalizer)
        .catch(this.defaultErrorHandler(mockDepartments));
    }

    getUser(): Promise<IUser> {
        return this.instance.get(`${Config.API_URL}api/user`)
        .then(userNormalizer)
        .catch(this.defaultErrorHandler({
            id: 1,
            name: 'Мушастикова Ольга Владимировна',
            position: ADMIN,
            avatar: null,
            doctorsCount: null,
            pharmacyCount: null,
            region: null,
            level: null,
            city: null,
        }));
    }

    getMeds(department: string): Promise<IMedicine[]> {
        return this.instance.get(`${Config.API_URL}api/branch/${department}/drug`)
        .then(medsNormalizer)
        .catch(this.defaultErrorHandler());
    }
}
