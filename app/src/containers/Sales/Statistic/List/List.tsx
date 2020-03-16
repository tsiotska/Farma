import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { ISalesStat } from '../../../../interfaces/ISalesStat';
import { IMedicine } from '../../../../interfaces/IMedicine';
import { DisplayMode } from '../../../../stores/SalesStore';
import ListItem from '../ListItem';

interface IProps {
    salesStat: ISalesStat[];
    meds?: Map<number, IMedicine>;
    displayMode?: DisplayMode;
    medsDisplayStatus?: Map<number, boolean>;
}

@inject(({
    appState: {
        departmentsStore: {
            meds
        },
        salesStore: {
            displayMode,
            medsDisplayStatus
        }
    }
}) => ({
    displayMode,
    meds,
    medsDisplayStatus
}))
@observer
class List extends Component<IProps> {
    render() {
        const {
            salesStat,
            meds,
            displayMode,
            medsDisplayStatus
        } = this.props;

        if (!salesStat || !meds) return null;

        return (
            <Grid alignItems='center' wrap='nowrap' direction='column' container>
                {
                    salesStat.map(stat => (
                        <ListItem
                            key={stat.medId}
                            stat={stat}
                            medicament={meds.get(stat.medId)}
                            displayMode={displayMode}
                            displayed={medsDisplayStatus.get(stat.medId) || false}
                        />
                    ))
                }
            </Grid>
        );
    }
}

export default List;
