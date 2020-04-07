import React, { Component } from 'react';
import { createStyles, WithStyles, withStyles } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { IMedicine } from '../../../../interfaces/IMedicine';
import SalaryHeader from '../SalaryHeader';

const styles = createStyles({});

interface IProps extends WithStyles<typeof styles> {
    currentDepartmentMeds?: IMedicine[];
}

@inject(({
    appState: {
        departmentsStore: {
            currentDepartmentMeds
        }
    }
}) => ({
    currentDepartmentMeds
}))
@observer
class UserContent extends Component<IProps> {
    render() {
        return (
            <>
                <SalaryHeader levelsCount={5} />
            </>
        );
    }
}

export default withStyles(styles)(UserContent);
