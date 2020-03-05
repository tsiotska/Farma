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

    defaultErrorHandler = (response: any = null) => (e: any) => {
        console.error('error: ', e);
        return response;
    }

    logout(): Promise<any> {
        return this.instance.post('/api/signout')
        .then(() => true)
        .catch(this.defaultErrorHandler(false));
    }
}
