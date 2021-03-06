import React, { Component } from 'react';
import {
    createStyles,
    withStyles,
    WithStyles,
    Grid,
    Button,
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { IWorker } from '../../../interfaces/IWorker';
import ListHeader from './ListHeader';
import ListItem from './ListItem';
import { IPosition } from '../../../interfaces/IPosition';
import { ADD_WORKER_MODAL } from '../../../constants/Modals';
import { USER_ROLE } from '../../../constants/Roles';
import DeletePopover from '../../../components/DeletePopover';
import { observable, toJS } from 'mobx';
import Snackbar from '../../../components/Snackbar';
import { SNACKBAR_TYPE } from '../../../constants/Snackbars';
import { withRestriction } from '../../../components/hoc/withRestriction';
import { IWithRestriction } from '../../../interfaces';
import { PERMISSIONS } from '../../../constants/Permissions';

const styles = (theme: any) => createStyles({
    submitButton: {
        color: theme.palette.primary.green.main,
        borderColor: theme.palette.primary.green.main,
        backgroundColor: 'transparent',
        marginRight: 'auto',
        marginTop: 20
    }
});

interface IProps extends WithStyles<typeof styles>, IWithRestriction {
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
@withRestriction([PERMISSIONS.ADD_USER])
@observer
class UserSettings extends Component<IProps> {
    @observable showSnackbar: boolean = false;
    @observable snackbarType: SNACKBAR_TYPE = SNACKBAR_TYPE.SUCCESS;

    snackbarCloseHandler = () => {
        this.showSnackbar = false;
    }

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

    deleteHandler = (removed: boolean) => {
        this.snackbarType = removed
            ? SNACKBAR_TYPE.SUCCESS
            : SNACKBAR_TYPE.ERROR;
        this.showSnackbar = true;
        if (removed) {
            this.props.loadAdminWorkers();
        }
    }

    componentDidMount() {
        this.props.loadAdminWorkers();
    }

    render() {
        const { classes, workers, positions, isAllowed } = this.props;
        console.log(toJS(workers));
        return (
            <Grid direction='column' container>
                <ListHeader/>
                {
                    workers.map(worker => (
                        <ListItem
                            key={worker.id}
                            deleteHandler={this.deleteHandler}
                            worker={worker}
                            positions={positions}

                        />
                    ))
                }
                {
                    isAllowed &&
                    <Button
                        onClick={this.openAddWorkerModal}
                        className={classes.submitButton}
                        variant='outlined'>
                        ???????????? ??????????????????????
                    </Button>
                }
                <DeletePopover name='deleteWorker'/>
                <Snackbar
                    open={this.showSnackbar}
                    type={this.snackbarType}
                    onClose={this.snackbarCloseHandler}
                    message={
                        this.snackbarType === SNACKBAR_TYPE.SUCCESS
                            ? '???????????????????? ????????????????'
                            : '?????? ?????? ?????????????????? ???????????????????? ?????????????????? ??????????????'
                    }
                />
            </Grid>
        );
    }
}

export default withStyles(styles)(UserSettings);
