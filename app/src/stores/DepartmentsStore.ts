import { IPharmacyModalValues } from './../containers/Pharmacy/PharmacyModal/PharmacyModal';
import { ADD_PHARMACY_MODAL } from './../constants/Modals';
import { IValuesMap } from './../helpers/normalizers/normalizer';
import { IFormValues } from './../containers/Medicines/FormContent/FormContent';
import { observable, action, reaction, toJS, computed, when, flow, transaction } from 'mobx';
import { ILPU } from './../interfaces/ILPU';
import { IDepartment } from './../interfaces/IDepartment';
import { IRootStore } from './../interfaces/IRootStore';
import AsyncStore from './AsyncStore';
import { IDepartmentsStore } from '../interfaces/IDepartmentsStore';
import { IMedicine } from '../interfaces/IMedicine';
import { IPosition } from '../interfaces/IPosition';
import { IWorker } from '../interfaces/IWorker';
import { USER_ROLE } from '../constants/Roles';
import { ILocation } from '../interfaces/ILocation';
import { IUser } from '../interfaces/IUser';
import flattenDeep from 'lodash/flattenDeep';
import { PERMISSIONS } from '../constants/Permissions';
import { IDoctor } from '../interfaces/IDoctor';
import { IUserSalary } from '../interfaces/IUserSalary';
import { ISpecialty } from '../interfaces/ISpecialty';
import { invert } from 'lodash';
import { ILpuModalValues } from '../containers/Lpu/LpuModal/LpuModal';
import { SORT_ORDER } from './UIStore';

export interface IExpandedWorker {
    id: number;
    subworkers: IWorker[];
}

export interface ICreateDepartmentReport {
    isDepartmentCreated: boolean;
    isFFMCreated: boolean;
}

export class DepartmentsStore extends AsyncStore implements IDepartmentsStore {
    rootStore: IRootStore;

    // util data
    @observable meds: Map<number, IMedicine[]> = new Map(); // meds store
    @observable positions: Map<number, IPosition> = new Map(); // user store
    @observable oblasti: Map<number, ILocation> = new Map(); // agents store
    @observable regions: Map<number, ILocation> = new Map(); // agents store

    @observable cities: Map<number, ILocation> = new Map(); // agents store
    @observable specialties: ISpecialty[] = []; // agents store

    @observable LPUs: ILPU[] = null; // agents store
    @observable unconfirmedLPUs: ILPU[] = null; // agents store

    @observable unconfirmedPharmacies: ILPU[] = null; // agents store
    @observable pharmacies: ILPU[] = null; // agents store
    @observable pharmacyDemand: boolean = false; // agents store
    @observable loadedPharmacyUrl: string = null; // agents store

    @observable locationsAgents: Map<number, IUser> = new Map(); // agents store

    @observable departments: IDepartment[] = [];
    @observable currentDepartment: IDepartment = null;

    @observable salaries: IUserSalary[] = null; // user store
    @observable expandedSalary: IUserSalary = null; // user store

    @observable workers: IWorker[] = []; // agents store
    @observable expandedWorker: IExpandedWorker = null;  // agents store
    @observable firedWorkers: IWorker[] = []; // agents store
    @observable doctors: IDoctor[] = []; // docs store

    constructor(rootStore: IRootStore) {
        super();
        this.rootStore = rootStore;
        reaction(() => this.currentDepartment, this.departmentChangeHandler);
        reaction(() => this.pharmacyDemand, this.loadPharmacies);
    }

    private departmentChangeHandler = (newDepartment: IDepartment) => {
        const departmentId = newDepartment
        ? newDepartment.id
        : null;
        const storedMeds = this.meds.get(departmentId) || [];
        if (!storedMeds.length) this.loadMeds(departmentId);
        this.expandedWorker = null;
        this.workers = [];
        this.firedWorkers = [];
    }

