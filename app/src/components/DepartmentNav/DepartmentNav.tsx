import React, { Component } from 'react';
import { createStyles, WithStyles, Grid } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { NavLink } from 'react-router-dom';

const styles = (theme: any) => createStyles({
    root: {
        margin: '20px 0',
        padding: '0 16px'
    },
    link: {
        textDecoration: 'none',
        outline: 'none',
        padding: '10px 20px',
        transition: '0.3s',
        fontSize: theme.typography.pxToRem(16),
        minWidth: 100,
        color: theme.palette.primary.gray.light,
        borderRadius: 30,
        textAlign: 'center'
    },
    active: {
        color: theme.palette.primary.white,
        backgroundColor: theme.palette.primary.green.main
    }
});

interface ILink {
    title: string;
    path: string;
}

interface IProps extends WithStyles<typeof styles> {
    currentDepartmentId?: number;
    userLinks: ILink[];
}

@inject(({
    appState: {
        departmentsStore: {
            currentDepartmentId
        }
    }
}) => ({
    currentDepartmentId
}))
@observer
class DepartmentNav extends Component<IProps> {
    render() {
        const { classes, currentDepartmentId, userLinks } = this.props;

        return (
            <Grid className={classes.root} alignItems='center' container>
                {
                    userLinks.map(({ title, path }) => (
                        <NavLink
                            key={path}
                            to={{ pathname: path.replace(':departmentId', `${currentDepartmentId}`) }}
                            className={classes.link}
                            activeClassName={classes.active}>
                            { title }
                        </NavLink>
                    ))
                }
            </Grid>
        );
    }
}

export default withStyles(styles)(DepartmentNav);
