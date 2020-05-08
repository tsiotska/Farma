import React, { Component } from 'react';
import {
    createStyles,
    withStyles,
    WithStyles,
    Grid,
    Button
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { IWorker } from '../../../interfaces/IWorker';
import ListHeader from './ListHeader';
import ListItem from './ListItem';
import { IPosition } from '../../../interfaces/IPosition';
import { ADD_WORKER_MODAL } from '../../../constants/Modals';
import { USER_ROLE } from '../../../constants/Roles';
import DeletePopover from '../../../components/DeletePopover';

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
    openModal?: (modalName: string, payload: any) => void;
}

@inject(({
    appState: {
        departmentsStore: {
            workers,
            loadAdminWorkers,
            positions
        },
        uiStore: {
            openModal
        }
    }
}) => ({
    workers,
    loadAdminWorkers,
    positions,
    openModal
}))
@observer
class UserSettings extends Component<IProps> {
    openAddWorkerModal = () => {
        const { openModal, positions } = this.props;
        const allowedPositions: USER_ROLE[] = [
            USER_ROLE.ADMIN,
            USER_ROLE.PRODUCT_MANAGER
        ];
        const filteredPositions: IPosition[] = [];
        positions.forEach((posInfo, id) => {
            if (allowedPositions.includes(id)) {
                filteredPositions.push(posInfo);
            }
        });
        openModal(ADD_WORKER_MODAL, filteredPositions);
    }

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
                            positions={positions}
                        />
                    ))
                }
                <Button
                    onClick={this.openAddWorkerModal}
                    className={classes.submitButton}
                    variant='outlined'>
                    Додати користувача
                </Button>
                <DeletePopover />
            </Grid>
        );
    }
}

export default withStyles(styles)(UserSettings);
