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
import { computed, toJS } from 'mobx';

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
    loadLPUs?: () => void;
    LPUs?: ILPU[];
    unconfirmedLPUs?: ILPU[];
    currentDepartmentId: number;
    getAsyncStatus?: (key: string) => IAsyncStatus;
    setCurrentPage?: (page: number) => void;
    currentPage?: number;
    itemsPerPage?: number;
    loadUnconfirmedLPUs?: () => void;
}

@inject(({
    appState: {
        departmentsStore: {
            getAsyncStatus,
            loadLPUs,
            LPUs,
            currentDepartmentId,
            loadUnconfirmedLPUs,
            unconfirmedLPUs
        },
        uiStore: {
            setCurrentPage,
            currentPage,
            itemsPerPage
        }
    }
}) => ({
    getAsyncStatus,
    loadLPUs,
    LPUs,
    setCurrentPage,
    currentPage,
    itemsPerPage,
    currentDepartmentId,
    loadUnconfirmedLPUs,
    unconfirmedLPUs
}))
@observer
class Lpu extends Component<IProps> {
    @computed
    get isUnconfirmedLPUsLoading(): boolean {
        return this.props.getAsyncStatus('loadUnconfirmedLPUs').loading;
    }

    @computed
    get requestStatus(): IAsyncStatus {
        return this.props.getAsyncStatus('loadLPUs');
    }

    @computed
    get hasNoData(): boolean {
        const { LPUs } = this.props;
        const { loading, error, success } = this.requestStatus;
        return loading === false
            && error === false
            && success === false
            && (!LPUs || !LPUs.length);
    }

    @computed
    get preparedLPUs(): ILPU[] {
        const { LPUs, itemsPerPage, currentPage } = this.props;
        const begin = itemsPerPage * currentPage;
        return Array.isArray(LPUs)
        ? LPUs.filter((x, i) => (i > begin && i < begin + itemsPerPage))
        : [];
    }

    retryClickHandler = () => this.props.loadLPUs();

    loadData = async () => {
        const { loadLPUs, loadUnconfirmedLPUs } = this.props;
        await loadUnconfirmedLPUs();
        await loadLPUs();
    }

    componentDidMount() {
        const { loading, success } = this.requestStatus;
        const shouldLoadLPUs = loading === false && success === false;
        if (shouldLoadLPUs) this.loadData();
    }

    componentDidUpdate({ currentDepartmentId: prevId }: IProps) {
        const { currentDepartmentId: actualId } = this.props;
        if (prevId !== actualId) this.loadData();
    }

    componentWillUnmount() {
        this.props.setCurrentPage(0);
    }

    render() {
        const {
            classes,
            LPUs,
            currentPage,
            itemsPerPage,
            setCurrentPage,
            unconfirmedLPUs
        } = this.props;
        console.log(toJS(unconfirmedLPUs));
        return (
            <Grid direction='column' className={classes.root} container>
                {
                    (Array.isArray(unconfirmedLPUs) && unconfirmedLPUs.length !== 0) &&
                      <Grid className={classes.unconfirmedList} direction='column' container>
                        <Typography className={classes.unconfirmedText} color='textSecondary'>
                            Додані ЛПУ
                        </Typography>
                        <HCFList data={unconfirmedLPUs} unconfirmed />
                      </Grid>
                }
                { this.isUnconfirmedLPUsLoading && <LinearProgress /> }
                <Grid
                    className={classes.header}
                    justify='space-between'
                    alignItems='center'
                    container>
                    <Typography>
                        ЛПУ
                    </Typography>
                    <Button>
                        Додати ЛПУ
                    </Button>
                </Grid>
                {
                    this.requestStatus.loading
                    ? <LinearProgress />
                    : <HCFList data={this.preparedLPUs} showHeader />
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
                        Список ЛПУ пустий
                    </Typography>
                }
                <Pagination
                    currentPage={currentPage}
                    dataLength={LPUs ? LPUs.length : null}
                    itemsPerPage={itemsPerPage}
                    setCurrentPage={setCurrentPage}
                    className={classes.pagination}
                />
            </Grid>
        );
    }
}

export default withStyles(styles)(Lpu);
