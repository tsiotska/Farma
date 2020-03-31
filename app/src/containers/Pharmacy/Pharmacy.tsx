import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Typography, Button } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IAsyncStatus } from '../../stores/AsyncStore';
import UncommitedPharmacies from './UncommitedPharmacies';
import PharmaciesList from './PharmaciesList';

const styles = (theme: any) => createStyles({
    root: {
        padding: '0 20px'
    },
});

interface IProps extends WithStyles<typeof styles> {
    getAsyncStatus?: (key: string) => IAsyncStatus;
    loadPharmacies?: (isInitial: boolean) => void;
}

@inject(({
    appState: {
        departmentsStore: {
            getAsyncStatus,
            loadPharmacies
        }
    }
}) => ({
    getAsyncStatus,
    loadPharmacies
}))
@observer
class Pharmacy extends Component<IProps> {
    componentDidMount() {
        const { getAsyncStatus, loadPharmacies } = this.props;
        const { loading, success } = getAsyncStatus('loadPharmacies');
        const shouldLoadPharmacies = loading === false && success === false;
        if (shouldLoadPharmacies) loadPharmacies(true);
    }

    render() {
        const { classes } = this.props;

        return (
            <Grid direction='column' className={classes.root} container>
                <UncommitedPharmacies />
                <Grid justify='space-between' alignItems='center' container>
                    <Typography>
                        Аптеки
                    </Typography>
                    <Button>
                        Додати Аптеку
                    </Button>
                </Grid>
                <PharmaciesList />
            </Grid>
        );
    }
}

export default withStyles(styles)(Pharmacy);
