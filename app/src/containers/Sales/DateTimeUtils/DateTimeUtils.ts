import DateFnsUtils from '@date-io/date-fns';
import { ru } from 'date-fns/locale';

export const ruMonthsNames: string[] = [
    'январь',
    'февраль',
    'март',
    'апрель',
    'май',
    'июнь',
    'июль',
    'август',
    'сентябрь',
    'октябрь',
    'ноябрь',
    'декабрь',
];

export default class DateTimeUtils extends DateFnsUtils {
    locale = ru;
    readonly correctMonthsNames: string[] = ruMonthsNames;

    getCalendarHeaderText = (date: Date): string => {
        const month = this.getMonth(date);
        const monthText = this.correctMonthsNames[month];
        const year = this.getYear(date);
        return `${monthText} ${year}`;
    }
}
