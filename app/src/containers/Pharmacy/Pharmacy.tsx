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
import { computed, observable, autorun, toJS, reaction } from 'mobx';
import { ADD_PHARMACY_MODAL } from '../../constants/Modals';
import AddPharmacy from './AddPharmacy';
import EditPharmacy from './EditPharmacy';
import DeletePopover from '../../components/DeletePopover';
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
    loadTypes?: (targetProp: string) => Promise<string[]>;
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
            acceptPharmacy,
            loadTypes
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
    acceptPharmacy,
    loadTypes
}))
@observer
class Pharmacy extends Component<IProps> {
    autorunDisposer: any;
    reactionDisposer: any;

    @observable snackbarType: SNACKBAR_TYPE = SNACKBAR_TYPE.SUCCESS;
    @observable snackbarMessage: string = null;
    @observable types: string[] = [];
    @observable preparedPharmacies: ILPU[] = [];

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

    deleteCallback = (isDeleted: boolean) => {
        this.snackbarType = isDeleted
            ? SNACKBAR_TYPE.SUCCESS
            : SNACKBAR_TYPE.ERROR;
        this.snackbarMessage = isDeleted
            ? 'Аптеку видалено'
            : 'Видалити аптеку не вдалося';
    }

    snackbarCloseHandler = () => {
        this.snackbarMessage = null;
    }

    retryClickHandler = () => {
        this.props.loadPharmacies(true);
    }

    confirmPharmacyHandler = async (pharmacy: ILPU) => {
        const isAccepted = await this.props.acceptPharmacy(pharmacy);
        this.snackbarType = isAccepted
            ? SNACKBAR_TYPE.SUCCESS
            : SNACKBAR_TYPE.ERROR;
        this.snackbarMessage = isAccepted
            ? 'Аптеку підтверджено'
            : 'Підтвердити аптеку не вдалося';
        return isAccepted;
    }

    addPharmacyClickHandler = () => this.props.openModal(ADD_PHARMACY_MODAL);

    autorunCallback = () => {
        const { pharmacies, itemsPerPage, currentPage } = this.props;

        const begin = itemsPerPage * currentPage;

        if (this.requestStatus.loading) {
            const itemOnBegin = pharmacies
                ? pharmacies[begin]
                : null;
            const displayingActualData = this.preparedPharmacies.length === itemsPerPage
                && this.preparedPharmacies[0] === itemOnBegin;
            const pharmacyIsEmpty = pharmacies === null || pharmacies.length === 0;
            if (pharmacyIsEmpty || displayingActualData) return;
        }

        this.preparedPharmacies = pharmacies
            ? pharmacies.filter((x, i) => (i >= begin && i < begin + itemsPerPage))
            : [];
    }

    initializeTypes = async () => {
        const { loadTypes } = this.props;
        this.types = await loadTypes('pharmacy');
    }

    componentDidMount() {
        this.autorunDisposer = autorun(this.autorunCallback);
        this.reactionDisposer = reaction(
            () => this.requestStatus.loading,
            (isLoading) => {
                this.autorunDisposer();
                const delay = isLoading
                    ? 300
                    : 0;
                this.autorunDisposer = autorun(this.autorunCallback, { delay });
            }
        );

        this.props.setPharmacyDemand(true);
        this.props.loadUnconfirmedPharmacies();
        this.initializeTypes();
    }

    componentWillUnmount() {
        this.props.setPharmacyDemand(false);
        this.props.setCurrentPage(0);
        this.reactionDisposer();
        this.autorunDisposer();
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
                        <HCFList
                            onDelete={this.deleteCallback}
                            confirmHandler={this.confirmPharmacyHandler}
                            data={unconfirmedPharmacies}
                            unconfirmed
                        />
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
                    !!this.preparedPharmacies.length &&
                    <HCFList
                        data={this.preparedPharmacies}
                        onDelete={this.deleteCallback}
                        showHeader
                    />
                }
                {
                    this.requestStatus.loading && <LinearProgress />
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
                    open={!!this.snackbarMessage}
                    onClose={this.snackbarCloseHandler}
                    type={this.snackbarType}
                    message={this.snackbarMessage}
                />
                <AddPharmacy types={this.types} />
                <EditPharmacy types={this.types} />
                <DeletePopover
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                />
            </Grid>
        );
    }
}

export default withStyles(styles)(Pharmacy);
