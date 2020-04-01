import React, { Component } from 'react';
import { createStyles, WithStyles, withStyles } from '@material-ui/core';
import { observer } from 'mobx-react';

const styles = createStyles({});

interface IProps extends WithStyles<typeof styles> {}

@observer
class UncommitedPharmacies extends Component<IProps> {
    render() {
        return (
            <p>UncommitedPharmacies</p>
        );
    }
}

export default withStyles(styles)(UncommitedPharmacies);
