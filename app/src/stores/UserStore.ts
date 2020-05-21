import { IDoctor } from './../interfaces/IDoctor';
import { IBonusInfo, IAgentInfo, IMark } from './../interfaces/IBonusInfo';
import { computed, action, observable, toJS, runInAction } from 'mobx';
import { IUserCredentials, IUserCommonInfo } from './../interfaces/IUser';
import { IRootStore } from './../interfaces/IRootStore';
import AsyncStore from './AsyncStore';
import { IUserStore } from '../interfaces/IUserStore';
import { IUser } from '../interfaces';
import { USER_ROLE, singleDepartmentRoles, multiDepartmentRoles } from '../constants/Roles';
import { defaultUser } from '../helpers/normalizers/userNormalizer';
import { ISalaryInfo, IUserSales, IMedSalary } from '../interfaces/ISalaryInfo';
import { ISalarySettings } from '../interfaces/ISalarySettings';
import { INotification } from '../interfaces/iNotification';
import uniq from 'lodash/uniq';
import format from 'date-fns/format';
import { IMedicine } from '../interfaces/IMedicine';
import { IDeposit } from '../interfaces/IDeposit';
import { IDepositFormValue } from '../containers/Doctors/EditDepositModal/EditDepositModal';
import { PERMISSIONS } from '../constants/Permissions';
import { IUserLikeObject } from './DepartmentsStore';

export interface IMarkFraction {
    payments: number;
    deposit: number;
}

export interface ITotalMarks {
    packs: IMarkFraction;
    marks: IMarkFraction;
}

export default class UserStore extends AsyncStore implements IUserStore {
    rootStore: IRootStore;
    @observable user: IUser;
    @observable navHistory: IUser[] = [];
    @observable salarySettings: ISalarySettings = null;
    @observable userSalary: Map<number, ISalaryInfo> = new Map();
    @observable userSales: IUserSales = null;
    @observable notificationsCount: number = 0;
    @observable notifications: INotification[] = [];
    @observable isMedsDivisionValid: boolean = false;

    @observable bonuses: Partial<Record<USER_ROLE, IBonusInfo[]>> = {
        [USER_ROLE.FIELD_FORCE_MANAGER]: [],
        [USER_ROLE.REGIONAL_MANAGER]: [],
        [USER_ROLE.MEDICAL_AGENT]: [],
    };
    @observable previewBonusMonth: number = null;
    @observable previewBonusTotal: ITotalMarks = null;
    @observable bonusesYear: number = new Date().getFullYear();

    // userId, medId
    @observable changedMarks: Map<number, Map<number, IMark>> = new Map();
    @observable bonusUsers: IUserLikeObject[] = [];

    notificationsUpdateInterval: any = null;

    constructor(rootStore: IRootStore) {
        super();
        this.rootStore = rootStore;
        this.loadUserProfile();
    }

    @computed
    get userPermissions(): PERMISSIONS[] {
        const { departmentsStore: { positions } } = this.rootStore;

        if (!this.user || !positions) return [];

        const userPosition = positions.get(this.user.position);

        return userPosition
            ? userPosition.permissions
            : [];
    }

    @computed
    get isUserFetched(): boolean {
        const { success, error } = this.getAsyncStatus('loadUserProfile');
        return success || error;
    }

    @computed
    get isAdmin(): boolean {
        return this.user
            ? multiDepartmentRoles.includes(this.user.position)
            : false;
    }

    @computed
    get isUserLoading(): boolean {
        return this.getAsyncStatus('loadUserProfile').loading;
    }

    @computed
    get previewUser(): IUser {
        return this.navHistory[this.navHistory.length - 1] || null;
    }

    @computed
    get role(): USER_ROLE {
        return this.previewUser
            ? this.previewUser.position
            : USER_ROLE.UNKNOWN;
    }

