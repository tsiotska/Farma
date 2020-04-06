import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import DrugsTable from '../../../components/DrugsTable';
import { IAsyncStatus } from '../../../stores/AsyncStore';
import { ISalesStat } from '../../../interfaces/ISalesStat';
import { IUserCommonInfo, IUser } from '../../../interfaces/IUser';
import { ILocation } from '../../../interfaces/ILocation';
import AgentTextCell from '../../../components/DrugsTable/AgentTextCell';
import HeaderCell from '../../../components/DrugsTable/HeaderCell';
import { USER_ROLE } from '../../../constants/Roles';
import { computed, toJS } from 'mobx';
import LocationTextCell from '../../../components/DrugsTable/LocationTextCell';
import { ILPU } from '../../../interfaces/ILPU';

interface IProps {
    role?: USER_ROLE;
    previewUser?: IUser;
    getAsyncStatus?: (key: string) => IAsyncStatus;
    loadLocaleSalesStat?: () => void;
    loadAgentSalesStat?: () => void;
    locationSalesStat?: ISalesStat[];
    agentSalesStat?: ISalesStat[];
    locations?: Map<number, ILocation>;
    locationsAgents?: Map<number, IUserCommonInfo>;
    pharmaciesMap?: Map<number, ILPU>;
    ignoredLocations?: Set<number>;
    ignoredAgents?: Set<number>;
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
            locationSalesStat,
            agentSalesStat,
            ignoredLocations,
            ignoredAgents,
            loadLocaleSalesStat,
            loadAgentSalesStat,
            pharmaciesMap,
            locations
        },
        departmentsStore: {
            locationsAgents
        }
    }
}) => ({
    role,
    previewUser,
    getAsyncStatus,
    locationSalesStat,
    agentSalesStat,
    locations,
    locationsAgents,
    ignoredLocations,
    ignoredAgents,
    loadLocaleSalesStat,
    loadAgentSalesStat,
    pharmaciesMap
}))
@observer
class TableStat extends Component<IProps> {
    readonly agentStatRoles: USER_ROLE[] = [
        USER_ROLE.FIELD_FORCE_MANAGER,
        USER_ROLE.REGIONAL_MANAGER
    ];
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
    get isLoading(): boolean {
        const { getAsyncStatus } = this.props;
        const s1 = getAsyncStatus('loadLocaleSalesStat');
        const s2 = getAsyncStatus('loadMedsStat');
        const s3 = getAsyncStatus('loadAgentSalesStat');
        return s1.loading || s2.loading || s3.loading;
    }

    @computed
    get showAgentStat(): boolean {
        const { role } = this.props;
        return this.agentStatRoles.includes(role);
    }

    @computed
    get locationsLabels(): Map<number, ILocation | ILPU> {
        const { role, locations, pharmaciesMap } = this.props;
        return role === USER_ROLE.MEDICAL_AGENT
        ? pharmaciesMap
        : locations;
    }

    getTitle(): string {
        const { role, locations, previewUser } = this.props;
        console.log(toJS(previewUser));
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

    render() {
        const {
            agentSalesStat,
            locationSalesStat,
            locationsAgents,
            ignoredAgents,
            ignoredLocations
        } = this.props;

        return (
            <>
                {
                    this.showAgentStat &&
                    <DrugsTable
                        isLoading={this.isLoading}
                        salesStat={agentSalesStat}
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
                    isLoading={this.isLoading}
                    salesStat={locationSalesStat}
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
