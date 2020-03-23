import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { IMedicine } from '../../../interfaces/IMedicine';
import { ILocaleSalesStat } from '../../../interfaces/ILocaleSalesStat';
import TableRow from '../TableRow';
import { DisplayMode } from '../../../stores/SalesStore';
import { IRegion } from '../../../interfaces/IRegion';
import { TableCell } from '@material-ui/core';
import { toJS } from 'mobx';

interface IProps {
    meds: Map<number, IMedicine>;
    salesStat: ILocaleSalesStat[];
    displayStatuses: Map<number, boolean>;
    displayMode: DisplayMode;
    regions: Map<number, IRegion>;
}

@observer
class Body extends Component<IProps> {
    get medsIds(): number[] {
        return [...this.props.meds.keys()]
        .filter(x => this.props.displayStatuses.get(x) === true);
    }

    endAddornment = (data: number[]) => {
        const mantisLength = this.props.displayMode === 'currency'
        ? 2
        : 0;

        return data.reduce(
            (total, current) => total + current,
            0
        ).toFixed(mantisLength);
    }

    render() {
        const { salesStat, displayMode, regions } = this.props;

        const targetProperty = displayMode === 'currency'
        ? 'money'
        : 'amount';

        return salesStat !== null && salesStat.map(stat => (
            <TableRow
                key={stat.id}
                medsIds={this.medsIds}
                medStat={stat.stat}
                targetProperty={targetProperty}
                rowEndAddornment={this.endAddornment}
                rowStartAddornment={
                    <>
                        {
                            regions.has(stat.id)
                            ? regions.get(stat.id).name
                            : null
                        }
                    </>
                }
            />
        ));
    }
}

export default Body;
