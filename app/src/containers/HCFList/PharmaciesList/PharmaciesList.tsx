import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles, WithStyles, createStyles, Grid, LinearProgress } from '@material-ui/core';
import { ILPU } from '../../../interfaces/ILPU';
import ListItem from '../ListItem';
import { ILocation } from '../../../interfaces/ILocation';

const styles = createStyles({});

interface IProps extends WithStyles<typeof styles> {
    data: ILPU[];
    unconfirmed: boolean;
    regions?: Map<number, ILocation>;
    cities?: Map<number, ILocation>;
}

@inject(({
    appState: {
        departmentsStore: {
            regions,
            cities
        }
    }
}) => ({
    regions,
    cities
}))
@observer
class PharmaciesList extends Component<IProps> {
    // TODO: pagination, sort, search
    render() {
        const {
            data,
            unconfirmed,
            regions,
            cities
        } = this.props;

        return (
            <>
                <Grid direction='column' container>
                    {
                        data.map(pharmacy => (
                            <ListItem
                                key={pharmacy.id}
                                pharmacy={pharmacy}
                                unconfirmed={unconfirmed}
                                region={regions.get(pharmacy.region)}
                                city={cities.get(pharmacy.city)}
                            />
                        ))
                    }
                </Grid>
            </>
        );
    }
}

export default withStyles(styles)(PharmaciesList);
