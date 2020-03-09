import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import withTranslation from '../../components/hoc/withTranslations';

import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { AppBar, Typography, Paper } from '@material-ui/core';
import { History } from 'history';
import ProfilePreview from '../../components/ProfilePreview';
import DepartmentNav from '../../components/DepartmentNav';
import { IDepartment } from '../../interfaces/IDepartment';

const styles = (theme: any) => createStyles({
    root: {
        flexDirection: 'row',
        height: 70,
        display: 'flex',
        alignItems: 'center',
        padding: 20
    },
});

interface IProps extends WithStyles<typeof styles> {
    t?: (key: string) => string;
    history?: History;
    currentDepartment?: IDepartment;
}

@withTranslation
@inject(({
    appState: {
        departmentsStore: {
            currentDepartment
        }
    }
}) => ({
    currentDepartment
}))
@observer
export class Header extends Component<IProps, {}> {
    get title(): string {
        const { currentDepartment } = this.props;

        return currentDepartment
        ? currentDepartment.name
        : null;
    }

    render() {
        const { classes } = this.props;

        return (
            <>
                <Paper>
                    <AppBar elevation={0} color='primary' position='relative' className={classes.root}>
                        <Typography variant='h5'>
                            { this.title }
                        </Typography>
                    </AppBar>
                    <ProfilePreview />
                </Paper>
                <DepartmentNav />
            </>
        );
    }
}

export default withStyles(styles)(Header);
