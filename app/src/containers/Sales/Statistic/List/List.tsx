import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { IMedicine } from '../../../../interfaces/IMedicine';
import { STAT_DISPLAY_MODE } from '../../../../stores/SalesStore';
import ListItem from '../ListItem';
import { IMedsSalesStat } from '../../../../interfaces/ISalesStat';
import { toJS } from 'mobx';

interface IProps {
    chartSalesStat: IMedsSalesStat[];
    meds: Map<number, IMedicine>;
    className: string;
    rootRef: any;

    displayMode?: STAT_DISPLAY_MODE;
    medsDisplayStatus?: Map<number, boolean>;
}

@inject(({
    appState: {
        salesStore: {
            displayMode,
            medsDisplayStatus
        }
    }
}) => ({
    displayMode,
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
            chartSalesStat,
            meds,
            displayMode,
            medsDisplayStatus,
            className,
            rootRef
        } = this.props;

        const usedIds: number[] = [];
        const listItemsWithStat = (chartSalesStat || []).map(stat => {
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
