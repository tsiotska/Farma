import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles, createStyles, WithStyles } from '@material-ui/core';

const styles = createStyles({});

interface IProps extends WithStyles<typeof styles> {}

@observer
class Notifications extends Component<IProps> {
    render() {
        return (
            <div>
                notificatiosn
            </div>
        );
    }
}

export default withStyles(styles)(Notifications);
