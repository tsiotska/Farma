import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { ILocaleSalesStat } from '../../../interfaces/ILocaleSalesStat';
import { IMedicine } from '../../../interfaces/IMedicine';
import { USER_ROLE } from '../../../constants/Roles';

interface IProps {
    role: USER_ROLE;
    localeSalesStat?: ILocaleSalesStat[];
    meds?: Map<number, IMedicine>;
    medsDisplayStatus?: Map<number, boolean>;
}

@inject(({
    appState: {
        userStore: {
            role
        },
        salesStore: {
            medsDisplayStatus,
            localeSalesStat
        },
        departmentsStore: {
            meds
        }
    }
}) => ({
    role,
    medsDisplayStatus,
    localeSalesStat,
    meds
}))
@observer
class TableStat extends Component<IProps> {
    render() {
        const {
            role,
            localeSalesStat,
            meds,
            medsDisplayStatus
        } = this.props;

        return (
            <div>qwer</div>
        );
    }
}

export default TableStat;
