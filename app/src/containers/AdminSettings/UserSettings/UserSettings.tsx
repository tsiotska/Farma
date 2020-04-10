import React, { Component } from 'react';
import { createStyles, withStyles, WithStyles } from '@material-ui/core';
import { observer } from 'mobx-react';

const styles = createStyles({});

interface IProps extends WithStyles<typeof styles> {}

@observer
class UserSettings extends Component<IProps> {
    render() {
        const { classes } = this.props;

        return (
            <div>
                UserSettings
            </div>
        );
    }
}

export default withStyles(styles)(UserSettings);
