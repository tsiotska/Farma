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
    },
    avatar: {
        marginLeft: 5
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
            loadSubworkers: retryLoadSubworkers
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
        const { expandedWorker, positions, classes } = this.props;

        if (expandedWorker === null || expandedWorker.subworkers === null) return;

        return expandedWorker.subworkers.length
        ? expandedWorker.subworkers.map(x => (
            <ListItem
                key={x.id}
                position={positions.get(x.position)}
                worker={x}
                fired={false}
                isExpanded={false}
                classes={{
                    avatar: classes.avatar
                }}
            />
          ))
        : <Typography>
            Список працівників пустий
          </Typography>;
    }

    render() {
        const { classes, retryLoadSubworkers } = this.props;

        return (
            <Grid direction='column' container>
                <Typography className={classes.title} color='textSecondary'>
                    Медицинські представники
                </Typography>
                {
                    this.asyncStatus.loading &&
                    <LinearProgress />
                }
                {this.getList()}
                {
                    this.asyncStatus.error &&
                    <Typography className={classes.errorMessage} variant='body2'>
                        Не вдалось отримати список працівників
                        <Button
                            variant='outlined'
                            onClick={retryLoadSubworkers}
                            className={classes.retryButton}>
                            Повторити запит
                        </Button>
                    </Typography>
                }
            </Grid>
        );
    }
}

export default withStyles(styles)(Sublist);