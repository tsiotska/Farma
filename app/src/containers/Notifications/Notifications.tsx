import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles, createStyles, WithStyles } from '@material-ui/core';
import { IDepartment } from '../../interfaces/IDepartment';

const styles = createStyles({});

interface IProps extends WithStyles<typeof styles> {
    setCurrentDepartment?: (department: IDepartment) => void;
}

@inject(({
    appState: {
        departmentsStore: {
            setCurrentDepartment
        }
    }
}) => ({
    setCurrentDepartment
}))
@observer
class Notifications extends Component<IProps> {
    constructor(props: IProps) {
        super(props);
        this.props.setCurrentDepartment(null);
    }

    render() {
        return (
            <div>
                notificatiosn
            </div>
        );
    }
}

export default withStyles(styles)(Notifications);
