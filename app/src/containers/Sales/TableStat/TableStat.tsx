import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import DrugsTable from '../../../components/DrugsTable';
import {IAsyncStatus} from '../../../stores/AsyncStore';
import {ISalesStat} from '../../../interfaces/ISalesStat';
import {IUserCommonInfo, IUser} from '../../../interfaces/IUser';
import {ILocation} from '../../../interfaces/ILocation';
import AgentTextCell from '../../../components/DrugsTable/AgentTextCell';
import HeaderCell from '../../../components/DrugsTable/HeaderCell';
import {USER_ROLE} from '../../../constants/Roles';
import {computed, toJS} from 'mobx';
import LocationTextCell from '../../../components/DrugsTable/LocationTextCell';
import {ILPU} from '../../../interfaces/ILPU';

interface IProps {
    role?: USER_ROLE;
    previewUser?: IUser;
    sortedLocationSalesStat?: ISalesStat[];
    sortedAgentsSalesStat?: ISalesStat[];
    locations?: Map<number, ILocation>;
    locationsAgents?: Map<number, IUserCommonInfo>;
    pharmaciesMap?: Map<number, ILPU>;
    ignoredLocations?: Set<number>;
    ignoredAgents?: Set<number>;
    regions?: Map<number, ILocation>;

    getAsyncStatus?: (key: string) => IAsyncStatus;
    loadLocaleSalesStat?: () => void;
    loadAgentSalesStat?: () => void;
    loadAgentsSalesExcel?: () => void;
    loadLocationsExcel?: () => void;
}

export enum GROUP_BY {
    LOCATION,
    AGENT
}

@inject(({
             appState: {
                 userStore: {
                     role,
                     previewUser,
                 },
                 salesStore: {
                     getAsyncStatus,
                     sortedLocationSalesStat,
                     sortedAgentsSalesStat,
                     ignoredLocations,
                     ignoredAgents,
                     loadLocaleSalesStat,
                     loadAgentSalesStat,
                     pharmaciesMap,
                     locations,

                     loadAgentsSalesExcel,
                     loadLocationsExcel
                 },
                 departmentsStore: {
                     locationsAgents,
                     regions
                 }
             }
         }) => ({
    role,
    previewUser,
    getAsyncStatus,
    sortedLocationSalesStat,
    sortedAgentsSalesStat,
    locations,
    regions,
    locationsAgents,
    ignoredLocations,
    ignoredAgents,
    loadLocaleSalesStat,
    loadAgentSalesStat,
    pharmaciesMap,
    loadAgentsSalesExcel,
    loadLocationsExcel
}))
@observer
class TableStat extends Component<IProps> {
    readonly agentStatRoles: USER_ROLE[] = [
        USER_ROLE.FIELD_FORCE_MANAGER,
        USER_ROLE.REGIONAL_MANAGER
    ];
    readonly staticTableTitles: any = {
        [USER_ROLE.FIELD_FORCE_MANAGER]: {
            [GROUP_BY.AGENT]: '?????????????????????? ??????????????????',
            [GROUP_BY.LOCATION]: '??????????????',
        },
        [USER_ROLE.MEDICAL_AGENT]: {
            [GROUP_BY.LOCATION]: '????????????',
        }
    };

    @computed
    get tableTitles(): any {
        return {
            ...this.staticTableTitles,
            [USER_ROLE.REGIONAL_MANAGER]: {
                [GROUP_BY.AGENT]: '?????????????????????? ????????????????????????',
                [GROUP_BY.LOCATION]: this.getTitle(),
            }
        };
    }

    @computed
    get isLoading(): boolean {
        const {getAsyncStatus} = this.props;
        const s1 = getAsyncStatus('loadLocaleSalesStat');
        const s2 = getAsyncStatus('loadMedsStat');
        const s3 = getAsyncStatus('loadAgentSalesStat');
        return s1.loading || s2.loading || s3.loading;
    }

    @computed
    get showAgentStat(): boolean {
        const {role} = this.props;
        return this.agentStatRoles.includes(role);
    }

    @computed
    get locationsLabels(): Map<number, ILocation | ILPU> {
        const {role, locations, pharmaciesMap} = this.props;
        return role === USER_ROLE.MEDICAL_AGENT
            ? pharmaciesMap
            : locations;
    }

    getTitle(): string {
        const {role, regions, previewUser} = this.props;
        if (role === USER_ROLE.REGIONAL_MANAGER) {
            const region = previewUser
                ? previewUser.region
                : null;

            const userRegion = regions.get(region);

            return userRegion
                ? `${userRegion.name} ????????????`
                : '';
        }

        return '';
    }

    getCurrentTableTitle = (groupBy: GROUP_BY): string => {
        return this.tableTitles[this.props.role]
            ? this.tableTitles[this.props.role][groupBy]
            : '-';
    }

    retryClickHandler = () => {
        const {
            getAsyncStatus,
            loadLocaleSalesStat,
            loadAgentSalesStat
        } = this.props;

        if (getAsyncStatus('loadAgentSalesStat').error && this.showAgentStat) loadAgentSalesStat();
        if (getAsyncStatus('loadLocaleSalesStat').error) loadLocaleSalesStat();
    }

    render(): any {
        const {
            sortedAgentsSalesStat,
            sortedLocationSalesStat,
            ignoredAgents,
            ignoredLocations,
            loadAgentsSalesExcel,
            loadLocationsExcel,
            locationsAgents
        } = this.props;

        return (
            <>
                {
                    this.showAgentStat &&
                    <DrugsTable
                        excelClickHandler={loadAgentsSalesExcel}
                        isLoading={this.isLoading}
                        salesStat={sortedAgentsSalesStat}
                        labelData={locationsAgents}
                        onRetry={this.retryClickHandler}
                        ignoredItems={ignoredAgents}
                        headerPrepend={
                            <HeaderCell
                                value={this.getCurrentTableTitle(GROUP_BY.AGENT)}
                                groupBy={GROUP_BY.AGENT}
                            />
                        }
                        rowPrepend={AgentTextCell}
                    />
                }
                <DrugsTable
                    excelClickHandler={loadLocationsExcel}
                    isLoading={this.isLoading}
                    salesStat={sortedLocationSalesStat}
                    labelData={this.locationsLabels}
                    onRetry={this.retryClickHandler}
                    ignoredItems={ignoredLocations}
                    headerPrepend={
                        <HeaderCell
                            value={this.getCurrentTableTitle(GROUP_BY.LOCATION)}
                            groupBy={GROUP_BY.LOCATION}
                        />
                    }
                    rowPrepend={LocationTextCell}
                    shouldCalculateOffset
                />
            </>
        );
    }
}

export default TableStat;
