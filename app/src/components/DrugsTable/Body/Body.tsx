import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { IMedicine } from '../../../interfaces/IMedicine';
import { ILocaleSalesStat } from '../../../interfaces/ILocaleSalesStat';
import TableRow from '../TableRow';
import { DisplayMode } from '../../../stores/SalesStore';

interface IProps {
    meds: Map<number, IMedicine>;
    salesStat: ILocaleSalesStat[];
    displayStatuses: Map<number, boolean>;
    displayMode: DisplayMode;
}

@observer
class Body extends Component<IProps> {
    get medsIds(): number[] {
        return [...this.props.meds.keys()]
        .filter(x => this.props.displayStatuses.get(x) === true);
    }

    endAddornment = (data: number[]) => data.reduce(
            (total, current) => total + current,
            0
        )

    render() {
        const { salesStat, displayMode } = this.props;

        const targetProperty = displayMode === 'currency'
        ? 'money'
        : 'amount';

        return salesStat.map(stat => (
            <TableRow
                key={stat.id}
                medsIds={this.medsIds}
                medStat={stat.stat}
                targetProperty={targetProperty}
                rowEndAddornment={this.endAddornment}
            />
        ));
    }
}

export default Body;
