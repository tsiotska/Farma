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
import { observable } from 'mobx';
import { IWorker } from '../../../interfaces/IWorker';
import { IAsyncStatus } from '../../../stores/AsyncStore';
import ListItem from '../ListItem';
import { IPosition } from '../../../interfaces/IPosition';
import { IExpandedWorker } from '../../../stores/DepartmentsStore';

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
    positions: Map<number, IPosition>;

    expandedWorker?: IExpandedWorker;
    getAsyncStatus?: (key: string) => IAsyncStatus;
    retryLoadSubworkers?: () => void;
}

@inject(({
    appState: {
        departmentsStore: {
            expandedWorker,
            getAsyncStatus,
            retryLoadSubworkers
        }
    }
}) => ({
    retryLoadSubworkers,
    getAsyncStatus,
    expandedWorker
}))
@observer
class Sublist extends Component<IProps> {
    get asyncStatus(): IAsyncStatus {
        return this.props.getAsyncStatus('loadSubworkers');
    }

    getList = () => {
        const { expandedWorker, positions } = this.props;

        if (expandedWorker === null) return;

        return expandedWorker.subworkers.length
        ? expandedWorker.subworkers.map(x => (
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
        const { classes, retryLoadSubworkers } = this.props;

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
                    <Typography className={classes.errorMessage} variant='body2'>
                        Не удалось получить список сотрудников
                        <Button
                            variant='outlined'
                            onClick={retryLoadSubworkers}
                            className={classes.retryButton}>
                            Повторить Запрос
                        </Button>
                    </Typography>
                }
            </Grid>
        );
    }
}

export default withStyles(styles)(Sublist);