    @computed
    get totalSold(): { [key: number]: number } {
        const bonuses = this.bonuses[this.role];
        const actual: IBonusInfo = bonuses
            ? bonuses.find(({ month }) => month === this.previewBonusMonth)
            : null;
        if (!actual) return {};

        const res = actual.agents.reduce((acc, { marks }) => {
            marks.forEach(({ deposit, payments, drugId }) => {
                acc[drugId] = (acc[drugId] || 0) + deposit + payments;
            });
            return acc;
        }, {});

        return res;
    }

    @computed
    get changedMedsMarks(): { [key: number]: number } {
        if (!this.changedMarks) return {};

        const initialBonus: IBonusInfo = this.bonuses[USER_ROLE.MEDICAL_AGENT]
            .find(x => x.month === this.previewBonusMonth);
        const agents = initialBonus
            ? (initialBonus.agents || [])
            : [];

        // const allChangedMarks: IMark[] = [...this.changedMarks.values()]
        //     .reduce((acc, curr) => ([ ...acc, ...curr.values() ]), []);
        // return allChangedMarks.reduce((acc, { drugId, payments, deposit }) => {
        //     const
        // //     // return (drugId in acc)
        // //     //     ? { ...acc, [drugId]: acc[drugId] + payments + deposit }
        // //     //     : { ...acc, [drugId]: payments + deposit }
        // }, {});
        // console.log('bonuses: ',toJS(this.bonuses));
        // console.log('actual bonus: ', toJS(initialBonus));
        // console.log('initial agents: ', toJS(agents));
        const res = [...this.changedMarks.entries()]
            .reduce((acc, [agentId, agentMarks]) => {
                const initialAgent = agents.find(x => x.id === agentId);

                agentMarks.forEach((changedMark) => {
                    const { drugId, payments, deposit } = changedMark;

                    const initialMark = initialAgent
                        ? initialAgent.marks.get(drugId)
                        : null;

                    const newDrugValue = initialMark
                        ? (acc[drugId] || 0)
                            + (payments - initialMark.payments)
                            + (deposit - initialMark.deposit)
                        : (acc[drugId] || 0) + payments + deposit;

                    acc[drugId] = newDrugValue;
                });

                return acc;
            }, {});

        return res;
    }

    @action.bound
    setDivisionValidity(value: boolean) {
        this.isMedsDivisionValid = value;
    }

    @action.bound
    loadBonusesExcel(mode: 'payment' | 'deposit', dateFrom: Date, dateTo: Date, loadPack: boolean) {
        const { api, departmentsStore: { currentDepartmentId } } = this.rootStore;

        const userId = this.previewUser
            ? this.previewUser.id
            : null;

        const urls: any = {
            [USER_ROLE.FIELD_FORCE_MANAGER]: {
                payment: `/api/branch/${currentDepartmentId}/ffm/payment`,
                deposit: `/api/branch/${currentDepartmentId}/ffm/deposit`
            },
            [USER_ROLE.REGIONAL_MANAGER]: {
                payment: `api/branch/${currentDepartmentId}/rm/${userId}/payment`,
                deposit: `api/branch/${currentDepartmentId}/rm/${userId}/deposit`
            },
        };

        const monthFrom = dateFrom.getMonth() + 1;
        const monthTo = dateTo.getMonth() + 1;

        const dateFromString = format(dateFrom, `yyyy-'${monthFrom}'-dd`);
        const dateToString = format(dateTo, `yyyy-'${monthTo}'-dd`);

        let url = urls[this.role]
            ? `${urls[this.role][mode]}?from=${dateFromString}&to=${dateToString}`
            : null;
        url += loadPack ? '&pack=1' : '';
        if (userId === null || !url) return;
        console.log(url);
        api.getExcel(url);
    }

    @action.bound
    addDocsToBonus(docs: IDoctor[], targetBonus: IBonusInfo) {
        const preparedDocs: IAgentInfo[] = docs.map(({ id, deposit }) => ({
            id,
            deposit,
            lastPayment: 0,
            lastDeposit: 0,
            marks: new Map(),
        }));

        if (targetBonus) {
            targetBonus.agents.push(...preparedDocs);
        }
    }

