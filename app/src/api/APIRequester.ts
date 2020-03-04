import axios, { AxiosInstance } from 'axios';

import Config from '../../Config';

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
}
