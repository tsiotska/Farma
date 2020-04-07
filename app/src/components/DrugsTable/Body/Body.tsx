import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { IMedicine } from '../../../interfaces/IMedicine';
import TableRow from '../TableRow';
import { ISalesStat, IMedSalesInfo } from '../../../interfaces/ISalesStat';
import { IUserCommonInfo } from '../../../interfaces/IUser';
import { ILocation } from '../../../interfaces/ILocation';
import { computed } from 'mobx';

interface IProps {
    meds: IMedicine[];
    ignoredMeds: number[];
    salesStat: ISalesStat[];
    labelData: Map<number, ILocation | IUserCommonInfo>;
    targetProp: 'money' | 'amount';
    mantisLength: number;
    rowPrepend: any;
    scrollBarWidth: number;
    ignoredItems: Set<number>;
}

@observer
class Body extends Component<IProps> {
    getDataObject = (stat: IMedSalesInfo[]): { [key: number]: number } => stat.reduce(
        (total, { medId, [this.props.targetProp]: value}) => ({ ...total, [medId]: value}),
        {}
    )

    endAddornment = (data: number[]) => {
        const { mantisLength, ignoredMeds } = this.props;
        const res =  data.reduce((total, current, i) => (
            ignoredMeds.includes(i)
                ? total
                : total + current
            ),
            0
        );
        return res.toFixed(mantisLength);
    }

    render() {
        const {
            salesStat,
            labelData,
            ignoredItems,
            scrollBarWidth,
            ignoredMeds,
            meds,
            rowPrepend: PrependComponent
        } = this.props;

        return salesStat.map(stat => {
            const isIgnored = ignoredItems.has(stat.id);
            return (
                <TableRow
                    key={stat.id}
                    ignoredMeds={ignoredMeds}
                    scrollBarWidth={scrollBarWidth}
                    meds={meds}
                    data={this.getDataObject(stat.stat)}
                    mantisLength={this.props.mantisLength}
                    rowEndAddornment={this.endAddornment}
                    isIgnored={isIgnored}
                    rowStartAddornment={
                        <PrependComponent
                            label={labelData.get(stat.id)}
                            isIgnored={isIgnored}
                        />
                    }
                />
            );
        });
    }
}

export default Body;
