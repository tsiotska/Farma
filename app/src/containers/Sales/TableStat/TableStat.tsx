import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { USER_ROLE } from '../../../constants/Roles';
import { ITablePreset, FFM_PRESET, MR_PRESET, MA_PRESET } from './presets';
import DrugsTable from '../../../components/DrugsTable';

interface IProps {
    role?: USER_ROLE;
}

@inject(({
    appState: {
        userStore: {
            role
        },
    }
}) => ({
    role,
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
    render() {

        if (this.tablePreset === null) return null;

        return this.tablePreset.map(({ rowPrepend, headerPrepend }, i) => (
            <DrugsTable
                key={i}
                rowPrepend={
                    rowPrepend === null
                    ? (): any => null
                    : rowPrepend
                }
                headerPrepend={
                    headerPrepend === null
                    ? (): any => null
                    : headerPrepend}
            />
        ));
    }
}

export default TableStat;
