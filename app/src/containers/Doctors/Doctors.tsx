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
import { computed, toJS, observable, reaction, when } from 'mobx';
import Header from './Header';
import ListHeader from './ListHeader';
import { IDoctor } from '../../interfaces/IDoctor';
import DoctorListItem from './DoctorListItem';
import Pagination from '../../components/Pagination';
import Snackbar from '../../components/Snackbar';
import { SNACKBAR_TYPE } from '../../constants/Snackbars';
import EditDepositModal from './EditDepositModal';
import CreateDoctorModal from './CreateDoctorModal';
import EditDoctorModal from './EditDoctorModal.tsx';
import DeletePopover from '../../components/DeletePopover';
import { IDeletePopoverSettings } from '../../stores/UIStore';
import { IUser } from '../../interfaces';
import { USER_ROLE } from '../../constants/Roles';

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
    loadDoctors?: () => Promise<void>;
    getAsyncStatus?: (key: string) => IAsyncStatus;
    clearDoctors?: () => void;
    setCurrentPage?: (page: number) => void;
    currentPage?: number;
    itemsPerPage?: number;
    openDelPopper?: (settings: IDeletePopoverSettings) => void;
    removeDoctor?: (doc: IDoctor) => boolean;
    previewUser?: IUser;
    previewDoctorId?: number;
    setPreviewDoctor?: (id: number) => void;
    acceptAgent?: (doc: IDoctor) => boolean;
}

@inject(({
    appState: {
        departmentsStore: {
            loadDoctors,
            getAsyncStatus,
            clearDoctors,
            doctors,
            removeDoctor,
            previewDoctorId,
            setPreviewDoctor,
            acceptAgent
        },
        uiStore: {
            setCurrentPage,
            currentPage,
            itemsPerPage,
            openDelPopper
        },
        userStore: {
            previewUser
        }
    }
}) => ({
    removeDoctor,
    acceptAgent,
    loadDoctors,
    getAsyncStatus,
    clearDoctors,
    doctors,
    setCurrentPage,
    currentPage,
    itemsPerPage,
    openDelPopper,
    previewUser,
    previewDoctorId,
    setPreviewDoctor
}))
@observer
class Doctors extends Component<IProps> {
    reactionDisposer: any;
    pageReactionDisposer: any;

    @observable isSnackbarOpen: boolean = false;
    @observable snackbarType: SNACKBAR_TYPE = SNACKBAR_TYPE.SUCCESS;
    @observable snackbarMessage: string = '';
    @observable target: number = null;

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

    @computed
    get previewDocInd(): number {
        const { doctors, previewDoctorId } = this.props;
        if (previewDoctorId === null) return -1;
        return doctors
            ? doctors.findIndex(({ id }) => id === previewDoctorId)
            : -1;
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

    confirmHandler = async (doc: IDoctor) => {
        const { acceptAgent } = this.props;
        const isAccepted = await acceptAgent(doc);
        this.snackbarType = isAccepted
            ? SNACKBAR_TYPE.SUCCESS
            : SNACKBAR_TYPE.ERROR;
        this.snackbarMessage = isAccepted
            ? 'Лікар успішно підтверджений'
            : 'Підтвердити лікаря неможливо';
    }

    clearTarget = () => {
        this.target = null;
    }

    removeHighlight = () => {
        this.props.setPreviewDoctor(null);
    }

    componentDidMount() {
        const {
            itemsPerPage,
            setCurrentPage,
            clearDoctors,
            loadDoctors,
            setPreviewDoctor
        } = this.props;

        this.pageReactionDisposer = reaction(
            () => this.previewDocInd,
            (docId: number) => {
                if (docId === -1) return;
                const targetPage = Math.floor(docId / itemsPerPage);
                setCurrentPage(targetPage);
                this.target = this.props.previewDoctorId;
            }
        );

        this.reactionDisposer = reaction(
            () => this.props.previewUser,
            async (user: IUser) => {
                const shouldReloadData = !!user && user.position === USER_ROLE.MEDICAL_AGENT;

                if (shouldReloadData) {
                    setCurrentPage(0);
                    clearDoctors();
                    loadDoctors();
                }
            },
            { fireImmediately: true }
        );
    }

    componentWillUnmount() {
        if (this.pageReactionDisposer) this.pageReactionDisposer();
        if (this.reactionDisposer) this.reactionDisposer();
        this.props.clearDoctors();
        this.props.setCurrentPage(0);
    }

    render() {
        const {
            classes,
            doctors,
            currentPage,
            setCurrentPage,
            itemsPerPage,
            previewDoctorId
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
                            highlight={doc.id === previewDoctorId}
                            removeHighlighting={this.removeHighlight}
                            unconfirmed={doc.confirmed === false}
                            deleteHandler={this.deleteHandler}
                            confirmHandler={this.confirmHandler}
                            rootRef={(el: any) => {
                                try {
                                    if (doc.id === this.target) {
                                        el.scrollIntoView();
                                        this.clearTarget();
                                    }
                                } catch (e) {
                                    console.error(e);
                                }
                            }}
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
                <EditDepositModal/>
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
