export default class Config {
    public static IS_DEV: boolean = (process.env.NODE_ENV === 'development');
    public static API_VERSION: string = process.env.API_VERSION || '0.0.1';
    public static BASE_PATH: string = process.env.BASE_PATH || '/';
    public static IS_TEST: boolean = (process.env.NODE_ENV === 'test');
    public static API_URL: string = process.env.API_URL;
    public static RENEW_INTERVAL: number = 30000;
    public static SECTION_MAX_COUNT: number = 253;
    public static MAX_RENEW_COUNT: number = 5;
    public static RETRY_INTERVAL: number = 5000;
}
