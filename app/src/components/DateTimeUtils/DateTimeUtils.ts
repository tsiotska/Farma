import DateFnsUtils from '@date-io/date-fns';
import ru from 'date-fns/locale/ru';

export const uaMonthsNames: string[] = [
    'січень',
    'лютий',
    'березень',
    'квітень',
    'травень',
    'червень',
    'липень',
    'серпень',
    'вересень',
    'жовтень',
    'листопад',
    'грудень',
];

export default class DateTimeUtils extends DateFnsUtils {
    locale = ru;
    readonly correctMonthsNames: string[] = uaMonthsNames;

    getCalendarHeaderText = (date: Date): string => {
        const month = this.getMonth(date);
        const monthText = this.correctMonthsNames[month];
        const year = this.getYear(date);
        return `${monthText} ${year}`;
    }

    getWeekdays = () => [ 'пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'нд' ];
}
