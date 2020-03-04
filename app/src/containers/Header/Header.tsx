import React, { Component } from 'react';
import { observer } from 'mobx-react';

import withTranslation from '../../components/hoc/withTranslations';

import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { AppBar, Typography } from '@material-ui/core';
import { History } from 'history';
import { matchPath } from 'react-router-dom';
import { CARDIO_ROUTE, UROLOGY_ROUTE, NAVIGATION_ROUTES } from '../../constants/Router';

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
}

@withTranslation
@observer
export class Header extends Component<IProps, {}> {
    readonly titles = {
        [CARDIO_ROUTE]: 'Кардиология',
        [UROLOGY_ROUTE]: 'Урология'
    };

    get title(): string {
        const { history: { location: { pathname }}} = this.props;

        let currentRoute: string;
        for (const route of NAVIGATION_ROUTES) {
            currentRoute = route;
            if (!!matchPath(pathname, route)) {
                break;
            }
        }

        return currentRoute
        ? this.titles[currentRoute]
        : '';
    }

    render() {
        const { classes } = this.props;

        return (
            <AppBar elevation={0} color='primary' position='relative' className={classes.root}>
                <Typography variant='h5'>
                    { this.title }
                </Typography>
            </AppBar>
        );
    }
}

export default withStyles(styles)(Header);
