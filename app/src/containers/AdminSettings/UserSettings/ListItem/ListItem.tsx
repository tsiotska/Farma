import React, { Component } from 'react';
import { withStyles, createStyles, WithStyles } from '@material-ui/core';
import { observer } from 'mobx-react';
import WorkerListItem from '../../../../components/WorkerListItem';
import { IWorker } from '../../../../interfaces/IWorker';
import { IPosition } from '../../../../interfaces/IPosition';
import { toJS } from 'mobx';

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
    position: IPosition;
}

@observer
class ListItem extends Component<IProps> {
    render() {
        const { worker, position, classes } = this.props;

        return (
            <WorkerListItem
                position={position}
                worker={worker}
                fired={false}
                isExpanded={false}
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