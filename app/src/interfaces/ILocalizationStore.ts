export interface ILocalizationStore {
    currentLocale: string;
    changeLanguage: (lang: string) => Promise<void>;
}
