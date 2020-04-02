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
import HCFList from '../HCFList';
import Pagination from '../../components/Pagination';
import { ILPU } from '../../interfaces/ILPU';
import UncommitedLpus from './UncommitedLpus';
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
    loadLPUs?: () => void;
    LPUs?: ILPU[];
    currentDepartmentId: number;
    getAsyncStatus?: (key: string) => IAsyncStatus;
    setCurrentPage?: (page: number) => void;
    currentPage?: number;
    itemsPerPage?: number;
}

@inject(({
    appState: {
        departmentsStore: {
            getAsyncStatus,
            loadLPUs,
            LPUs,
            currentDepartmentId
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
    currentDepartmentId
}))
@observer
class Lpu extends Component<IProps> {
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

    componentDidMount() {
        const { getAsyncStatus, loadLPUs } = this.props;
        const { loading, success } = getAsyncStatus('loadLPUs');
        const shouldLoadLPUs = loading === false && success === false;
        if (shouldLoadLPUs) loadLPUs();
    }

    componentDidUpdate({ currentDepartmentId: prevId }: IProps) {
        const { currentDepartmentId: actualId, loadLPUs } = this.props;
        if (prevId !== actualId) loadLPUs();
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
            setCurrentPage
        } = this.props;

        return (
            <Grid direction='column' className={classes.root} container>
                <UncommitedLpus />
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
                <HCFList isLoading={this.requestStatus.loading} data={this.preparedLPUs} />
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
