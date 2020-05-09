import React, { Component } from 'react';
import {
    createStyles,
    withStyles,
    WithStyles,
    Grid,
    LinearProgress,
    Typography
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { IAsyncStatus } from '../../stores/AsyncStore';
import { computed, toJS, observable } from 'mobx';
import Header from './Header';
import ListHeader from './ListHeader';
import { IDoctor } from '../../interfaces/IDoctor';
import DoctorListItem from './DoctorListItem';
import Pagination from '../../components/Pagination';
import Snackbar from '../../components/Snackbar';
import { SNACKBAR_TYPE } from '../../constants/Snackbars';
import CreateDoctorModal from './CreateDoctorModal';
import EditDoctorModal from './EditDoctorModal.tsx';
import DeletePopover from '../../components/DeletePopover';
import { IDeletePopoverSettings } from '../../stores/UIStore';

const styles = (theme: any) => createStyles({
    root: {
        padding: '0 20px'
    },
    pagination: {
        margin: '16px 0 60px auto'
    },
});

interface IProps extends WithStyles<typeof styles> {
    doctors?: IDoctor[];
    loadDoctors?: () => void;
    getAsyncStatus?: (key: string) => IAsyncStatus;
    clearDoctors?: () => void;
    setCurrentPage?: (page: number) => void;
    currentPage?: number;
    itemsPerPage?: number;
    openDelPopper?: (settings: IDeletePopoverSettings) => void;
    removeDoctor?: (doc: IDoctor) => boolean;
}

@inject(({
    appState: {
        departmentsStore: {
            loadDoctors,
            getAsyncStatus,
            clearDoctors,
            doctors,
            removeDoctor
        },
        uiStore: {
            setCurrentPage,
            currentPage,
            itemsPerPage,
            openDelPopper
        }
    }
}) => ({
    removeDoctor,
    loadDoctors,
    getAsyncStatus,
    clearDoctors,
    doctors,
    setCurrentPage,
    currentPage,
    itemsPerPage,
    openDelPopper
}))
@observer
class Doctors extends Component<IProps> {
    @observable isSnackbarOpen: boolean = false;
    @observable snackbarType: SNACKBAR_TYPE = SNACKBAR_TYPE.SUCCESS;
    @observable snackbarMessage: string = '';

    @computed
    get isLoading(): boolean {
        return this.props.getAsyncStatus('loadDoctors').loading;
    }

    @computed
    get isLoaded(): boolean {
        const { getAsyncStatus } = this.props;
        const isUnconfirmedDocsLoaded = getAsyncStatus('loadUnconfirmedDoctors').success;
        const isDocsLoaded = getAsyncStatus('loadDoctors').success;
        return isUnconfirmedDocsLoaded && isDocsLoaded;
    }

    @computed
    get preparedDoctors(): IDoctor[] {
        const { doctors, currentPage, itemsPerPage } = this.props;
        const begin = itemsPerPage * currentPage;
        return doctors.filter((x, i) => (i >= begin && i < begin + itemsPerPage));
    }

    deleteHandler = (doc: IDoctor) => async (confirmed: boolean) => {
        const { openDelPopper, removeDoctor } = this.props;
        openDelPopper(null);
        if (!confirmed) return;
        const docRemoved = await removeDoctor(doc);
        this.snackbarType = docRemoved
            ? SNACKBAR_TYPE.SUCCESS
            : SNACKBAR_TYPE.ERROR;
        this.snackbarMessage = docRemoved
            ? 'Лікар успішно видалений'
            : 'Під час видалення лікаря трапилась помилка';
        this.isSnackbarOpen = true;
    }

    snackbarCloseHandler = () => {
        this.isSnackbarOpen = false;
    }

    confirmationCallback =  (success: boolean) => {
        this.snackbarType = success
            ? SNACKBAR_TYPE.SUCCESS
            : SNACKBAR_TYPE.ERROR;
        this.snackbarMessage = success
            ? 'Лікар успішно підтверджений'
            : 'Підтвердити лікаря неможливо';
        this.isSnackbarOpen = true;
    }

    componentDidMount() {
        this.props.clearDoctors();
        this.props.loadDoctors();
    }

    componentWillUnmount() {
        this.props.clearDoctors();
        this.props.setCurrentPage(0);
    }

    render() {
        const {
            classes,
            doctors,
            currentPage,
            setCurrentPage,
            itemsPerPage
        } = this.props;

        return (
            <Grid className={classes.root} container direction='column'>
                <Header />
                <ListHeader />
                { this.isLoading && <LinearProgress /> }
                {
                    (this.isLoaded && !doctors.length) &&
                    <Typography>
                        Список лікарів пустий
                    </Typography>
                }
                {
                    this.preparedDoctors.map((doc, i) => (
                        <DoctorListItem
                            key={doc.id}
                            doctor={doc}
                            unconfirmed={doc.confirmed === false}
                            deleteHandler={this.deleteHandler}
                            confirmationCallback={this.confirmationCallback}
                        />
                    ))
                }
                <Pagination
                    currentPage={currentPage}
                    dataLength={doctors.length || null}
                    itemsPerPage={itemsPerPage}
                    setCurrentPage={setCurrentPage}
                    className={classes.pagination}
                />
                <Snackbar
                    open={this.isSnackbarOpen}
                    onClose={this.snackbarCloseHandler}
                    type={this.snackbarType}
                    message={this.snackbarMessage}
                />
                <CreateDoctorModal />
                <EditDoctorModal />
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

export default withStyles(styles)(Doctors);
