import React, { Component } from 'react';
import { ISalesStat } from '../../../interfaces/ISalesStat';
import { IMedicine } from '../../../interfaces/IMedicine';
import { observer } from 'mobx-react';
import keyBy from 'lodash/keyBy';
import mapValues from 'lodash/mapValues';
import TableRow from '../TableRow';
import { Typography } from '@material-ui/core';
import { computed, toJS } from 'mobx';

interface IProps {
    stat: ISalesStat[];
    targetProp: 'money' | 'amount';
    mantisLength: number;
    meds: IMedicine[];
    ignoredMeds: number[];
    ignoredItems: Set<number>;
}

@observer
class SummaryRow extends Component<IProps> {
    @computed
    get data(): { [key: number]: number } {
        const { stat, ignoredItems, targetProp } = this.props;

        if (stat === null) return {};

        return stat.reduce(
            (total, statItem) => {
                if (ignoredItems.has(statItem.id) === false) {
                    statItem.stat.forEach(({ medId, [targetProp]: value}) => {
                        const prevValue = total[medId] || 0;
                        total[medId] = prevValue + value;
                    });
                }
                return total;
            },
            {}
        );
    }

    calculateTotal = (data: number[]) => data.reduce((a, b) => a + b, 0).toFixed(this.props.mantisLength);

    render() {
        const { mantisLength, ignoredMeds, meds } = this.props;

        return (
            <TableRow
                meds={meds}
                ignoredMeds={ignoredMeds}
                data={this.data}
                mantisLength={mantisLength}
                rowEndAddornment={this.calculateTotal}
                rowStartAddornment={
                    <Typography>
                        В суммі
                    </Typography>
                }
            />
        );
    }
}

export default SummaryRow;
