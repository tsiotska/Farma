import React, { Component } from 'react';
import { createStyles, WithStyles } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';

const styles = (theme: any) => createStyles({});

interface IProps extends WithStyles<typeof styles> {

}

@observer
class Workers extends Component<IProps> {
    render() {
        return (
            <div>
                Workers
            </div>
        );
    }
}

export default withStyles(styles)(Workers);
