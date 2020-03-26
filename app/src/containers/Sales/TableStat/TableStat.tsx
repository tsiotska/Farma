import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { USER_ROLE } from '../../../constants/Roles';
import { ITablePreset, FFM_PRESET, MR_PRESET, MA_PRESET } from './presets';
import DrugsTable from '../../../components/DrugsTable';
import { IAsyncStatus } from '../../../stores/AsyncStore';
import { ISalesStat } from '../../../interfaces/ISalesStat';
import { IRegion } from '../../../interfaces/IRegion';
import { IUser } from '../../../interfaces';

interface IProps {
    role?: USER_ROLE;
    previewUser?: IUser;
    regions?: Map<number, IRegion>;
    getAsyncStatus?: (key: string) => IAsyncStatus;
    locationSalesStat?: ISalesStat[];
    agentSalesStat?: ISalesStat[];
    loadLocaleSalesStat?: () => void;
    loadAgentSalesStat?: () => void;
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
            loadAgentSalesStat
        }
    }
}) => ({
    role,
    previewUser,
    getAsyncStatus,
    locationSalesStat,
    agentSalesStat,
    loadLocaleSalesStat,
    loadAgentSalesStat
}))
@observer
class TableStat extends Component<IProps> {
    get tablePreset(): ITablePreset[] {
        switch (this.props.role) {
            case USER_ROLE.FIELD_FORCE_MANAGER: return FFM_PRESET;
            case USER_ROLE.REGIONAL_MANAGER: return MR_PRESET;
            case USER_ROLE.MEDICAL_AGENT: return MA_PRESET;
            default: return null;
        }
    }

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
        const { role, regions, previewUser } = this.props;

        if (role === USER_ROLE.REGIONAL_MANAGER) {
            const region = previewUser
            ? previewUser.region
            : null;

            const userRegion = regions.get(region);

            return userRegion
            ? userRegion.name
            : '';
        }

        return '';
    }

    render() {
        if (this.tablePreset === null) return null;

        return this.tablePreset.map(({ rowPrepend, headerPrepend, title, propName }, i) => (
            <DrugsTable
                key={i}
                isLoading={this.showLoader}
                salesStat={this.props[propName]}
                onRetry={this.retryClickHandler}
                title={title || this.getTitle()}
                rowPrepend={rowPrepend}
                headerPrepend={headerPrepend}
            />
        ));
    }
}

export default TableStat;
