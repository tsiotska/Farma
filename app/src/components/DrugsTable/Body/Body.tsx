import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { IMedicine } from '../../../interfaces/IMedicine';
import TableRow from '../TableRow';
import { DisplayMode } from '../../../stores/SalesStore';
import { IRegion } from '../../../interfaces/IRegion';
import { ISalesStat } from '../../../interfaces/ISalesStat';

interface IProps {
    meds: Map<number, IMedicine>;
    salesStat: ISalesStat[];
    displayStatuses: Map<number, boolean>;
    displayMode: DisplayMode;
    rowPrepend: any;
    // regions: Map<number, IRegion>;
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
        const {
            salesStat,
            displayMode,
            rowPrepend: PrependComponent
            // regions
        } = this.props;

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
                rowStartAddornment={<PrependComponent statItem={stat} />}
                /*
                rowStartAddornment={
                    <>
                        {
                            null
                            // regions.has(stat.id)
                            // ? regions.get(stat.id).name
                            // : null
                        }
                    </>
                }
                */
            />
        ));
    }
}

export default Body;
