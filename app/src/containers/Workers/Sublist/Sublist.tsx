import React, { Component } from 'react';
import {
    createStyles,
    withStyles,
    WithStyles,
    LinearProgress,
    Grid,
    Typography
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

    render() {
        const { classes, positions } = this.props;
        console.log('positions: ', toJS(positions));
        return (
            <Grid direction='column' container>
                <Typography className={classes.title} color='textSecondary'>
                    Медицинские представители
                </Typography>
                {
                    this.asyncStatus.loading &&
                    <LinearProgress />
                }
                {
                    Array.isArray(this.workers) &&
                    this.workers.map(x => (
                        <ListItem
                            key={x.id}
                            position={positions.get(x.position)}
                            worker={x}
                            fired={false}
                            isExpanded={false}
                        />
                    ))
                }
                {
                    this.asyncStatus.error &&
                    <Typography>loading error</Typography>
                }
            </Grid>
        );
    }
}

export default withStyles(styles)(Sublist);