    @action.bound
    async createBonus(year: number, month: number): Promise<boolean> {
        const { api, departmentsStore: { currentDepartmentId } } = this.rootStore;

        const userId = this.previewUser
            ? this.previewUser.id
            : null;

        if (!userId || !currentDepartmentId) return false;

        const isCreated = await api.updateBonusesData(
            currentDepartmentId,
            userId,
            year,
            month + 1,
            {},
            false
        );

        if (isCreated) {
            // const newBonusInfo: IBonusInfo = {
            //     month: month,
            //     payments: null,
            //     deposit: null,
            //     status: false,
            //     sales: new Map(),
            //     agents: [],
            // };

            await this.loadBonuses(this.previewUser, true);
            await this.loadBonusesData(this.previewUser);

            // if (this.bonuses) this.bonuses.push(newBonusInfo);
            // else this.bonuses = [newBonusInfo];

            // this.setPreviewBonus(newBonusInfo);
            // this.setBonusesYear(year, false, true);
        }

        return isCreated;
    }

    @action.bound
    async updateBonus(bonus: IBonusInfo, sale: boolean) {
        const { api, departmentsStore: { currentDepartmentId } } = this.rootStore;

        if (this.isMedsDivisionValid === false) {
            console.log('meds division is invalid');
            return;
        }

        let id: number = null;
        if (this.previewUser && this.previewUser.position === USER_ROLE.MEDICAL_AGENT) {
            id = this.previewUser.id;
        } else {
            const mp = this.bonusUsers.find(({ position }) => position === USER_ROLE.MEDICAL_AGENT);
            id = mp ? mp.id : null;
        }

        if (!bonus || id === null || currentDepartmentId === null) return;

        const { month, agents } = bonus;

        const marks = agents.reduce((acc, curr) => {
            const {
                marks: agentMarks,
                id: agentId
            } = curr;

            const changedMarks = this.changedMarks.get(agentId);
            const mergedMarks = new Map(agentMarks.entries());

            if (changedMarks) {
                changedMarks.forEach(mark => {
                    mergedMarks.set(mark.drugId, mark);
                });
            }

            const preparedMarks = [...mergedMarks.values()].map(({
                                                                     deposit,
                                                                     drugId,
                                                                     mark,
                                                                     payments
                                                                 }) => ({
                    agent: agentId,
                    deposit: deposit,
                    drug: drugId,
                    drug_mark: mark,
                    payments: payments,
                })
            );

            return [...acc, ...preparedMarks];
        }, []);

        if (!marks.length) return;

        await this.dispatchRequest(
            api.updateBonusesData(
                currentDepartmentId,
                id,
                this.bonusesYear,
                month + 1,
                marks,
                sale
            ),
            'updateBonuses'
        );
        this.changedMarks = new Map();

        const sorted = this.bonusUsers.slice().sort((a, b) => {
            return b.position - a.position;
        });

        for (const user of sorted) {
            await this.loadBonuses(user, false);
            await this.loadBonusesData(user);
        }
        await this.loadBonuses(this.previewUser, false);
        await this.loadBonusesData(this.previewUser);
    }

    @computed
    get currentMpBonus(): IBonusInfo {
        const mpBonuses = this.bonuses[USER_ROLE.MEDICAL_AGENT];
        return mpBonuses.find(({ month }) => this.previewBonusMonth === month);
    }

    @computed
    get currentMPMarks(): { [key: number]: number } {
        if (!this.currentMpBonus) return {};
        return [...this.currentMpBonus.sales.values()]
            .reduce((total, { id, mark }) => ({ ...total, [id]: mark }), {});
    }

    @action.bound
    clearChangedMarks() {
        this.changedMarks = new Map();
    }

