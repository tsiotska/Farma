import React, { Component } from 'react';
import { createStyles, WithStyles, withStyles } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { IMedicine } from '../../../../interfaces/IMedicine';
import SalaryHeader from '../SalaryHeader';
import { ISalaryInfo } from '../../../../interfaces/ISalaryInfo';
import { IUser } from '../../../../interfaces';
import { USER_ROLE } from '../../../../constants/Roles';
import SalaryRow from '../SalaryRow';

const styles = createStyles({});

interface IProps extends WithStyles<typeof styles> {
    currentDepartmentMeds?: IMedicine[];
    user: IUser;
    salary: Map<number, ISalaryInfo>;
    levelsCount: number;
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
        const { currentDepartmentMeds, salary, levelsCount, user } = this.props;

        return (
            <>
                <SalaryHeader levelsCount={levelsCount} />
                {
                    currentDepartmentMeds.map(medicine => (
                        <SalaryRow
                            key={medicine.id}
                            levelsCount={levelsCount}
                            userLevel={user ? user.level : 0}
                            medicine={medicine}
                            salary={salary}
                        />
                    ))
                }
            </>
        );
    }
}

export default withStyles(styles)(UserContent);
