import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en-US.json';
import zh from './locales/zh-CN.json';

import Config from '../../Config';

const resources = {
    // en, // import default locale file
    zh
};

const instance = i18next.createInstance();
instance
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: 'zh-CN',
        debug: false,
        keySeparator: false, // we do not use keys in form messages.welcome
        ns: [''],
        nsSeparator: '',
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
        react: {
            wait: true
        }
});

export default instance;
