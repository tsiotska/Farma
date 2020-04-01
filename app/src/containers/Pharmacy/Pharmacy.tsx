import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    Grid,
    Typography,
    Button
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IAsyncStatus } from '../../stores/AsyncStore';
import UncommitedPharmacies from './UncommitedPharmacies';
import HCFList from '../HCFList';
import Pagination from '../../components/Pagination';
import { ILPU } from '../../interfaces/ILPU';

const styles = (theme: any) => createStyles({
    root: {
        padding: '0 20px'
    },
    header: {
        margin: '24px 0'
    },
    pagination: {
        margin: '16px 0 60px auto'
    }
});

interface IProps extends WithStyles<typeof styles> {
    getAsyncStatus?: (key: string) => IAsyncStatus;
    loadPharmacies?: (isInitial: boolean) => void;
    pharmacies?: ILPU[];
    preparedPharmacies?: ILPU[];
    setCurrentPage?: (page: number) => void;
}

@inject(({
    appState: {
        departmentsStore: {
            getAsyncStatus,
            loadPharmacies,
            pharmacies,
            preparedPharmacies
        },
        uiStore: {
            setCurrentPage
        }
    }
}) => ({
    getAsyncStatus,
    loadPharmacies,
    pharmacies,
    preparedPharmacies,
    setCurrentPage
}))
@observer
class Pharmacy extends Component<IProps> {
    get isLoading(): boolean {
        return this.props.getAsyncStatus('loadPharmacies').loading;
    }

    componentDidMount() {
        const { getAsyncStatus, loadPharmacies } = this.props;
        const { loading, success } = getAsyncStatus('loadPharmacies');
        const shouldLoadPharmacies = loading === false && success === false;
        if (shouldLoadPharmacies) loadPharmacies(true);
    }

    componentWillUnmount() {
        this.props.setCurrentPage(0);
    }

    render() {
        const { classes, preparedPharmacies, pharmacies } = this.props;

        return (
            <Grid direction='column' className={classes.root} container>
                <UncommitedPharmacies />
                <Grid
                    className={classes.header}
                    justify='space-between'
                    alignItems='center'
                    container>
                    <Typography>
                        Аптеки
                    </Typography>
                    <Button>
                        Додати Аптеку
                    </Button>
                </Grid>
                <HCFList isLoading={this.isLoading} data={preparedPharmacies} />
                <Pagination data={pharmacies} className={classes.pagination} />
            </Grid>
        );
    }
}

export default withStyles(styles)(Pharmacy);
