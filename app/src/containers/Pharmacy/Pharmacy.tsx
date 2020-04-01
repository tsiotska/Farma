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
import { computed } from 'mobx';

const styles = (theme: any) => createStyles({
    root: {
        padding: '0 20px'
    },
    header: {
        margin: '24px 0'
    },
    pagination: {
        margin: '16px 0 60px auto'
    },
    retryButton: {
        margin: '10px auto'
    },
    errorText: {
        marginTop: 10,
        textAlign: 'center'
    }
});

interface IProps extends WithStyles<typeof styles> {
    loadPharmacies?: () => void;
    pharmacies?: ILPU[];

    getAsyncStatus?: (key: string) => IAsyncStatus;
    setCurrentPage?: (page: number) => void;
    currentPage?: number;
    itemsPerPage?: number;
}

@inject(({
    appState: {
        departmentsStore: {
            getAsyncStatus,
            loadPharmacies,
            pharmacies,
        },
        uiStore: {
            setCurrentPage,
            currentPage,
            itemsPerPage
        }
    }
}) => ({
    getAsyncStatus,
    loadPharmacies,
    pharmacies,
    setCurrentPage,
    currentPage,
    itemsPerPage
}))
@observer
class Pharmacy extends Component<IProps> {
    @computed
    get requestStatus(): IAsyncStatus {
        return this.props.getAsyncStatus('loadPharmacies');
    }

    @computed
    get hasNoData(): boolean {
        const { pharmacies } = this.props;
        const { loading, error, success } = this.requestStatus;
        return loading === false
            && error === false
            && success === false
            && (!pharmacies || !pharmacies.length);
    }

    @computed
    get preparedPharmacies(): ILPU[] {
        const { pharmacies, itemsPerPage, currentPage } = this.props;
        const begin = itemsPerPage * currentPage;
        return Array.isArray(pharmacies)
        ? pharmacies.filter((x, i) => (i > begin && i < begin + itemsPerPage))
        : [];
    }

    retryClickHandler = () => {
        this.props.loadPharmacies();
    }

    componentDidMount() {
        const { getAsyncStatus, loadPharmacies } = this.props;
        const { loading, success } = getAsyncStatus('loadPharmacies');
        const shouldLoadPharmacies = loading === false && success === false;
        if (shouldLoadPharmacies) loadPharmacies();
    }

    componentWillUnmount() {
        this.props.setCurrentPage(0);
    }

    render() {
        const {
            classes,
            pharmacies,
            currentPage,
            itemsPerPage,
            setCurrentPage
        } = this.props;

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
                <HCFList isLoading={this.requestStatus.loading} data={this.preparedPharmacies} />
                {
                    this.requestStatus.error &&
                    <>
                        <Typography className={classes.errorText} variant='body2'>
                            Під час виконання запиту трапилась помилка
                        </Typography>
                        <Button
                            variant='outlined'
                            onClick={this.retryClickHandler}
                            className={classes.retryButton}>
                            Повторити запит
                        </Button>
                    </>
                }
                {
                    this.hasNoData &&
                    <Typography className={classes.errorText} variant='body2'>
                        Список аптек пустий
                    </Typography>
                }
                <Pagination
                    currentPage={currentPage}
                    dataLength={pharmacies ? pharmacies.length : null}
                    itemsPerPage={itemsPerPage}
                    setCurrentPage={setCurrentPage}
                    className={classes.pagination}
                />
            </Grid>
        );
    }
}

export default withStyles(styles)(Pharmacy);