    @computed
    get sortedLpus(): ILPU[] {
        const { uiStore: { LpuSortSettings }} = this.rootStore;
        if (!LpuSortSettings || !this.LPUs) return this.LPUs;

        const { order, propName } = LpuSortSettings;

        if (['name', 'oblast'].includes(propName)) {
            const callback = order === SORT_ORDER.ASCENDING
                // @ts-ignore
                ? (a: ILPU, b: ILPU) => a[propName].localeCompare(b[propName])
                // @ts-ignore
                 : (a: ILPU, b: ILPU) => b[propName].localeCompare(a[propName]);
            return this.LPUs.sort(callback);
        } else {
            return this.LPUs;
        }
    }

    @computed
    get sortedPharmacies(): ILPU[] {
        const { uiStore: { LpuSortSettings }} = this.rootStore;
        if (!LpuSortSettings || !this.pharmacies) return this.pharmacies;

        const { order, propName } = LpuSortSettings;

        if (['name', 'oblast'].includes(propName)) {
            const callback = order === SORT_ORDER.ASCENDING
                // @ts-ignore
                ? (a: ILPU, b: ILPU) => a[propName].localeCompare(b[propName])
                // @ts-ignore
                 : (a: ILPU, b: ILPU) => b[propName].localeCompare(a[propName]);
            return this.pharmacies.sort(callback);
        } else {
            return this.pharmacies;
        }
    }

    @computed
    get currentDepartmentId(): number {
        return this.currentDepartment
        ? this.currentDepartment.id
        : null;
    }

    @computed
    get currentDepartmentMeds(): IMedicine[] {
        return this.meds.get(this.currentDepartmentId) || [];
    }

    @action.bound
    resetStore() {
        this.meds = new Map();
        this.workers = [];
        this.firedWorkers = [];
        this.currentDepartment = null;
        this.cities = new Map();
        this.regions = new Map();
        this.asyncStatusMap = new Map();
        this.requestParams = new Map();
        this.clearSalaries();
    }

    @action.bound
    async loadSpecialties() {
        const { api } = this.rootStore;

        const res = await this.dispatchRequest(
            api.getSpecialties(),
            'loadSpecialties'
        );

        if (res && res.length) {
            this.specialties = res;
        }
    }

    @action.bound
    async calculateSalaries(year: number, month: number) {
        const { api } = this.rootStore;

        await when(() => !!this.currentDepartmentId);

        await api.calculateSalaries(this.currentDepartmentId, year, month);

        this.loadSalaries(year, month);
    }

    @action.bound
    async loadSalaries(year: number, month: number) {
        const { api } = this.rootStore;

        await when(() => !!this.currentDepartmentId);

        this.salaries = await this.dispatchRequest(
            api.getRMsSalaries(
                this.currentDepartmentId,
                year,
                month
            ),
            'loadSalaries'
        );

        return this.salaries && this.salaries.length;
    }

    @action.bound
    async setExpandedSalary(salary: IUserSalary, year: number, month: number) {
        const { api } = this.rootStore;

        this.expandedSalary = salary;

        if (salary === null) return;

        await when(() => !!this.currentDepartmentId);

        salary.subSalaries = await this.dispatchRequest(
            api.getMPsSalaries(
                this.currentDepartmentId,
                salary.id,
                year,
                month + 1
            ),
            'loadSubSalaries'
        );
    }

    @action.bound
    async loadSalariesExcel(year: number, month: number) {
        const { api } = this.rootStore;
        api.getExcel(`/api/branch/${this.currentDepartmentId}/ffm/salary?year=${year}&month=${month + 1}&excel=1`);
    }

    @action.bound
    clearSalaries() {
        this.salaries = null;
        this.expandedSalary = null;
    }

    @action.bound
    async loadDoctors() {
        const { api, userStore: { previewUser } } = this.rootStore;

        if (!this.currentDepartmentId || !previewUser) return;

        const { position, id } = previewUser;

        if (position !== USER_ROLE.MEDICAL_AGENT) return;

        const unconfirmed = await this.dispatchRequest(
            api.getDoctors(this.currentDepartmentId, id, true),
            'loadUnconfirmedDoctors'
        );

        if (unconfirmed) {
            unconfirmed.forEach(x => {
                x.confirmed = false;
            });
            this.doctors.push(...unconfirmed);
        }

        const res = await this.dispatchRequest(
            api.getDoctors(this.currentDepartmentId, id),
            'loadDoctors'
        );

        if (res) {
            this.doctors.push(...res);
        }
    }

