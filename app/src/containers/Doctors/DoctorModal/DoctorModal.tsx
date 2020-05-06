import React, { Component } from 'react';
import { createStyles, WithStyles } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';

const styles = (theme: any) => createStyles({
    submitButton: {
        marginLeft: 'auto',
    },
    header: {
        marginBottom: 10
    },
    menuItem: {
        minHeight: 36
    }
});

interface IProps extends WithStyles<typeof styles> {

}

// export interface IDoctorModalValues {
//     name: string;
//     lpu: string;
//     specialty: IL;
//     phone: string;
//     card: string;
// }

@observer
class DoctorModal extends Component<IProps> {
    render() {
        return (
            <div>
                DoctorModal
            </div>
        );
    }
}

export default withStyles(styles)(DoctorModal);
