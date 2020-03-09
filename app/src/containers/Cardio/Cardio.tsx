import React, { Component } from 'react';
import { createStyles, WithStyles } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import DepartmentContent from '../DepartmentContent';
import { RouteComponentProps } from 'react-router-dom';

const styles = (theme: any) => createStyles({});

interface IProps extends WithStyles<typeof styles> {
    setCurrentDepartment?: (departmentName: string) => void;
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
class Cardio extends Component<RouteComponentProps<{}> & IProps> {
    componentDidMount() {
        this.props.setCurrentDepartment('cardiology');
    }

    render() {
        const { match: { path }} = this.props;
        return (
            <DepartmentContent currentPath={path} />
        );
    }
}

export default withStyles(styles)(Cardio);
