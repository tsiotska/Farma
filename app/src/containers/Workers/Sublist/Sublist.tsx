import React, { Component } from 'react';
import {
    createStyles,
    withStyles,
    WithStyles,
    LinearProgress,
    Grid,
    Typography,
    Button
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { IWorker } from '../../../interfaces/IWorker';
import { observable, toJS } from 'mobx';
import { IAsyncStatus } from '../../../stores/AsyncStore';
import ListItem from '../ListItem';
import { IPosition } from '../../../interfaces/IPosition';

const styles = (theme: any) => createStyles({
    title: {
        fontFamily: 'Source Sans Pro SemiBold',
        margin: '22px 0'
    },
    errorMessage: {
        display: 'flex',
        alignItems: 'center'
    },
    retryButton: {
        marginLeft: theme.spacing(2)
    }
});

interface IProps extends WithStyles<typeof styles> {
    rmId: number;
    loadSubWorkers?: (rmId: number) => Promise<IWorker[]>;
    positions: Map<number, IPosition>;
}

@inject(({
    appState: {
        departmentsStore: {
            loadSubWorkers
        }
    }
}) => ({
    loadSubWorkers
}))
@observer
class Sublist extends Component<IProps> {
    @observable workers: IWorker[] = null;
    @observable asyncStatus: IAsyncStatus = {
        error: false,
        loading: true,
        success: false
    };
    timeout: any = null;
    isUnmounted: boolean = false;

    loadWorkers = async () => {
        const { rmId, loadSubWorkers } = this.props;

        this.asyncStatus.loading = true;
        this.asyncStatus.error = false;
        const res = await loadSubWorkers(rmId);

        if (this.isUnmounted) return;

        this.workers = res;

        this.asyncStatus.loading = false;
        if (Array.isArray(this.workers)) this.asyncStatus.success = true;
        else this.asyncStatus.error = true;
    }

    componentDidMount() {
        this.timeout = setTimeout(
            this.loadWorkers,
            500
        );
    }

    componentWillUnmount() {
        window.clearInterval(this.timeout);
        this.isUnmounted = true;
    }

    getList = () => {
        if (!Array.isArray(this.workers)) return;

        const { positions } = this.props;

        return this.workers.length
        ? this.workers.map(x => (
            <ListItem
                key={x.id}
                position={positions.get(x.position)}
                worker={x}
                fired={false}
                isExpanded={false}
            />
          ))
        : <Typography>
            Список сотрудников пуст
          </Typography>;
    }

    render() {
        const { classes } = this.props;

        return (
            <Grid direction='column' container>
                <Typography className={classes.title} color='textSecondary'>
                    Медицинские представители
                </Typography>
                {
                    this.asyncStatus.loading &&
                    <LinearProgress />
                }
                {this.getList()}
                {
                    this.asyncStatus.error &&
                    <>
                        <Typography className={classes.errorMessage} variant='body2'>
                            Не удалось получить список сотрудников
                            <Button
                                variant='outlined'
                                onClick={this.loadWorkers}
                                className={classes.retryButton}>
                                Повторить Запрос
                            </Button>
                        </Typography>
                    </>
                }
            </Grid>
        );
    }
}

export default withStyles(styles)(Sublist);
