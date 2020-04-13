import React, { Component } from 'react';
import { createStyles, withStyles, WithStyles, Grid } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { IWorker } from '../../../interfaces/IWorker';
import ListHeader from './ListHeader';
import ListItem from './ListItem';
import { IPosition } from '../../../interfaces/IPosition';
import { toJS } from 'mobx';

const styles = createStyles({});

interface IProps extends WithStyles<typeof styles> {
    workers?: IWorker[];
    loadAdminWorkers?: () => void;
    positions?: Map<number, IPosition>;
}

@inject(({
    appState: {
        departmentsStore: {
            workers,
            loadAdminWorkers,
            positions
        }
    }
}) => ({
    workers,
    loadAdminWorkers,
    positions
}))
@observer
class UserSettings extends Component<IProps> {
    componentDidMount() {
        this.props.loadAdminWorkers();
    }

    render() {
        const { classes, workers, positions } = this.props;

        return (
            <Grid direction='column' container>
                <ListHeader />
                {
                    workers.map(worker => (
                        <ListItem
                            key={worker.id}
                            worker={worker}
                            position={positions.get(worker.id)}
                        />
                    ))
                }
            </Grid>
        );
    }
}

export default withStyles(styles)(UserSettings);
