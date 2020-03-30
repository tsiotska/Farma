import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { USER_ROLE } from '../../../constants/Roles';
import { ITablePreset, FFM_PRESET, MR_PRESET, MA_PRESET, GROUP_BY } from './presets';
import DrugsTable from '../../../components/DrugsTable';
import { IAsyncStatus } from '../../../stores/AsyncStore';
import { ISalesStat } from '../../../interfaces/ISalesStat';
import { ILocation } from '../../../interfaces/ILocation';
import { IUser } from '../../../interfaces';
import { IUserCommonInfo } from '../../../interfaces/IUser';
import HeaderCell from '../../../components/DrugsTable/HeaderCell';
import LocationTextCell from '../../../components/DrugsTable/LocationTextCell';
import AgentTextCell from '../../../components/DrugsTable/AgentTextCell';
import { computed } from 'mobx';

interface IProps {
    role?: USER_ROLE;
    previewUser?: IUser;
    locations?: Map<number, ILocation>;
    locationsAgents?: Map<number, IUserCommonInfo>;
    getAsyncStatus?: (key: string) => IAsyncStatus;
    locationSalesStat?: ISalesStat[];
    agentSalesStat?: ISalesStat[];
    loadLocaleSalesStat?: () => void;
    loadAgentSalesStat?: () => void;
    ignoredLocations?: Set<number>;
    ignoredAgents?: Set<number>;
}

@inject(({
    appState: {
        userStore: {
            role,
            previewUser
        },
        salesStore: {
            getAsyncStatus,
            locationSalesStat,
            agentSalesStat,
            loadLocaleSalesStat,
            loadAgentSalesStat,
            ignoredLocations,
            ignoredAgents
        },
        departmentsStore: {
            locations,
            locationsAgents
        }
    }
}) => ({
    locations,
    locationsAgents,
    role,
    previewUser,
    getAsyncStatus,
    locationSalesStat,
    agentSalesStat,
    loadLocaleSalesStat,
    loadAgentSalesStat,
    ignoredLocations,
    ignoredAgents
}))
@observer
class TableStat extends Component<IProps> {
    readonly staticTableTitles: any = {
        [USER_ROLE.FIELD_FORCE_MANAGER]: {
            [GROUP_BY.AGENT]: 'Регіональні менеджери',
            [GROUP_BY.LOCATION]: 'Регіони',
        },
        [USER_ROLE.MEDICAL_AGENT]: {
            [GROUP_BY.LOCATION]: 'ЛПУ / Аптека',
        }
    };

    @computed
    get tableTitles(): any {
        return {
            ...this.staticTableTitles,
            [USER_ROLE.REGIONAL_MANAGER]: {
                [GROUP_BY.AGENT]: 'Медицинські представники',
                [GROUP_BY.LOCATION]: this.getTitle(),
            }
        };
    }

    @computed
    get tablePreset(): ITablePreset[] {
        switch (this.props.role) {
            case USER_ROLE.FIELD_FORCE_MANAGER: return FFM_PRESET;
            case USER_ROLE.REGIONAL_MANAGER: return MR_PRESET;
            case USER_ROLE.MEDICAL_AGENT: return MA_PRESET;
            default: return [];
        }
    }

    @computed
    get showLoader(): boolean {
        const { getAsyncStatus } = this.props;
        const s1 = getAsyncStatus('loadLocaleSalesStat');
        const s2 = getAsyncStatus('loadMedsStat');
        const s3 = getAsyncStatus('loadAgentSalesStat');
        return s1.loading || s2.loading || s3.loading;
    }

    retryClickHandler = () => {
        const { getAsyncStatus, loadLocaleSalesStat, loadAgentSalesStat } = this.props;
        if (getAsyncStatus('loadAgentSalesStat').error) loadAgentSalesStat();
        if (getAsyncStatus('loadLocaleSalesStat').error) loadLocaleSalesStat();
    }

    getTitle(): string {
        const { role, locations, previewUser } = this.props;

        if (role === USER_ROLE.REGIONAL_MANAGER) {
            const region = previewUser
            ? previewUser.region
            : null;

            const userRegion = locations.get(region);

            return userRegion
            ? userRegion.name
            : '';
        }

        return '';
    }

    getSalesStat = (groupBy: GROUP_BY): ISalesStat[] => {
        const { locationSalesStat, agentSalesStat } = this.props;
        if (groupBy === GROUP_BY.AGENT) return agentSalesStat;
        if (groupBy === GROUP_BY.LOCATION) return locationSalesStat;
        return [];
    }

    getLabelData = (groupBy: GROUP_BY): Map<number, ILocation | IUserCommonInfo> => {
        const { locations, locationsAgents } = this.props;
        if (groupBy === GROUP_BY.AGENT) return locationsAgents;
        if (groupBy === GROUP_BY.LOCATION) return locations;
        return new Map();
    }

    getCurrentTableTitle = (groupBy: GROUP_BY): string => {
        return this.tableTitles[this.props.role]
        ? this.tableTitles[this.props.role][groupBy]
        : '-';
    }

    getIgnoredItems = (groupBy: GROUP_BY): Set<number> => {
        const { ignoredAgents, ignoredLocations } = this.props;

        return groupBy === GROUP_BY.AGENT
        ? ignoredAgents
        : ignoredLocations;
    }

    render() {
        return this.tablePreset.map(({ groupBy }, i) => (
            <DrugsTable
                key={i}
                isLoading={this.showLoader}
                salesStat={this.getSalesStat(groupBy)}
                onRetry={this.retryClickHandler}
                labelData={this.getLabelData(groupBy)}
                ignoredItems={this.getIgnoredItems(groupBy)}
                headerPrepend={
                    <HeaderCell
                        value={this.getCurrentTableTitle(groupBy)}
                        groupBy={groupBy}
                    />
                }
                rowPrepend={
                    groupBy === GROUP_BY.LOCATION
                    ? LocationTextCell
                    : AgentTextCell
                }
            />
        ));
    }
}

export default TableStat;
