import React, { Component } from 'react';
import { createStyles, WithStyles, Grid } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { NavLink, withRouter } from 'react-router-dom';
import { match as Match } from 'react-router';
import { SALES_ROUTE, MARKS_ROUTE, SALARY_ROUTE, WORKERS_ROUTE, MEDICINES_ROUTE, PHARMACY_ROUTE } from '../../constants/Router';
import { IRoleContent, adminContent, FFMContent, RMContent, MAContent } from '../../containers/DepartmentContent/RolesPresets';
import { ADMIN, FIELD_FORCE_MANAGER, REGIONAL_MANAGER, MEDICAL_AGENT } from '../../constants/Roles';

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
    pathname: string;
}

interface IProps extends WithStyles<typeof styles> {
    match?: Match<any>;
    role?: string;
}

@inject(({
    appState: {
        userStore: {
            role
        }
    }
}) => ({
    role
}))
@withRouter
@observer
class DepartmentNav extends Component<IProps> {
    get userLinks(): IRoleContent[] {
        switch (this.props.role) {
            case ADMIN: return adminContent;
            case FIELD_FORCE_MANAGER: return FFMContent;
            case REGIONAL_MANAGER: return RMContent;
            case MEDICAL_AGENT: return MAContent;
            default: return [];
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <Grid className={classes.root} alignItems='center' container>
                {
                    this.userLinks.map(({ title, path }) => (
                        <NavLink
                            key={path}
                            to={path}
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
