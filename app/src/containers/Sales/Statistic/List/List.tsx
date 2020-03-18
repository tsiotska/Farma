import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { ISalesStat } from '../../../../interfaces/ISalesStat';
import { IMedicine } from '../../../../interfaces/IMedicine';
import { DisplayMode } from '../../../../stores/SalesStore';
import ListItem from '../ListItem';

interface IProps {
    medsSalesStat: ISalesStat[];
    meds?: Map<number, IMedicine>;
    displayMode?: DisplayMode;
    medsDisplayStatus?: Map<number, boolean>;
    className?: string;
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
            medsSalesStat,
            meds,
            displayMode,
            medsDisplayStatus,
            className,
        } = this.props;

        if (!medsSalesStat || !meds) return null;

        return (
            <Grid
                className={className}
                alignItems='center'
                wrap='nowrap'
                direction='column'
                container>
                {
                    medsSalesStat.map(stat => (
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
