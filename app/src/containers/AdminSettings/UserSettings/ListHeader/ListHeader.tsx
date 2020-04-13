import React, { Component } from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/core';
import { observer } from 'mobx-react';

const styles = createStyles({});

interface IProps extends WithStyles<typeof styles> {}

@observer
class ListHeader extends Component<IProps> {
    render() {
        return (
            <div>
                list header
            </div>
        );
    }
}

export default withStyles(styles)(ListHeader);
