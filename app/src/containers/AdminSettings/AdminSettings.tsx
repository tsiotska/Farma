import React, { Component } from 'react';
import { createStyles, withStyles, WithStyles, Grid } from '@material-ui/core';
import { observer } from 'mobx-react';

const styles = createStyles({});

interface IProps extends WithStyles<typeof styles> {
}

@observer
class AdminSettings extends Component<IProps> {
    render() {
        const { classes } = this.props;

        return (
            <Grid>
                settings
            </Grid>
        );
    }
}

export default withStyles(styles)(AdminSettings);