    @action.bound
    previewBonusChangeHandler(
        propName: 'payments' | 'deposit',
        agentInfo: IAgentInfo,
        medId: number,
        value: number
    ) {
        if (!agentInfo) return;

        const { marks, id } = agentInfo;

        let initialMark: IMark;
        if (this.changedMarks.has(id) && this.changedMarks.get(id).has(medId)) {
            initialMark = this.changedMarks.get(id).get(medId);
        } else if (marks.has(medId)) {
            // initialMark = { ...marks.get(medId), deposit: 0, payments: 0};
            initialMark = marks.get(medId);
        } else {
            initialMark = {
                deposit: 0,
                payments: 0,
                drugId: medId,
                mark: this.currentMPMarks[medId] || 0
            };
        }

        const newMark = { ...initialMark, [propName]: value };

        if (this.changedMarks.has(agentInfo.id)) {
            const target = this.changedMarks.get(agentInfo.id);
            target.set(medId, newMark);
        } else {
            this.changedMarks.set(agentInfo.id, new Map([[medId, newMark]]));
        }
    }

    @action.bound
    async setBonusesYear(
        value: number,
        // shouldPostData: boolean,
        loadBonuses: boolean
    ) {
        // if (shouldPostData) this.updateBonuses();
        this.bonusesYear = value;
        this.bonusUsers = [];
        this.clearPreviewBonusTotal();
        this.bonuses = {
            [USER_ROLE.FIELD_FORCE_MANAGER]: [],
            [USER_ROLE.REGIONAL_MANAGER]: [],
            [USER_ROLE.MEDICAL_AGENT]: [],
        };
        await this.loadBonuses(this.previewUser);
        this.loadBonusesData(this.previewUser);
        // if (loadBonuses) this.loadBonuses(this.previewUser);
    }

    @action.bound
    setPreviewBonusTotal(packs: IMarkFraction, marks: IMarkFraction) {
        this.previewBonusTotal = {
            packs,
            marks
        };
    }

    @action.bound
    clearPreviewBonusTotal() {
        this.previewBonusTotal = null;
    }

    @action.bound
    setPreviewBonusMonth = (month: number) => {
        this.previewBonusMonth = month;
        this.bonusUsers = [];
    }

    @action.bound
    async loadSpecifiedUserBonuses(user: IUserLikeObject) {
        const { api, departmentsStore: { currentDepartmentId } } = this.rootStore;
        return api.getBonusInfo(
            currentDepartmentId,
            this.bonusesYear,
            user
        );
    }

    @action.bound
    addBonusUser(user: IUserLikeObject) {
        if (this.bonusUsers.includes(user)) return;
        runInAction(() => {
            const toDelete = this.bonusUsers.filter(({ position }) => user.position <= position);
            const filtered = this.bonusUsers.filter(({ id }) => !toDelete.some(x => x.id === id));
            const newArray = [...filtered, user].sort((a, b) => b.position - a.position);
            this.bonusUsers = newArray;
        });
    }

    @action.bound
    removeBonusUser(user: IUserLikeObject) {
        const ind = this.bonusUsers.indexOf(user);
        if (ind === -1) return;
        runInAction(() => {
            const toDelete = this.bonusUsers.filter(({ position, id }) => user.position <= position || id === user.id);
            const filtered = this.bonusUsers.filter(({ id }) => !toDelete.some(x => x.id === id));
            this.bonusUsers = filtered.sort((a, b) => b.position - a.position);
        });
    }

    @action.bound
    async loadBonuses(user: IUserLikeObject, clear: boolean = true) {
        const userPosition = user
            ? user.position
            : null;
        if (!userPosition) return;
        if (clear === true) this.bonuses[userPosition] = [];

        const userBonuses = await this.dispatchRequest(
            this.loadSpecifiedUserBonuses(user),
            'loadBonuses'
        );
        this.bonuses[userPosition] = userBonuses || [];
        if (!userBonuses || !userBonuses.length) return;

        const targetBonuses = this.bonuses[this.role] || [];
        const includesPreviewMonth = targetBonuses.some(x => x.month === this.previewBonusMonth);

        if (!includesPreviewMonth) {
            const newMonth = targetBonuses.length
                ? targetBonuses[targetBonuses.length - 1].month
                : null;
            this.setPreviewBonusMonth(newMonth);
        }
    }

