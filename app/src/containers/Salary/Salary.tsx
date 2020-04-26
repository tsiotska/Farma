import React, { Component } from 'react';
import { createStyles, WithStyles, Grid } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import Header from './Header';
import { observable } from 'mobx';

const styles = (theme: any) => createStyles({});

interface IProps extends WithStyles<typeof styles> {

}

@observer
class Salary extends Component<IProps> {
    @observable year: number = new Date().getFullYear();

    changeYear = (value: number) => {
        this.year = value;
    }

    render() {
        return (
            <Grid container direction='column'>
                <Header year={this.year} changeYear={this.changeYear} />
            </Grid>
        );
    }
}

export default withStyles(styles)(Salary);
