import React, { Component } from 'react';
import { createStyles, withStyles, WithStyles } from '@material-ui/core';
import { observer } from 'mobx-react';

const styles = createStyles({});

interface IProps extends WithStyles<typeof styles> {}

@observer
class AccessSettings extends Component<IProps> {
    render() {
        const { classes } = this.props;

        return (
            <div>
                access settings
            </div>
        );
    }
}

export default withStyles(styles)(AccessSettings);