    @action.bound
    async loadBonusesData(user: IUserLikeObject) {
        const { api, departmentsStore: { currentDepartmentId } } = this.rootStore;
        if (!currentDepartmentId || !this.previewUser) return;

        const initialBonus = this.bonuses[user.position]
            && this.bonuses[user.position].find(({ month }) => month === this.previewBonusMonth);
        const res = await this.dispatchRequest(
            api.getBonusesData(
                currentDepartmentId,
                user,
                this.bonusesYear,
                this.previewBonusMonth + 1
            ),
            'loadBonusesData'
        );

        const targetBonus = this.bonuses[user.position]
            && this.bonuses[user.position].find(({ month }) => month === this.previewBonusMonth);

        const dataIsRelevant = !!initialBonus && !!targetBonus && initialBonus === targetBonus;

        if (!res || !dataIsRelevant) return;
        if (targetBonus) {
            runInAction(() => {
                targetBonus.agents = res.agents;
                targetBonus.sales = res.sales;
            });
        }
    }

    @action.bound
    async reviewNotifications() {
        const { api } = this.rootStore;
        const reviewed = await api.reviewNotifications();

        if (!reviewed) return;

        this.notificationsCount = 0;
        this.notifications.forEach(x => {
            x.isNew = false;
        });
    }

    @action.bound
    async loadNotifications() {
        const requestName = 'loadNotifications';
        const { api } = this.rootStore;
        const res = await this.dispatchRequest(
            api.getNotifications(),
            requestName
        );
        const responesExist = res && Array.isArray(res);
        if (!responesExist) return;

        const prevUsers: IUser[] = this.notifications
            .map(({ user }) => typeof user === 'object' ? user : null)
            .filter(user => !!user);

        this.notifications = res.map(notification => {
            const user = prevUsers.find(({ id }) => id === notification.user);

            return user
                ? { ...notification, user }
                : notification;
        });
    }

    @action.bound
    async loadNotificationsUsers() {
        const { api } = this.rootStore;
        const usersToFetch = this.notifications
            .map(({ user }) => (typeof user === 'number' ? user : 0))
            .filter(x => !!x);

        const uniqUsers = uniq(usersToFetch);

        if (!uniqUsers.length) return;

        const promises = uniqUsers.map(id => api.getUser(id));
        const users = await Promise.all(promises);

        users.forEach(fetchedUser => {
            if (!fetchedUser) return;

            for (const notification of this.notifications) {
                if (notification.user === fetchedUser.id) {
                    notification.user = fetchedUser;
                }
            }
        });
    }

    @action.bound
    async loadUserSalarySettings() {
        const { api } = this.rootStore;
        this.salarySettings = await api.getSalarySettings();
    }

    @action.bound
    async submitSalaryChanges({ id }: IUser): Promise<boolean | null> {
        const requestName = 'updateSalary';
        const { api, departmentsStore: { currentDepartmentId } } = this.rootStore;
        const preparedObject = this.getPreparedSalarySettings();

        if (preparedObject === null) return null;

        return await this.dispatchRequest(
            api.updateSalarySettings(currentDepartmentId, preparedObject, id),
            requestName
        );
    }

    @action.bound
    async submitCommonSettingsChanges(settings: ISalarySettings): Promise<boolean> {
        const requestName = 'submitCommonSettingsChanges';
        const { api } = this.rootStore;

        return await this.dispatchRequest(
            api.updateCommonSettings(settings),
            requestName
        );
    }

    @action.bound
    changeMedSalary(level: number, medId: number, propName: keyof IMedSalary, value: number) {
        try {
            this.userSalary.get(level).meds[medId][propName] = value;
        } catch {
            return;
        }
    }

