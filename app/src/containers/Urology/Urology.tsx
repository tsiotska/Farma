import React, { Component } from 'react';
import { createStyles, WithStyles } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { RouteComponentProps } from 'react-router-dom';
import DepartmentContent from '../DepartmentContent';

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
class Urology extends Component<RouteComponentProps<{}> & IProps> {
    componentDidMount() {
        this.props.setCurrentDepartment('urology');
    }

    render() {
        const { match: { path }} = this.props;
        return (
            <DepartmentContent currentPath={path} />
        );
    }
}

export default withStyles(styles)(Urology);
