import React, { Component } from 'react';
import { WithStyles, withStyles, createStyles } from '@material-ui/core';
import { observer } from 'mobx-react';
import { IDoctor } from '../../../../interfaces/IDoctor';

const styles = createStyles({});

interface IProps extends WithStyles<typeof styles> {
    doctor: IDoctor;
}

@observer
class DoctorPanel extends Component<IProps> {
    render() {
        return (
            <div>
                Doctor panel
            </div>
        );
    }
}

export default withStyles(styles)(DoctorPanel);
