import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { USER_ROLE } from '../../../constants/Roles';
import { ITablePreset, FFM_PRESET, MR_PRESET, MA_PRESET } from './presets';
import DrugsTable from '../../../components/DrugsTable';
import { IAsyncStatus } from '../../../stores/AsyncStore';
import { ISalesStat } from '../../../interfaces/ISalesStat';

interface IProps {
    role?: USER_ROLE;
    getAsyncStatus?: (key: string) => IAsyncStatus;
    locationSalesStat?: ISalesStat[];
    agentSalesStat?: ISalesStat[];
}

@inject(({
    appState: {
        userStore: {
            role
        },
        salesStore: {
            getAsyncStatus,
            locationSalesStat,
            agentSalesStat
        }
    }
}) => ({
    role,
    getAsyncStatus,
    locationSalesStat,
    agentSalesStat
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

    retryClickHandler = (key: number) => () => {
        // TODO:
    }

    render() {
        if (this.tablePreset === null) return null;

        return this.tablePreset.map(({ rowPrepend, headerPrepend, title, propName }, i) => (
            <DrugsTable
                key={i}
                isLoading={this.showLoader}
                salesStat={this.props[propName]}
                onRetry={this.retryClickHandler(i)}
                title={title}
                rowPrepend={rowPrepend}
                headerPrepend={headerPrepend}
            />
        ));
    }
}

export default TableStat;
