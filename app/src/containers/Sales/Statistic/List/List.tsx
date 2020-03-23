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
    rootRef: any;
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
    getNoStatListItems = (usedIds: number[]) => {
        const { meds, displayMode, medsDisplayStatus } = this.props;
        const res: any[] = [];

        meds.forEach((medicine, id) => {
            if (usedIds.includes(id)) return;

            res.push(
                <ListItem
                    key={id}
                    stat={null}
                    medicament={medicine}
                    displayMode={displayMode}
                    displayed={medsDisplayStatus.get(id) || false}
                />
            );
        });

        return res;
    }

    render() {
        const {
            medsSalesStat,
            meds,
            displayMode,
            medsDisplayStatus,
            className,
            rootRef
        } = this.props;

        if (!medsSalesStat || !meds) return null;

        const usedIds: number[] = [];
        const listItemsWithStat = medsSalesStat.map(stat => {
            usedIds.push(stat.medId);
            return <ListItem
                key={stat.medId}
                stat={stat}
                medicament={meds.get(stat.medId)}
                displayMode={displayMode}
                displayed={medsDisplayStatus.get(stat.medId) || false}
            />;
        });

        const noStatListItems = this.getNoStatListItems(usedIds);

        return (
            <Grid
                ref={rootRef}
                className={className}
                alignItems='center'
                wrap='nowrap'
                direction='column'
                container>
                    { listItemsWithStat }
                    { noStatListItems }
            </Grid>
        );
    }
}

export default List;