    @action.bound
    clearDoctors() {
        this.doctors = [];
    }

    @action.bound
    setExpandedWorker(workerId: number | null) {
        if (workerId === null) {
            this.expandedWorker = null;
            return;
        }

        this.expandedWorker = {
            id: workerId,
            subworkers: null
        };
        window.setTimeout(
            this.loadSubworkers,
            500
        );
    }

    @action.bound
    setPharmacyDemand(value: boolean) {
        this.pharmacyDemand = value;
    }

    @action.bound
    setCurrentDepartment(department: number | string | IDepartment) {
        if (typeof department === 'string') {
            this.currentDepartment = this.departments.find(({ name }) => name === department);
        } else if (typeof department === 'number') {
            this.currentDepartment = this.departments.find(({ id }) => id === department);
        } else {
            this.currentDepartment = department;
        }
    }

    @action.bound
    async loadFFMs() {
        const requestName = 'loadFFMs';
        const { api } = this.rootStore;

        this.setLoading(requestName);
        const departmentIds = this.departments.map(({ id }) => id);
        const promises = departmentIds.map(id => api.getAgents(id, USER_ROLE.FIELD_FORCE_MANAGER));
        const requestResult = await Promise.all(promises);
        const ffms = flattenDeep(requestResult);
        this.setSuccess(requestName);
        departmentIds.forEach((depId, i) => {
            const department = this.departments.find(({ id }) => id === depId);
            if (department) {
                department.ffm = ffms[i];
            }
        });
    }

    @action.bound
    async loadUnconfirmedPharmacies() {
        const requestName = 'loadUnconfirmedPharmacies';
        const { api } = this.rootStore;
        const url = this.getPharmacyApiUrl(true);

        if (url === null || url === this.loadedPharmacyUrl) return;

        this.unconfirmedPharmacies = null;
        const res = await this.dispatchRequest(
            api.getPharmacies(url),
            requestName
        );

        if (res && url === this.getPharmacyApiUrl(true)) {
            this.unconfirmedPharmacies = res;
        }
    }

    @action.bound
    async loadPharmacies(isNeeded: boolean) {
        const requestName = 'loadPharmacies';
        const { api } = this.rootStore;
        const url = this.getPharmacyApiUrl();

        const shouldAbort = isNeeded === false ||
            url === null ||
            url === this.loadedPharmacyUrl;

        if (shouldAbort) return;

        this.pharmacies = null;
        const res = await this.dispatchRequest(
            api.getPharmacies(url),
            requestName
        );

        if (res && url === this.getPharmacyApiUrl()) {
            this.loadedPharmacyUrl = url;
            this.pharmacies = res;
        }
    }

    @action.bound
    async loadUnconfirmedLPUs() {
        const requestName = 'loadUnconfirmedLPUs';
        const { api, userStore: { previewUser } } = this.rootStore;

        if (this.currentDepartmentId === null || previewUser === null) return;

        const res = await this.dispatchRequest(
            api.getMedicalDepartments(this.currentDepartmentId, previewUser, true),
            requestName
        );

        if (res) this.unconfirmedLPUs = res;
    }

    @action.bound
    async loadLPUs() {
        const requestName = 'loadLPUs';
        const { api, userStore: { previewUser } } = this.rootStore;

        if (this.currentDepartmentId === null || previewUser === null) return;

        const res = await this.dispatchRequest(
            api.getMedicalDepartments(this.currentDepartmentId, previewUser),
            requestName
        );

        if (res) this.LPUs = res;
    }

