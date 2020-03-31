import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core';
import { ILPU } from '../../../interfaces/ILPU';
import { toJS } from 'mobx';

const styles = createStyles({});

interface IProps extends WithStyles<typeof styles> {
    pharmacies?: Map<number, ILPU>;
}

@inject(({
    appState: {
        departmentsStore: {
            pharmacies
        }
    }
}) => ({
    pharmacies
}))
@observer
class PharmaciesList extends Component<IProps> {
    // TODO: pagination, sort, search
    render() {
        const { pharmacies } = this.props;
        return (
            <p>pharmacies list</p>
        );
    }
}

export default withStyles(styles)(PharmaciesList);
