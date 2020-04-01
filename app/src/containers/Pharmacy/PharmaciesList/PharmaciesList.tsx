import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles, WithStyles, createStyles, Grid, LinearProgress } from '@material-ui/core';
import { ILPU } from '../../../interfaces/ILPU';
import { toJS } from 'mobx';
import ListItem from '../ListItem';
import { IAsyncStatus } from '../../../stores/AsyncStore';

const styles = createStyles({});

interface IProps extends WithStyles<typeof styles> {
    preparedPharmacies?: ILPU[];
    getAsyncStatus?: (key: string) => IAsyncStatus;
}

@inject(({
    appState: {
        departmentsStore: {
            preparedPharmacies,
            getAsyncStatus
        }
    }
}) => ({
    preparedPharmacies,
    getAsyncStatus
}))
@observer
class PharmaciesList extends Component<IProps> {
    // TODO: pagination, sort, search
    get isLoading(): boolean {
        return this.props.getAsyncStatus('loadPharmacies').loading;
    }

    render() {
        const { preparedPharmacies } = this.props;

        return (
            <>
                { this.isLoading && <LinearProgress /> }
                <Grid direction='column' container>
                    {
                        preparedPharmacies.map(pharmacy => (
                            <ListItem key={pharmacy.id} pharmacy={pharmacy} />
                        ))
                    }
                </Grid>
            </>
        );
    }
}

export default withStyles(styles)(PharmaciesList);