    @action.bound
    async addLpu(data: ILpuModalValues): Promise<boolean> {
        const { api } = this.rootStore;

        const namesMap: IValuesMap = {
            name: 'name',
            type: 'hcf_type',
            oblast: 'oblast',
            city: 'city',
            address: 'address',
            phone1: 'phone1',
            phone2: 'phone2',
        };

        const payload: any = Object.entries(data)
        .reduce((acc, [propName, value ]) => {
            const newPropName = namesMap[propName];
            return newPropName
            ? { ...acc, [newPropName]: value }
            : acc;
        }, {});

        const newLpu  = await this.dispatchRequest(
            api.addLpu(payload),
            'addLpu'
        );

        if (newLpu) {
            if (this.LPUs) {
                this.LPUs.push(newLpu);
            } else {
                this.LPUs = [newLpu];
            }
        }

        return !!newLpu;
    }

    @action.bound
    async editLpu(initialLpu: ILPU, data: ILpuModalValues): Promise<boolean> {
        const { api } = this.rootStore;

        const namesMap: IValuesMap = {
            name: 'name',
            type: 'hcf_type',
            oblast: 'oblast',
            city: 'city',
            address: 'address',
            phone1: 'phone1',
            phone2: 'phone2',
        };

        const payload: any = Object.entries(data)
        .reduce((acc, [propName, value ]) => {
            const newPropName = namesMap[propName];
            return newPropName
            ? { ...acc, [newPropName]: value }
            : acc;
        }, {});

        const isLpuEdited  = await this.dispatchRequest(
            api.editLpu(initialLpu.id, payload),
            'editLpu'
        );

        if (isLpuEdited) {
            Object.entries(data).forEach(([ propName, value ]) => {
                initialLpu[propName] = value;
            });
        }

        return isLpuEdited;
    }

    @action.bound
    async deleteLpu(lpu: ILPU) {
        const { api } = this.rootStore;
        const isDeleted = await api.deleteLpu(lpu.id);

        if (isDeleted) {
            const index = this.LPUs.indexOf(lpu);
            if (index !== -1) this.LPUs.splice(index, 1);
        }
    }

    @action.bound
    async addPharmacy(data: IPharmacyModalValues) {
        const { api } = this.rootStore;

        const namesMap: IValuesMap = {
            name: 'name',
            oblast: 'oblast',
            city: 'city',
            lpu: 'hcf',
            address: 'address',
            phone1: 'phone1',
            phone2: 'phone2',
            type: 'org_type',
        };

        const payload: any = Object.entries(data)
        .reduce((acc, [propName, value ]) => {
            const newPropName = namesMap[propName];
            return newPropName
            ? { ...acc, [newPropName]: value }
            : acc;
        }, {});

        const newPharmacy = await this.dispatchRequest(
            api.addPharmacy(payload),
            'addPharmacy'
        );

        if (newPharmacy) {
            if (this.pharmacies) {
                this.pharmacies.push(newPharmacy);
            } else {
                this.pharmacies = [newPharmacy];
            }
        }

        console.log('add pharmacy');
    }

    @action.bound
    async editPharmacy() {
        console.log('edit pharmacy');
    }

    @action.bound
    async deletePharmacy(lpu: ILPU) {
        const { api } = this.rootStore;
        const isDeleted = await api.deleteLpu(lpu.id);

        if (isDeleted) {
            const index = this.pharmacies.indexOf(lpu);
            if (index !== -1) this.pharmacies.splice(index, 1);
        }
    }

    @action.bound
    async loadDocsExcel() {
        const { api, userStore: { previewUser } } = this.rootStore;
        const userId = previewUser
            ? previewUser.id
            : null;

        if (!this.currentDepartmentId || !userId) return;

        api.getExcel(`/api/branch/${this.currentDepartmentId}/mp/${userId}/agent?excel=1`);
    }

    @action.bound
    async loadWorkersExcel() {
        const { api } = this.rootStore;
        const url = this.getWorkersApiUrl(false, true);
        if (!url) return;
        api.getExcel(url);
    }

    @action.bound
    async loadAdminWorkers() {
        const requestName = 'loadAdminWorkers';
        const { api } = this.rootStore;

        const res = await this.dispatchRequest(
            api.getWorkers('/api/user'),
            requestName
        );

        if (res) this.workers = res;
    }

