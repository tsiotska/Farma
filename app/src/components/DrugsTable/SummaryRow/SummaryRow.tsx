import React, { Component } from 'react';
import { ISalesStat } from '../../../interfaces/ISalesStat';
import { IMedicine } from '../../../interfaces/IMedicine';
import { observer } from 'mobx-react';
import keyBy from 'lodash/keyBy';
import mapValues from 'lodash/mapValues';
import TableRow from '../TableRow';
import { Typography } from '@material-ui/core';

interface IProps {
    stat: ISalesStat[];
    targetProp: 'money' | 'amount';
    mantisLength: number;
    meds: Map<number, IMedicine>;
    displayStatus: Map<number, boolean>;
}

@observer
class SummaryRow extends Component<IProps> {
    get medsIds(): number[] {
        return [...this.props.meds.keys()].filter(x => this.props.displayStatus.get(x));
    }

    get data(): any {
        const { stat, targetProp } = this.props;

        if (stat === null) return {};

        const objects = stat.map(x => keyBy(x.stat, 'medId'));
        const values = objects.map(x => mapValues(x, targetProp));

        const total = this.medsIds.reduce((res, medId) => ({ ...res, [medId]: 0 }), {});

        return values.reduce(
            (res, x) => {
                for (const q in res) {
                    res[q] += q in x
                    ? x[q]
                    : 0;
                }

                return res;
            },
            total
        );
    }

    calculateTotal = (data: number[]) => data.reduce((a, b) => a + b, 0);

    render() {
        const { mantisLength } = this.props;

        return (
            <TableRow
                medsIds={this.medsIds}
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
