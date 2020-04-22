import React, { Component } from 'react';
import { createStyles, withStyles, WithStyles, Grid, LinearProgress } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { IAsyncStatus } from '../../stores/AsyncStore';
import { computed } from 'mobx';
import Header from './Header';
import ListHeader from './ListHeader';

const styles = (theme: any) => createStyles({
    root: {
        padding: '0 20px'
    }
});

interface IProps extends WithStyles<typeof styles> {
    loadDoctors?: () => void;
    getAsyncStatus?: (key: string) => IAsyncStatus;
    clearDoctors?: () => void;
}

@inject(({
    appState: {
        departmentsStore: {
            loadDoctors,
            getAsyncStatus,
            clearDoctors
        }
    }
}) => ({
    loadDoctors,
    getAsyncStatus,
    clearDoctors
}))
@observer
class Doctors extends Component<IProps> {
    @computed
    get isLoading(): boolean {
        return this.props.getAsyncStatus('loadDoctors').loading;
    }

    componentDidMount() {
        this.props.loadDoctors();
    }

    componentWillUnmount() {
        this.props.clearDoctors();
    }

    render() {
        const { classes } = this.props;

        return (
            <Grid className={classes.root} container direction='column'>
                <Header />
                <ListHeader />
                { this.isLoading && <LinearProgress /> }
            </Grid>
        );
    }
}

export default withStyles(styles)(Doctors);
