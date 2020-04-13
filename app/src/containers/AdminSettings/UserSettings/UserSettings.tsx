import React, { Component } from 'react';
import { createStyles, withStyles, WithStyles, Grid, Button } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { IWorker } from '../../../interfaces/IWorker';
import ListHeader from './ListHeader';
import ListItem from './ListItem';
import { IPosition } from '../../../interfaces/IPosition';

const styles = (theme: any) => createStyles({
    submitButton: {
        color: theme.palette.primary.green.main,
        borderColor: theme.palette.primary.green.main,
        backgroundColor: 'transparent',
        marginRight: 'auto',
        marginTop: 20
    }
});

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
                <Button variant='outlined' className={classes.submitButton}>
                    Додати користувача
                </Button>
            </Grid>
        );
    }
}

export default withStyles(styles)(UserSettings);
