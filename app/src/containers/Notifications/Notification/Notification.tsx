import React, { Component } from 'react';
import { createStyles, WithStyles, withStyles } from '@material-ui/core';
import { observer } from 'mobx-react';
import { INotification } from '../../../interfaces/iNotification';

const styles = createStyles({});

interface IProps extends WithStyles<typeof styles> {
    notification: INotification;
}

@observer
class Notification extends Component<IProps> {
    render() {
        return (
            <div>
                notification
            </div>
        );
    }
}

export default withStyles(styles)(Notification);
