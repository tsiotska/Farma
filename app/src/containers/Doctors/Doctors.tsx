import React, { Component } from 'react';
import { createStyles, withStyles, WithStyles, Grid, LinearProgress, Typography } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { IAsyncStatus } from '../../stores/AsyncStore';
import { computed, toJS } from 'mobx';
import Header from './Header';
import ListHeader from './ListHeader';
import { IDoctor } from '../../interfaces/IDoctor';
import DoctorListItem from './DoctorListItem';

const styles = (theme: any) => createStyles({
    root: {
        padding: '0 20px'
    }
});

interface IProps extends WithStyles<typeof styles> {
    doctors?: IDoctor[];
    loadDoctors?: () => void;
    getAsyncStatus?: (key: string) => IAsyncStatus;
    clearDoctors?: () => void;
}

@inject(({
    appState: {
        departmentsStore: {
            loadDoctors,
            getAsyncStatus,
            clearDoctors,
            doctors
        }
    }
}) => ({
    loadDoctors,
    getAsyncStatus,
    clearDoctors,
    doctors

}))
@observer
class Doctors extends Component<IProps> {
    @computed
    get isLoading(): boolean {
        return this.props.getAsyncStatus('loadDoctors').loading;
    }

    @computed
    get isLoaded(): boolean {
        const { getAsyncStatus } = this.props;
        const isUnconfirmedDocsLoaded = getAsyncStatus('loadUnconfirmedDoctors').success;
        const isDocsLoaded = getAsyncStatus('loadDoctors').success;
        return isUnconfirmedDocsLoaded && isDocsLoaded;
    }

    componentDidMount() {
        this.props.loadDoctors();
    }

    componentWillUnmount() {
        this.props.clearDoctors();
    }

    render() {
        const { classes, doctors } = this.props;

        return (
            <Grid className={classes.root} container direction='column'>
                <Header />
                <ListHeader />
                { this.isLoading && <LinearProgress /> }
                {
                    (this.isLoaded && !doctors.length) &&
                    <Typography>
                        Список лікарів пустий
                    </Typography>
                }
                {
                    doctors.map((doc, i) => (
                        <DoctorListItem
                            key={doc.id}
                            doctor={doc}
                            unconfirmed={doc.confirmed === false}
                        />
                    ))
                }
            </Grid>
        );
    }
}

export default withStyles(styles)(Doctors);
