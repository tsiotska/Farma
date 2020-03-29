import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { IMedicine } from '../../../interfaces/IMedicine';
import TableRow from '../TableRow';
import { ISalesStat, IMedSalesInfo } from '../../../interfaces/ISalesStat';
import { IUserCommonInfo } from '../../../interfaces/IUser';
import { ILocation } from '../../../interfaces/ILocation';

interface IProps {
    meds: Map<number, IMedicine>;
    salesStat: ISalesStat[];
    displayStatuses: Map<number, boolean>;
    labelData: Map<number, ILocation | IUserCommonInfo>;
    targetProp: 'money' | 'amount';
    mantisLength: number;
    rowPrepend: any;
    scrollBarWidth: number;
}

@observer
class Body extends Component<IProps> {
    get medsIds(): number[] {
        return [...this.props.meds.keys()]
        .filter(x => this.props.displayStatuses.get(x) === true);
    }

    getDataObject = (stat: IMedSalesInfo[]): any => stat.reduce(
        (total, { medId, [this.props.targetProp]: value}) => ({ ...total, [medId]: value}),
        {}
    )

    endAddornment = (data: number[]) => data.reduce(
            (total, current) => total + current,
            0
        ).toFixed(this.props.mantisLength)

    render() {
        const { salesStat, labelData, scrollBarWidth, rowPrepend: PrependComponent } = this.props;

        return salesStat.map(stat => (
            <TableRow
                key={stat.id}
                scrollBarWidth={scrollBarWidth}
                medsIds={this.medsIds}
                data={this.getDataObject(stat.stat)}
                mantisLength={this.props.mantisLength}
                rowEndAddornment={this.endAddornment}
                rowStartAddornment={
                    <PrependComponent
                        label={labelData.get(stat.id)}
                    />
                }
            />
        ));
    }
}

export default Body;
