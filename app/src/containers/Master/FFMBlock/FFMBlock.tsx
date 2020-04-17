import React, { Component } from 'react';
import { WithStyles, withStyles, createStyles, Grid } from '@material-ui/core';
import { observer } from 'mobx-react';

const styles = createStyles({});

interface IProps extends WithStyles<typeof styles> {

}

@observer
class FFMBlock extends Component<IProps> {
    render() {
        return (
            <Grid container>ffm block</Grid>
        );
    }
}

export default withStyles(styles)(FFMBlock);
