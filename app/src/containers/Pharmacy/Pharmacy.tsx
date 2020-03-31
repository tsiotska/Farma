import React, { Component } from 'react';
import { createStyles, WithStyles } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IAsyncStatus } from '../../stores/AsyncStore';

const styles = (theme: any) => createStyles({});

interface IProps extends WithStyles<typeof styles> {
    getAsyncStatus?: (key: string) => IAsyncStatus;
    loadPharmacies?: (isInitial: boolean) => void;
}

@inject(({
    appState: {
        departmentsStore: {
            getAsyncStatus,
            loadPharmacies
        }
    }
}) => ({
    getAsyncStatus,
    loadPharmacies
}))
@observer
class Pharmacy extends Component<IProps> {
    componentDidMount() {
        const { getAsyncStatus, loadPharmacies } = this.props;
        const { loading, success } = getAsyncStatus('loadPharmacies');
        const shouldLoadPharmacies = loading === false && success === false;
        if (shouldLoadPharmacies) loadPharmacies(true);
    }

    render() {
        return (
            <div>
                Pharmacy
            </div>
        );
    }
}

export default withStyles(styles)(Pharmacy);