    @action.bound
    async loadWorkers() {
        const requestName = 'loadWorkers';
        const { api } = this.rootStore;

        const url = this.getWorkersApiUrl();
        if (url === null) return;

        const res = await this.dispatchRequest(api.getWorkers(url), requestName);

        if (res) this.workers = res;
    }

    @action.bound
    resetWorkers() {
        this.workers = [];
        this.firedWorkers = [];
    }

    @action.bound
    async loadFiredWorkers() {
        const requestName = 'loadFiredWorkers';
        const { api } = this.rootStore;

        const url = this.getWorkersApiUrl(true);
        if (url === null) return;
        const res = await this.dispatchRequest(api.getWorkers(url), requestName);

        if (res) this.firedWorkers = res;
    }

    @action.bound
    async loadDepartments() {
        const requestName = 'loadDepartments';
        const { api } = this.rootStore;

        const res = await this.dispatchRequest(api.getBranches(), requestName);
        if (Array.isArray(res)) this.departments = res;
    }

    @action.bound
    async restoreMedicine(medicine: IMedicine) {
        if (!this.currentDepartmentId) return;
        const { api } = this.rootStore;

        const isRestored = await this.dispatchRequest(
            api.restoreMedicine(this.currentDepartmentId, medicine.id),
            'restoreMedicine'
        );

        medicine.deleted = !isRestored;
    }

    @action.bound
    async addMedicine(data: IFormValues, image: File) {
        const intValues = ['dosage', 'mark', 'price'];
        const namesMap: Readonly<Partial<IFormValues>> = {
            name: 'name',
            dosage: 'dosage',
            mark: 'mark',
            releaseForm: 'release_form',
            manufacturer: 'manufacturer',
            price: 'price',
            barcode: 'barcode',
        };
        const { api } = this.rootStore;

        const preparedData: any = Object.entries(data).reduce(
            (total, [ key, value ]) => {
                const newKey = namesMap[key];

                const converted = intValues.includes(key)
                ? +value
                : value;

                return (!!newKey && !!converted)
                ? { ...total, [newKey]: converted }
                : total;
            },
            {}
        );

        const payload = new FormData();
        payload.set('json', JSON.stringify(preparedData));
        payload.set('image', image || '');

        const department = +data.department || this.currentDepartmentId;

        const newMedicine = await this.dispatchRequest(
            api.addMedicine(department, data),
            'addMedicine'
        );

        if (newMedicine) {
            const targetMeds = this.meds.get(department);
            if (targetMeds) targetMeds.push(newMedicine);
        }

        return !!newMedicine;
    }

    @action.bound
    async editMedicine(medicine: IMedicine, data: IFormValues, image: File | string) {
        const intValues = ['dosage', 'mark', 'price'];
        const namesMap: Readonly<Partial<IFormValues>> = {
            name: 'name',
            dosage: 'dosage',
            mark: 'mark',
            releaseForm: 'release_form',
            manufacturer: 'manufacturer',
            price: 'price',
            barcode: 'barcode',
        };
        const { api } = this.rootStore;

        const preparedData: any = Object.entries(data).reduce(
            (total, [ key, value ]) => {
                const newKey = namesMap[key];

                const converted = intValues.includes(key)
                ? +value
                : value;

                const isChanged = medicine[key] !== converted;

                return (!!newKey && !!converted && isChanged)
                ? { ...total, [newKey]: converted }
                : total;
            },
            {}
        );

        const payload = new FormData();
        payload.set('json', JSON.stringify(preparedData));
        if (image !== medicine.image) {
            payload.set('image', image || '');
        }

        const department = +data.department || this.currentDepartmentId;

        const isUpdated = await this.dispatchRequest(
            api.editMedicine(
                department,
                medicine.id,
                payload
            ),
            'editMedicine'
        );

        if (isUpdated) {
            const invertedMap = invert(namesMap);
            Object.entries(preparedData).forEach(([ propName, value ]) => {
                const restoredPropName = invertedMap[propName];
                if (restoredPropName) {
                    medicine[restoredPropName] = value;
                }
            });
        }

        return isUpdated;
    }

