import React, { Component } from 'react';
import { createStyles, WithStyles } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';

const styles = (theme: any) => createStyles({});

interface IProps extends WithStyles<typeof styles> {
    loadBonuses?: () => void;
}

@inject(({
    appState: {
        userStore: {
            loadBonuses
        }
    }
}) => ({
    loadBonuses
}))
@observer
class Marks extends Component<IProps> {
    componentDidMount() {
        this.props.loadBonuses();
    }

    render() {
        return (
            <div>
                Marks
            </div>
        );
    }
}

export default withStyles(styles)(Marks);
