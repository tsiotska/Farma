import React, { Component } from 'react';
import { withStyles, createStyles, WithStyles } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import WorkerListItem from '../../../../components/WorkerListItem';
import { IWorker } from '../../../../interfaces/IWorker';
import { IPosition } from '../../../../interfaces/IPosition';
import { toJS } from 'mobx';
import { EDIT_WORKER_MODAL } from '../../../../constants/Modals';
import { USER_ROLE } from '../../../../constants/Roles';

const styles = createStyles({
    root: {
        borderBottom: '1px solid #e4e8f6'
    },
    dateCell: {
        display: 'none'
    }
});

interface IProps extends WithStyles<typeof styles> {
    worker: IWorker;
    positions: Map<number, IPosition>;
    deleteHandler: (removed: boolean) => void;
    openModal?: (modalName: string, payload: any) => void;
}

@inject(({
             appState: {
                 uiStore: {
                     openModal
                 }
             }
         }) => ({
    openModal
}))
@observer
class ListItem extends Component<IProps> {
    editClickHandler = (worker: IWorker) => {
        const { openModal, positions } = this.props;
        const allowedPositions: USER_ROLE[] = [
            USER_ROLE.ADMIN,
            USER_ROLE.PRODUCT_MANAGER
        ];
        const filteredPositions: IPosition[] = [];
        positions.forEach(position => {
            const { id } = position;
            if (allowedPositions.includes(id)) filteredPositions.push(position);
        });
        openModal(EDIT_WORKER_MODAL, {
            initialWorker: worker,
            positions: filteredPositions,
        });
    }

    render() {
        const { worker, positions, classes, deleteHandler } = this.props;
        console.log('worker');
        console.log(toJS(worker));
        return (
            <WorkerListItem
                editClickHandler={this.editClickHandler}
                position={positions.get(worker.position)}
                worker={worker}
                fired={false}
                isExpanded={false}
                deleteHandler={deleteHandler}
                disableClick
                classes={{
                    root: classes.root,
                    dateCell: classes.dateCell
                }}
            />
        );
    }
}

export default withStyles(styles)(ListItem);
