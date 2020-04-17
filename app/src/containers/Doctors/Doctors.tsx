import React, { Component } from 'react';
import { createStyles, withStyles, WithStyles } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { IAsyncStatus } from '../../stores/AsyncStore';
import { computed } from 'mobx';

const styles = (theme: any) => createStyles({});

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
        return (
            <div>
                { this.isLoading && <p>loading</p> }
                doctors
            </div>
        );
    }
}

export default withStyles(styles)(Doctors);
