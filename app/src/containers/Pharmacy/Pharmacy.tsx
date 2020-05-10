import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    Grid,
    Typography,
    Button,
    LinearProgress
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IAsyncStatus } from '../../stores/AsyncStore';
import HCFList from '../HCFList';
import Pagination from '../../components/Pagination';
import { ILPU } from '../../interfaces/ILPU';
import { computed, observable } from 'mobx';
import { ADD_PHARMACY_MODAL } from '../../constants/Modals';
import AddPharmacy from './AddPharmacy';
import EditPharmacy from './EditPharmacy';
import Snackbar from '../../components/Snackbar';
import { SNACKBAR_TYPE } from '../../constants/Snackbars';

const styles = (theme: any) => createStyles({
    root: {
        padding: '0 20px'
    },
    header: {
        margin: '0 0 24px'
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
    },
    unconfirmedList: {
        marginBottom: 20
    },
    unconfirmedText: {
        fontFamily: 'Source Sans Pro SemiBold',
        paddingBottom: 18
    }
});

interface IProps extends WithStyles<typeof styles> {
    loadPharmacies?: (isNeeded: boolean) => void;
    loadUnconfirmedPharmacies?: () => void;
    pharmacies?: ILPU[];
    unconfirmedPharmacies?: ILPU[];
    getAsyncStatus?: (key: string) => IAsyncStatus;
    setCurrentPage?: (page: number) => void;
    currentPage?: number;
    itemsPerPage?: number;
    setPharmacyDemand?: (value: boolean) => void;
    openModal?: (modalName: string) => void;
    acceptPharmacy?: (lpu: ILPU) => boolean;
}

@inject(({
    appState: {
        departmentsStore: {
            getAsyncStatus,
            loadPharmacies,
            sortedPharmacies: pharmacies,
            setPharmacyDemand,
            unconfirmedPharmacies,
            loadUnconfirmedPharmacies,
            acceptPharmacy
        },
        uiStore: {
            setCurrentPage,
            currentPage,
            itemsPerPage,
            openModal
        }
    }
}) => ({
    getAsyncStatus,
    loadPharmacies,
    pharmacies,
    setCurrentPage,
    currentPage,
    itemsPerPage,
    setPharmacyDemand,
    unconfirmedPharmacies,
    loadUnconfirmedPharmacies,
    openModal,
    acceptPharmacy
}))
@observer
class Pharmacy extends Component<IProps> {
    @observable isSnackbarOpen: boolean = false;
    @observable snackbarType: SNACKBAR_TYPE = SNACKBAR_TYPE.SUCCESS;

    @computed
    get isUnconfirmedPharmaciesLoading(): boolean {
        return this.props.getAsyncStatus('loadUnconfirmedPharmacies').loading;
    }

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
            ? pharmacies.filter((x, i) => (i >= begin && i < begin + itemsPerPage))
            : [];
    }

    retryClickHandler = () => {
        this.props.loadPharmacies(true);
    }

    snackbarCloseHandler = () => {
        this.isSnackbarOpen = false;
    }

    confirmPharmacyHandler = async (pharmacy: ILPU) => {
        const isAccepted = await this.props.acceptPharmacy(pharmacy);
        this.snackbarType = isAccepted
            ? SNACKBAR_TYPE.SUCCESS
            : SNACKBAR_TYPE.ERROR;
        this.isSnackbarOpen = true;
        return isAccepted;
    }

    addPharmacyClickHandler = () => this.props.openModal(ADD_PHARMACY_MODAL);

    componentDidMount() {
        this.props.setPharmacyDemand(true);
        this.props.loadUnconfirmedPharmacies();
    }

    componentWillUnmount() {
        this.props.setPharmacyDemand(false);
        this.props.setCurrentPage(0);
    }

    render() {
        const {
            classes,
            pharmacies,
            currentPage,
            itemsPerPage,
            setCurrentPage,
            unconfirmedPharmacies
        } = this.props;

        return (
            <Grid direction='column' className={classes.root} container>
                {
                    (Array.isArray(unconfirmedPharmacies) && unconfirmedPharmacies.length !== 0) &&
                    <Grid className={classes.unconfirmedList} direction='column' container>
                        <Typography className={classes.unconfirmedText} color='textSecondary'>
                            Додані аптеки
                        </Typography>
                        <HCFList confirmHandler={this.confirmPharmacyHandler} data={unconfirmedPharmacies} unconfirmed/>
                    </Grid>
                }
                {
                    this.isUnconfirmedPharmaciesLoading && <LinearProgress/>
                }
                <Grid
                    className={classes.header}
                    justify='space-between'
                    alignItems='center'
                    container>
                    <Typography variant='h5'>
                        Аптеки
                    </Typography>
                    <Button onClick={this.addPharmacyClickHandler}>
                        Додати Аптеку
                    </Button>
                </Grid>
                {
                    this.requestStatus.loading
                        ? <LinearProgress/>
                        : <HCFList data={this.preparedPharmacies} showHeader/>
                }
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
                <Snackbar
                    open={this.isSnackbarOpen}
                    onClose={this.snackbarCloseHandler}
                    type={this.snackbarType}
                    message={
                        this.snackbarType === SNACKBAR_TYPE.SUCCESS
                            ? 'Аптека успішно підтверджена'
                            : 'Підтвердити аптеку неможливо'
                    }
                />
                <AddPharmacy/>
                <EditPharmacy/>
            </Grid>
        );
    }
}

export default withStyles(styles)(Pharmacy);
