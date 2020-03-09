import React, { Component } from 'react';
import { createStyles, WithStyles } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import DepartmentContent from '../DepartmentContent';
import { RouteComponentProps } from 'react-router-dom';

const styles = (theme: any) => createStyles({});

interface IProps extends WithStyles<typeof styles> {

}

@observer
class Cardio extends Component<RouteComponentProps<{}> & IProps> {
    render() {
        const { match: { path }} = this.props;
        return (
            <DepartmentContent currentPath={path} />
        );
    }
}

export default withStyles(styles)(Cardio);