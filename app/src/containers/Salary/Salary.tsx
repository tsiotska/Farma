import React, { Component } from 'react';
import { createStyles, WithStyles, Grid } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import Header from './Header';

const styles = (theme: any) => createStyles({});

interface IProps extends WithStyles<typeof styles> {

}

@observer
class Salary extends Component<IProps> {
    render() {
        return (
            <Grid container direction='column'>
                <Header />
            </Grid>
        );
    }
}

export default withStyles(styles)(Salary);
