import React, { Component } from 'react';
import { WithStyles, withStyles, createStyles } from '@material-ui/core';
import { observer } from 'mobx-react';
import { IDoctor } from '../../../../interfaces/IDoctor';

const styles = createStyles({});

interface IProps extends WithStyles<typeof styles> {
    worker: IDoctor;
}

@observer
class WorkerPanel extends Component<IProps> {
    render() {
        return (
            <div>
                WorkerPanel
            </div>
        );
    }
}

export default withStyles(styles)(WorkerPanel);
