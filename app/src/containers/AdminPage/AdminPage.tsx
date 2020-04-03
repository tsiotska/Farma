import React, { Component } from 'react';
import { withStyles, createStyles, WithStyles } from '@material-ui/core';
import { observer } from 'mobx-react';

const styles = (theme: any) => createStyles({});

interface IProps extends WithStyles<typeof styles> {}

@observer
class AdminPage extends Component<IProps> {
    render() {
        return (
            <div>
                admin page
            </div>
        );
    }
}

export default withStyles(styles)(AdminPage);