    @action.bound
    changeUserSalary(level: number, propName: keyof Omit<ISalaryInfo, 'meds'>, value: number) {
        try {
            this.userSalary.get(level)[propName] = value;
        } catch {
            return;
        }
    }

    @action.bound
    historyPush(newUser: IUser) {
        this.navHistory.push(newUser);
    }

    @action.bound
    historyReplace(users: IUser[]) {
        this.navHistory = users;
    }

    @action.bound
    historyGoTo(userId: number) {
        const userIndex = this.navHistory.findIndex(({ id }) => id === userId);
        this.navHistory = this.navHistory.filter((_, i) => i <= userIndex);
    }

    @action.bound
    clearUserSalaryInfo() {
        this.userSalary = new Map();
        this.userSales = null;
    }

    @action.bound
    async loadNotificationsCount() {
        const { api } = this.rootStore;
        this.notificationsCount = await this.dispatchRequest(
            api.getNotificationsCount(),
            'loadNotificationsCount'
        );

        if (!this.notificationsUpdateInterval) {
            this.notificationsUpdateInterval = setInterval(
                this.loadNotificationsCount,
                30_000
            );
        }
    }

    @action.bound
    async loadUserSalaryInfo({ id }: IUser, year: number, month: number) {
        const requestName = 'loadUserSalaryInfo';
        const { api, departmentsStore: { currentDepartmentId } } = this.rootStore;
        const time = `?year=${year}&month=${month}`;
        if (!currentDepartmentId || !id) return;

        const res = await this.dispatchRequest(
            api.getUserSalary(currentDepartmentId, id, time),
            requestName
        );

        if (res) {
            const { levels, sales } = res;
            this.userSalary = new Map(levels);
            this.userSales = sales;
        }
    }

    @action.bound
    async historyPushUser(agentInfo: IUserCommonInfo, role?: USER_ROLE) {
        const position = role || this.getNextRole();
        this.navHistory.push({ ...defaultUser, ...agentInfo, position });
        const res = await this.rootStore.api.getUser(agentInfo.id);
        if (!res) return;

        const agent = this.navHistory.find(({ id }) => id === res.id);
        if (agent) {
            for (const prop in res) {
                const agentValue = agent[prop];
                const newValue = res[prop];
                if (agentValue !== newValue && newValue) {
                    agent[prop] = newValue;
                }
            }
        }
    }

    @action.bound
    async getUser(userId: number) {
        return this.rootStore.api.getUser(userId);
    }

    @action.bound
    async renewHistory(ffm?: IUser) {
        this.clearHistory();
        this.historyPushUser(ffm, USER_ROLE.FIELD_FORCE_MANAGER);
    }

    @action.bound
    clearHistory() {
        this.navHistory = [];
    }

    @action.bound
    async loadUserProfile() {
        const requestName = 'loadUserProfile';
        const {
            api,
            departmentsStore: {
                loadPositions,
                loadDepartments,
                setCurrentDepartment,
                loadFFMs,
                loadLocations
            }
        } = this.rootStore;

        this.setLoading(requestName);
        const user = await api.getUser();

        if (!user) {
            this.setError(requestName);
            return false;
        }

        await Promise.all([
            loadPositions(),
            loadDepartments(),
            loadLocations(),
            this.loadNotificationsCount(),
            this.loadUserSalarySettings()
        ]);

        if (singleDepartmentRoles.includes(user.position)) {
            setCurrentDepartment(user.department);
            this.navHistory.push(user);
        } else if (multiDepartmentRoles.includes(user.position)) {
            loadFFMs();
        }

        this.user = user;
        this.setSuccess(requestName);
        return true;
    }

