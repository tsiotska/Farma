import { withTranslation } from 'react-i18next';

/**
 * Decorator for react-i18next withTranslations HoC.
 * Must be placed befor all decorators
 * @function translation
 */
export default function translation(Component: any): any {
    return withTranslation()(Component);
}
