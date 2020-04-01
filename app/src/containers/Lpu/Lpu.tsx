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
    loadLPUs?: () => void;
    LPUs?: ILPU[];
    preparedLPUs?: ILPU[];
    setCurrentPage?: (page: number) => void;
}

@inject(({
    appState: {
        departmentsStore: {
            getAsyncStatus,
            loadLPUs,
            LPUs,
            preparedLPUs
        },
        uiStore: {
            setCurrentPage
        }
    }
}) => ({
    getAsyncStatus,
    loadLPUs,
    LPUs,
    preparedLPUs,
    setCurrentPage
}))
@observer
class Lpu extends Component<IProps> {
    get isLoading(): boolean {
        return this.props.getAsyncStatus('loadLPUs').loading;
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
        const { classes, preparedLPUs, LPUs } = this.props;

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
                <HCFList isLoading={this.isLoading} data={preparedLPUs} />
                <Pagination data={LPUs} className={classes.pagination} />
            </Grid>
        );
    }
}

export default withStyles(styles)(Lpu);