    @action.bound
    async removeMeds(medId: number) {
        const { api } = this.rootStore;
        const depId = this.currentDepartmentId;
        if (!depId) return false;
        const removed =  await api.deleteDrug(depId, medId);
        if (removed) {
            const depMeds = this.meds.get(depId);
            const med = depMeds
            ? null
            : depMeds.find(({ id }) => id === medId);

            if (med) med.deleted = true;
        }
    }

    @action.bound
    async loadAllMeds() {
        const requestName = 'loadAllMeds';

        this.setLoading(requestName);
        for (const department of this.departments) {
            this.meds.set(department.id, []);
            await this.loadMeds(department.id);
        }

        this.setSuccess(requestName);
    }

    @action.bound
    async loadMeds(departmentId: number) {
        const requestName = 'loadMeds';
        const { api } = this.rootStore;

        if (departmentId === null) return;

        this.setLoading(requestName);
        const requestResult = await api.getMeds(departmentId);

        if (requestResult) {
            this.meds.set(departmentId, requestResult);
            this.setSuccess(requestName);
        } else {
            this.setError(requestName);
        }
    }

    @action.bound
    async loadPositions() {
        const requestName = 'loadPositions';
        const { api } = this.rootStore;

        const res = await this.dispatchRequest(
            api.getPositions(),
            requestName
        );

        if (res) {
            const mapped: Array<[number, IPosition]> = res.map(x => ([x.id, x]));
            this.positions = new Map(mapped);
            return;
        }
    }

    @action.bound
    loadSpecificCities(oblastName: string) {
        return this.rootStore.api.getLocations(`api/city?oblast=${oblastName}`);
    }

    @action.bound
    loadSpecificLpus(cityId: number) {
        return this.rootStore.api.getInCityLpus(this.currentDepartmentId, cityId);
    }

    @action.bound
    loadTypes(targetProp: 'hcf' | 'pharmacy') {
        return this.rootStore.api.getTypes(targetProp);
    }

    @action.bound
    async loadLocations() {
        const { api } = this.rootStore;

        const getMapped = (data: ILocation[]): Array<[number, ILocation]> =>
            data ? data.map(x => ([ x.id, x ])) : [];

        const loadCitiesPromise = api.getLocations('api/city').then(getMapped);
        const loadRegionsPromise = api.getLocations('api/region').then(getMapped);
        const loadOblastiPromise = api.getOblasti().then(getMapped);

        this.cities = new Map(await loadCitiesPromise);
        this.regions = new Map(await loadRegionsPromise);
        this.oblasti = new Map(await loadOblastiPromise);
    }

    @action.bound
    async loadSubLocationAgents() {
        const { api } = this.rootStore;
        const res = await api.getAgents(this.currentDepartmentId, USER_ROLE.MEDICAL_AGENT);

        if (!res) return;

        transaction(() => {
            res.forEach(x => {
                this.locationsAgents.set(x.id, x);
            });
        });
    }

    @action.bound
    async loadLocationsAgents() {
        const requestName = 'loadLocationsAgents';
        const { api, userStore: { role } } = this.rootStore;

        const branchId = this.currentDepartmentId;
        const userRole = role;

        let loadPositionsId: USER_ROLE;
        if (role === USER_ROLE.FIELD_FORCE_MANAGER) loadPositionsId = USER_ROLE.REGIONAL_MANAGER;
        if (role === USER_ROLE.REGIONAL_MANAGER) loadPositionsId = USER_ROLE.MEDICAL_AGENT;
        if (!branchId || !loadPositionsId) return;

        this.locationsAgents.clear();
        this.setLoading(requestName);
        const res = await api.getAgents(branchId, loadPositionsId);

        if (branchId !== this.currentDepartmentId || userRole !== this.rootStore.userStore.role) return;

        if (res) {
            const mapped: Array<[number, IUser]> = res.map(x => ([ x.id, x ]));
            this.locationsAgents = new Map(mapped);
        }

        const callback = res
        ? this.setSuccess
        : this.setError;

        callback(requestName);
    }

