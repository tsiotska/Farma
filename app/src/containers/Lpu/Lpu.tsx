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
    }
});

interface IProps extends WithStyles<typeof styles> {
    loadLPUs?: () => void;
    LPUs?: ILPU[];

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
    itemsPerPage
}))
@observer
class Lpu extends Component<IProps> {
    @computed
    get isLoading(): boolean {
        return this.props.getAsyncStatus('loadLPUs').loading;
    }

    @computed
    get preparedLPUs(): ILPU[] {
        const { LPUs, itemsPerPage, currentPage } = this.props;
        const begin = itemsPerPage * currentPage;
        return Array.isArray(LPUs)
        ? LPUs.filter((x, i) => (i > begin && i < begin + itemsPerPage))
        : [];
    }

    componentDidMount() {
        const { getAsyncStatus, loadLPUs } = this.props;
        const { loading, success } = getAsyncStatus('loadLPUs');
        const shouldLoadLPUs = loading === false && success === false;
        if (shouldLoadLPUs) loadLPUs();
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
                <HCFList isLoading={this.isLoading} data={this.preparedLPUs} />
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
