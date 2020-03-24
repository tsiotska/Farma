import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { IMedicine } from '../../../interfaces/IMedicine';
import { USER_ROLE } from '../../../constants/Roles';
import { ISalesStat } from '../../../interfaces/ISalesStat';

interface IProps {
    role?: USER_ROLE;
    localeSalesStat?: ISalesStat[];
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
