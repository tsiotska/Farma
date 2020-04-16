import { INotification } from '../../interfaces/iNotification';
import { objectArrayNormalizer, IValuesMap, defaultObjectNormalizer } from './normalizer';
import { NOTIFICATIONS_TYPE } from '../../constants/NotificationsType';
import isValid from 'date-fns/isValid';
import shortid from 'shortid';
import { doctorValuesMap, defaultDoctor } from './doctorsNormalizer';
import { lpuValuesMap, defaultLPU } from './lpuNormalizer';
import { IUserNotification } from '../../interfaces/IUserNotification';
import { USER_ROLE } from '../../constants/Roles';

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

const defaultUserNotification: IUserNotification = {
    id: null,
    name: null,
    email: null,
    position: null,
    workPhone: null,
    mobilePhone: null,
    card: null,
    avatar: null,
    created: null,
    confirmed: null
};

const userNotificationValuesMap: IValuesMap = {
    id: 'id',
    full_name: 'name',
    email: 'email',
    position: 'position',
    work_phone: 'workPhone',
    mobile_phone: 'mobilePhone',
    bank_card: 'card',
    avatar: 'avatar',
    created: 'created',
    confirmed: 'confirmed'
};

const typeNormalizer = (value: string) => NOTIFICATIONS_TYPE[value.toUpperCase()] || NOTIFICATIONS_TYPE.MESSAGE;

export const notificationsNormalizer = ({ data: { data }}: any) => objectArrayNormalizer(
    // [
    //     {
            // 'user': 2,
            // 'branch': 1,
            // 'message': 'Додавання нового користувача',
            // 'datetime': '2020-04-14 12:57:26',
            // 'notify_type': 'user',
            // 'is_new': true,
            // 'object': {
            //     'id': 10,
            //     'full_name': 'new user',
            //     'employee_id': null,
            //     'position': 4,
            //     'email': 'user2@gmail.com',
            //     'hash_password': '5f4dcc3b5aa765d61d8327deb882cf99',
            //     'work_phone': null,
            //     'mobile_phone': null,
            //     'bank_card': '3425 8963 8768 3902',
            //     'avatar': null,
            //     'created': '2020-04-14 12:57:26',
            //     'modified': null,
            //     'confirmed': true
            // }
    //     }
    // ],
    [...data, {
        'user': 2,
        'branch': 1,
        'message': 'Додавання нового користувача',
        'datetime': '2020-04-14 12:57:26',
        'notify_type': 'user',
        'is_new': true,
        'object': {
            'id': 10,
            'full_name': 'new user',
            'employee_id': null,
            'position': 4,
            'email': 'user2@gmail.com',
            'hash_password': '5f4dcc3b5aa765d61d8327deb882cf99',
            'work_phone': '123412341324',
            'mobile_phone': '4534645765',
            'bank_card': '3425 8963 8768 3902',
            'avatar': null,
            'created': '2020-04-14 12:57:26',
            'modified': null,
            'confirmed': true
        }
    }],
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
                    case NOTIFICATIONS_TYPE.AGENT: return defaultObjectNormalizer(value, defaultDoctor, doctorValuesMap);
                    case NOTIFICATIONS_TYPE.HCF: return defaultObjectNormalizer(value, defaultLPU, lpuValuesMap);
                    case NOTIFICATIONS_TYPE.PHARMACY: return defaultObjectNormalizer(value, defaultLPU, lpuValuesMap);
                    case NOTIFICATIONS_TYPE.USER: return defaultObjectNormalizer(
                            value,
                            defaultUserNotification,
                            userNotificationValuesMap,
                            {
                                position: (position: number) => USER_ROLE[USER_ROLE[position]] || USER_ROLE.UNKNOWN,
                                created: (dateString: Date) => {
                                    const res = new Date(dateString);
                                    return isValid(res)
                                        ? res
                                        : null;
                                },
                                confirmed: (isConfirmed: number) => !!isConfirmed
                            }
                        );
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