    @action.bound
    logout() {
        const requestName = 'logout';
        const {
            api,
            departmentsStore: { resetStore: resetDepartmentsStore },
            salesStore: { resetStore: resetSalesStore }
        } = this.rootStore;

        this.dispatchRequest(api.logout(), requestName);
        this.user = null;
        this.navHistory = [];
        this.notificationsCount = 0;
        this.notifications = [];
        this.asyncStatusMap = new Map();
        this.requestParams = new Map();
        this.bonuses = {
            [USER_ROLE.FIELD_FORCE_MANAGER]: [],
            [USER_ROLE.REGIONAL_MANAGER]: [],
            [USER_ROLE.MEDICAL_AGENT]: [],
        };
        this.previewBonusMonth = null;
        window.clearInterval(this.notificationsUpdateInterval);
        this.notificationsUpdateInterval = null;
        resetDepartmentsStore();
        resetSalesStore();
    }

    @action.bound
    async login(credentials: IUserCredentials): Promise<boolean> {
        const requestName = 'login';
        const { api } = this.rootStore;

        this.setLoading(requestName);
        const loggedIn: boolean = await api.login(credentials);

        if (loggedIn) {
            const userFetched = await this.loadUserProfile();

            const callback = userFetched
                ? this.setSuccess
                : this.setError;
            callback(requestName);

            return userFetched;
        } else {
            this.setError(requestName);
            return false;
        }
    }

    private getNextRole(): USER_ROLE {
        switch (this.role) {
            case USER_ROLE.FIELD_FORCE_MANAGER:
                return USER_ROLE.REGIONAL_MANAGER;
            case USER_ROLE.REGIONAL_MANAGER:
                return USER_ROLE.MEDICAL_AGENT;
            default:
                return USER_ROLE.UNKNOWN;
        }
    }

    private getPreparedSalarySettings(): any {
        let levelName: string;
        if (this.role === USER_ROLE.REGIONAL_MANAGER) levelName = 'РМ';
        if (this.role === USER_ROLE.MEDICAL_AGENT) levelName = 'МП';

        if (!levelName) return null;

        const res: any = {};
        this.userSalary.forEach((salaryInfo, num) => {
            const {
                extraCosts,
                kpi,
                meds,
                salary
            } = salaryInfo;

            const drugs = Object.entries(meds || {}).map(([drug, drugData]) => {
                const { amount, bonus, price } = drugData;
                return {
                    drug,
                    amount,
                    bonus,
                    price
                };
            });

            const dataObject: any = {
                drugs,
                salary: salary || 0,
                kpi: kpi || 0,
                add_costs: extraCosts || 0,
            };

            res[`${levelName}${num}`] = dataObject;
        });

        return res;
    }

    @action.bound
    loadDepositHistory(): Promise<IDeposit[]> {
        const requestName = 'loadDepositHistory';
        const {
            api,
            departmentsStore: {
                currentDepartment
            },
            uiStore: {
                modalPayload: doctor
            }
        } = this.rootStore;

        return this.dispatchRequest(
            api.getDepositHistory(
                currentDepartment.id,
                this.previewUser.id,
                doctor.id
            ),
            requestName
        );
    }

    @action.bound
    insertDeposit(docId: number, { deposit, message }: IDepositFormValue): Promise<boolean> {
        const { api, departmentsStore: { currentDepartmentId } } = this.rootStore;

        const mpId = (this.previewUser && this.previewUser.position === USER_ROLE.MEDICAL_AGENT)
            ? this.previewUser.id
            : null;

        const preparedData = {
            message,
            deposit: +deposit
        };

        return this.dispatchRequest(
            api.postDeposit(
                currentDepartmentId,
                mpId,
                docId,
                preparedData
            ),
            'insertDeposit'
        );
    }

    @action.bound
    removeBonusAgent(agentId: number, parentId: number): Promise<boolean> {
        const { api, departmentsStore: { currentDepartmentId } } = this.rootStore;

        return this.dispatchRequest(
            api.removeAgent(
                currentDepartmentId,
                parentId,
                agentId,
                this.bonusesYear,
                this.previewBonusMonth + 1
            ),
            'removeAgent');
    }
}
