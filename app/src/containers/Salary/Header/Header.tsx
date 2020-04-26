import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Typography, Button, IconButton } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import ExcelIcon from '../../../components/ExcelIcon';
import YearSelect from '../YearSelect';

const styles = (theme: any) => createStyles({
    iconButton: {
        marginLeft: 'auto'
    },
    countSalaryButton: {
        background: 'white',
        color: theme.palette.primary.green.main,
        borderColor: theme.palette.primary.green.main,
        border: '1px solid',
        padding: '8px 12px'
    },
    title: {
        fontFamily: 'Source Sans Pro SemiBold',
        color: '#555555'
    }
});

interface IProps extends WithStyles<typeof styles> {
    year: number;
    changeYear: (value: number) => void;
}

@observer
class Header extends Component<IProps> {
    render() {
        const { classes, year, changeYear } = this.props;

        return (
            <Grid alignItems='center' container>
                <Typography variant='h5' className={classes.title}>
                    Заробітня плата
                </Typography>
                <YearSelect year={year} changeYear={changeYear} />
                <Button className={classes.countSalaryButton}>
                    Розрахувати зарплату
                </Button>
                <IconButton className={classes.iconButton}>
                    <ExcelIcon />
                </IconButton>
            </Grid>
        );
    }
}

export default withStyles(styles)(Header);
