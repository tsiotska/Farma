import React, { Component } from 'react';
import { createStyles, WithStyles } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';

const styles = (theme: any) => createStyles({});

interface IProps extends WithStyles<typeof styles> {
    loadLPUs?: (isInitial: boolean) => void;
}

@inject(({
    appState: {
        departmentsStore: {
            loadLPUs
        }
    }
}) => ({
    loadLPUs
}))
@observer
class Lpu extends Component<IProps> {
    componentDidMount() {
        this.props.loadLPUs(true);
    }

    render() {
        return (
            <div>
                Lpu
            </div>
        );
    }
}

export default withStyles(styles)(Lpu);