    @action.bound
    async loadSubworkers() {
        const requestName = 'loadSubworkers';
        const { api } = this.rootStore;

        const workerId = this.expandedWorker
        ? this.expandedWorker.id
        : null;

        if (this.currentDepartmentId === null || workerId === null) return;
        this.setLoading(requestName, this.currentDepartmentId);
        const res = await api.getWorkers(`/api/branch/${this.currentDepartmentId}/rm/${workerId}/worker`);

        const isRelevant = this.getRequestParams(requestName) === this.currentDepartmentId
        && workerId === (this.expandedWorker && this.expandedWorker.id);
        if (!isRelevant) return;

        this.expandedWorker.subworkers = res;

        const callback = res
        ? this.setSuccess
        : this.setError;

        callback(requestName);
    }

    @action.bound
    async updatePermissions(permissionsMap: Map<USER_ROLE, PERMISSIONS[]>): Promise<boolean> {
        const requestName = 'updatePermissions';
        const { api } = this.rootStore;

        if (!permissionsMap.size) return false;

        const data = [...permissionsMap.entries()]
            .map(([ id, permissions ]) => ({ permissions, id }));

        const res = await this.dispatchRequest(
            api.updatePermissions(data),
            requestName
        );

        if (res) this.loadPositions();

        return res;
    }

    @action.bound
    async createDepartment(departmentData: FormData, FFMData: FormData): Promise<ICreateDepartmentReport> {
        const { api } = this.rootStore;
        const initialReport: ICreateDepartmentReport = {
            isDepartmentCreated: false,
            isFFMCreated: false,
        };

        const createdDepartment = await api.createDepartment(departmentData);

        if (createdDepartment) initialReport.isDepartmentCreated = true;
        else return initialReport;

        const createdFFM = await api.createFFM(createdDepartment.id, FFMData);

        if (createdFFM) initialReport.isFFMCreated = true;

        const callback = createdDepartment && createdFFM
            ? async () => {
                await this.loadDepartments();
                this.loadFFMs();
            }
            : null;
        if (callback) callback();

        return initialReport;
    }

    private getPharmacyApiUrl(unconfirmed: boolean = false): string {
        const { userStore: { role, previewUser }} = this.rootStore;

        const userId = previewUser
        ? previewUser.id
        : null;

        if (this.currentDepartmentId === null || userId === null) return null;

        const queryParam = unconfirmed
        ? '?unconfirmed=1'
        : '';

        switch (role) {
            case USER_ROLE.FIELD_FORCE_MANAGER: return `/api/branch/${this.currentDepartmentId}/ffm/pharmacy${queryParam}`;
            case USER_ROLE.REGIONAL_MANAGER: return `/api/branch/${this.currentDepartmentId}/rm/${userId}/pharmacy${queryParam}`;
            case USER_ROLE.MEDICAL_AGENT: return `/api/branch/${this.currentDepartmentId}/mp/${userId}/pharmacy${queryParam}`;
            default: return null;
        }
    }

    private getWorkersApiUrl(fired: boolean = false, excel: boolean = false): string {
        const { userStore: { previewUser, role } } = this.rootStore;

        const userId = previewUser
            ? previewUser.id
            : null;

        if (userId === null || this.currentDepartmentId === null) return null;

        const urlParams: string[] = [];
        if (fired) urlParams.push('fired=1');
        if (excel) urlParams.push('excel=1');

        const queryParam = urlParams.length
            ? `?${urlParams.join('&')}`
            : '';

        switch (role) {
            case USER_ROLE.ADMIN: return `api/branch/${this.currentDepartmentId}/ffm/worker${queryParam}`;
            case USER_ROLE.FIELD_FORCE_MANAGER: return `api/branch/${this.currentDepartmentId}/ffm/worker${queryParam}`;
            case USER_ROLE.REGIONAL_MANAGER: return `api/branch/${this.currentDepartmentId}/rm/${userId}/worker${queryParam}`;
            case USER_ROLE.MEDICAL_AGENT: return `api/branch/${this.currentDepartmentId}/mp/${userId}/worker${queryParam}`;
            default: return null;
        }
    }
}
