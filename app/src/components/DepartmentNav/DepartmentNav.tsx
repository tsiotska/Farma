import React, { Component } from 'react';
import { createStyles, WithStyles, Grid } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { NavLink, withRouter } from 'react-router-dom';
import { match as Match } from 'react-router';

const styles = (theme: any) => createStyles({
    root: {
        margin: '20px 0'
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
}

@withRouter
@observer
class DepartmentNav extends Component<IProps> {
    readonly links: ILink[] = [
        { title: 'Продажи', pathname: '/sales' },
        { title: 'Баллы', pathname: '/marks' },
        { title: 'Заработная  плата', pathname: '/salary' },
        { title: 'Сотрудники', pathname: '/workers' },
        { title: 'Препараты', pathname: '/medicines' },
        { title: 'ЛПУ/Аптеки', pathname: '/stores' },
    ];

    getUrl = (link: string): string => `${this.props.match.path}${link}`;

    render() {
        const { classes } = this.props;

        return (
            <Grid className={classes.root} alignItems='center' container>
                {
                    this.links.map(({ title, pathname }) => (
                        <NavLink
                            key={pathname}
                            to={this.getUrl(pathname)}
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
