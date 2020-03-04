import i18n from '../localization/i18n';
import { observable, action } from 'mobx';

import { ILocalizationStore } from '../interfaces';

interface ILocale {
    locale: string;
    name: string;
}

const supportedLocales: string[] = [];

export const LOCALES: ILocale[] = [];

export default class LocalizationStore implements ILocalizationStore {
    @observable public currentLocale: string = '';

    @action.bound
    public async changeLanguage(lang: string): Promise<void> {
        try {
            const { default: translation } = await this.loadLocaleFile(lang);
            await i18n.addResourceBundle(lang, 'translation', translation, true, true);
            await i18n.changeLanguage(lang);
            this.currentLocale = lang;
        } catch (e) {
            console.error(e);
        }
    }

    private loadLocaleFile = (lang: string) => import(`../localization/locales/${lang}.json`);
}
