import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import ListItem from '../ListItem';
import { IMedsSalesStat } from '../../../interfaces/ISalesStat';
import { IMedicine } from '../../../interfaces/IMedicine';
import { STAT_DISPLAY_MODE } from '../../../stores/SalesStore';

interface IProps {
    chartSalesStat: IMedsSalesStat[];
    meds: IMedicine[];
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
    render() {
        const {
            className,
            rootRef,
            chartSalesStat,
            meds,
            displayMode,
            medsDisplayStatus
        } = this.props;

        return (
            <Grid
            ref={rootRef}
            className={className}
            alignItems='center'
            wrap='nowrap'
            direction='column'
            container>
                {
                    meds.map(medicine => (
                        <ListItem
                            key={medicine.id}
                            stat={(chartSalesStat || []).find(({ medId }) => medId === medicine.id)}
                            medicament={medicine}
                            displayMode={displayMode}
                            displayed={medsDisplayStatus.get(medicine.id) || false}
                        />
                    ))
                }
        </Grid>
        );
    }
}

export default List;
