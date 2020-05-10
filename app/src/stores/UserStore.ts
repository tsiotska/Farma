import { IDoctor } from './../interfaces/IDoctor';
import { IBonusInfo, IAgentInfo, IMark } from './../interfaces/IBonusInfo';
import { computed, action, observable, toJS } from 'mobx';

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

    @observable bonuses: IBonusInfo[] = null;
    @observable previewBonus: IBonusInfo = null;
    @observable previewBonusTotal: ITotalMarks = null;
    @observable bonusesYear: number = new Date().getFullYear();

    notificationsUpdateInterval: any = null;

    constructor(rootStore: IRootStore) {
        super();
        this.rootStore = rootStore;
        this.loadUserProfile();
    }

    @computed
    get userPermissions(): PERMISSIONS[] {
        const { departmentsStore: { positions }} = this.rootStore;

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
    get filteredMeds(): IMedicine[] {
        const { departmentsStore: { currentDepartmentMeds } } = this.rootStore;
        if (!this.previewBonus) return [];
        const { sales } = this.previewBonus;
        return currentDepartmentMeds.filter(x => sales.has(x.id));
    }

    @action.bound
    loadBonusesExcel(mode: 'payment' | 'deposit', dateFrom: Date, dateTo: Date) {
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

        const url = urls[this.role]
            ? `${urls[this.role][mode]}?from=${dateFromString}&to=${dateToString}`
            : null;

        if (userId === null || !url) return;

        api.getExcel(url);
    }

    @action.bound
    addDocsToBonus(docs: IDoctor[]) {
        const preparedDocs: IAgentInfo[] = docs.map(({ id, deposit }) => ({
            id,
            deposit,
            lastPayment: 0,
            lastDeposit: 0,
            marks: new Map(),
        }));

        this.previewBonus.agents.push(...preparedDocs);
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
            {}
        );

        if (isCreated) {
            const newBonusInfo: IBonusInfo = {
                month: month,
                payments: null,
                deposit: null,
                status: false,
                sales: new Map(),
                agents: [],
            };

            if (this.bonuses) this.bonuses.push(newBonusInfo);
            else this.bonuses = [newBonusInfo];

            this.setPreviewBonus(newBonusInfo);
            this.setBonusesYear(year, false, true);
        }

        return isCreated;
    }

    @action.bound
    updateBonuses() {
        const { api, departmentsStore: { currentDepartmentId } } = this.rootStore;

        const id = this.previewUser
            ? this.previewUser.id
            : null;

        if (!this.previewBonus || id === null || currentDepartmentId === null) return;

        const { month, agents } = this.previewBonus;

        const marks = agents.reduce((acc, curr) => {
            const { marks: agentMarks, id: agent } = curr;
            const preparedMarks = [...agentMarks.values()].map(({
                    deposit,
                    drugId,
                    mark,
                    payments
                }) => ({
                    agent,
                    drug: drugId,
                    payments: payments,
                    deposit: deposit,
                    drug_mark: mark,
                })
            );
            return [...acc, ...preparedMarks];
        }, []);

        if (!marks.length) return;

        const data: any = {
            marks,
            deposit: this.previewBonusTotal.marks.deposit,
            payments: this.previewBonusTotal.marks.payments
        };

        this.dispatchRequest(
            api.updateBonusesData(
                currentDepartmentId,
                id,
                this.bonusesYear,
                month,
                data
            ),
            'updateBonuses'
        );
    }

    @action.bound
    previewBonusChangeHandler(propName: 'payments' | 'deposit', agent: IAgentInfo, medId: number, value: number) {
        const { sales } = this.previewBonus;
        const { marks } = agent;

        const salesObj = sales.get(medId);

        const mark = salesObj
            ? salesObj.mark
            : null;

        const targetMark = marks.get(medId);
        if (targetMark) {
            targetMark[propName] = value;
        } else {
            const newMark: IMark = {
                deposit: propName === 'deposit' ? value : 0,
                payments: propName === 'payments' ? value : 0,
                drugId: medId,
                mark,
            };
            marks.set(medId, newMark);
        }
    }

    @action.bound
    setBonusesYear(value: number, shouldPostData: boolean, loadBonuses: boolean) {
        if (shouldPostData) this.updateBonuses();
        this.bonusesYear = value;
        this.clearPreviewBonusTotal();
        if (loadBonuses) this.loadBonuses();
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
    setPreviewBonus = (bonusInfo: IBonusInfo) => {
        const shouldLoadData = bonusInfo !== this.previewBonus;
        this.previewBonus = bonusInfo;
        if (shouldLoadData && !!this.previewBonus) {
            this.loadBonusesData();
        }
    }

    @action.bound
    async loadBonuses() {
        const { api, departmentsStore: { currentDepartmentId } } = this.rootStore;

        this.bonuses = await this.dispatchRequest(
            api.getBonusInfo(currentDepartmentId, this.bonusesYear, this.previewUser),
            'loadBonuses'
        );

        if (this.bonuses && this.bonuses.length) {
            const currentPreviewBonusMonth = this.previewBonus
                ? this.previewBonus.month
                : null;
            const updatedBonus = currentPreviewBonusMonth
                ? this.bonuses.find(({ month }) => month === currentPreviewBonusMonth)
                : null;
            const itemToSet = updatedBonus || this.bonuses[this.bonuses.length - 1];
            this.setPreviewBonus(itemToSet);
        } else {
            this.setPreviewBonus(null);
        }
    }

    @action.bound
    async loadBonusesData() {
        const { api, departmentsStore: { currentDepartmentId } } = this.rootStore;

        if (!currentDepartmentId || !this.previewUser) return;

        const bonusMonth = this.previewBonus.month;

        const request = api.getBonusesData(
            currentDepartmentId,
            this.previewUser,
            this.bonusesYear,
            this.previewBonus.month
        );

        const res = await this.dispatchRequest(
            request,
            'loadBonusesData'
        );

        const currentBonusMonth = this.previewBonus
            ? this.previewBonus.month
            : null;
        const isDataRelevant = currentBonusMonth === bonusMonth;

        if (!res || !isDataRelevant) return;

        this.previewBonus.agents = res.agents;
        this.previewBonus.sales = res.sales;
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
        this.salarySettings = await this.dispatchRequest(
            api.getSalarySettings(),
            null
        );
    }

    @action.bound
    async submitSalaryChanges(): Promise<boolean | null> {
        const requestName = 'updateSalary';
        const { api, departmentsStore: { currentDepartmentId } } = this.rootStore;
        const preparedObject = this.getPreparedSalarySettings();

        if (preparedObject === null) return null;

        return await this.dispatchRequest(
            api.updateSalarySettings(currentDepartmentId, preparedObject),
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
    async loadUserSalaryInfo({ id }: IUser) {
        const requestName = 'loadUserSalaryInfo';
        const { api, departmentsStore: { currentDepartmentId } } = this.rootStore;

        if (!currentDepartmentId || !id) return;

        const res = await this.dispatchRequest(
            api.getUserSalary(currentDepartmentId, id),
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
        this.previewBonus = null;
        this.bonuses = null;
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
}
