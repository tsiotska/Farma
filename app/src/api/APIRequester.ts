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

        return this.instance.get('api/branch')
        .then(branchesNormalizer)
        .catch(this.defaultErrorHandler(mockDepartments));
    }

    getUser(): Promise<IUser> {
        return this.instance.get('api/user')
        .then(userNormalizer)
        .catch(this.defaultErrorHandler({
            id: 1,
            name: 'Мушастикова Ольга Владимировна',
            position: 1,
            avatar: null,
            doctorsCount: null,
            pharmacyCount: null,
            region: null,
            level: null,
            city: null,
        }));
    }

    getMeds(department: string): Promise<IMedicine[]> {
        return this.instance.get(`api/branch/${department}/drug`)
        .then(medsNormalizer)
        .catch(this.defaultErrorHandler(mockDrugs));
    }

    getPositions(): Promise<IPosition[]> {
        return this.instance.get('api/position')
        .then(positionsNormalizer)
        .catch(this.defaultErrorHandler([
            {
                id: 1,
                name: 'admin',
                alias: 'adm'
            }
        ]));
    }
}
