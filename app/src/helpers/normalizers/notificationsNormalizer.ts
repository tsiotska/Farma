import { INotification } from '../../interfaces/iNotification';
import { objectArrayNormalizer, IValuesMap } from './normalizer';
import { NOTIFICATIONS_TYPE } from '../../constants/NotificationsType';
import isValid from 'date-fns/isValid';
import shortid from 'shortid';

const defaultNotification: INotification = {
    id: null,
    user: null,
    department: null,
    message: null,
    date: null,
    type: null,
    isNew: null,
    payload: null,
};

const valuesMap: IValuesMap = {
    user: 'user',
    branch: 'department',
    message: 'message',
    datetime: 'date',
    notify_type: 'type',
    is_new: 'isNew',
    object: 'payload',
};

const typeNormalizer = (value: string) => NOTIFICATIONS_TYPE[value.toUpperCase()] || NOTIFICATIONS_TYPE.MESSAGE;

export const notificationsNormalizer = ({ data: { data }}: any) => objectArrayNormalizer(
    data,
    defaultNotification,
    valuesMap,
    {
        requiredProps: [
            'user',
            'branch',
            'message',
            'datetime',
            'notify_type',
            'is_new',
        ],
        valueNormalizers: {
            type: typeNormalizer,
            isNew: (value: any) => !!value,
            date: (value: any) => {
                const date = new Date(value);
                return isValid(date)
                    ? date
                    : null;
            },
            payload: (value: any, dataObject: any) => {
                const { notify_type } = dataObject;
                const type = typeNormalizer(notify_type);
                switch (type) {
                    case NOTIFICATIONS_TYPE.MESSAGE: return null;
                    case NOTIFICATIONS_TYPE.AGENT: return ;
                    case NOTIFICATIONS_TYPE.HCF: return null;
                    case NOTIFICATIONS_TYPE.PHARMACY: return null;
                    case NOTIFICATIONS_TYPE.USER: return null;
                    default: return null;
                }
            },
        }
    }
).sort((a, b) => (
    (a.isNew === b.isNew)
        ? 0
        : a.isNew
            ? -1
            :  1
)).map(x => ({ ...x, id: shortid.generate() }));
