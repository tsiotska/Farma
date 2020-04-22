import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Typography, Button } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';

const styles = (theme: any) => createStyles({
    root: {
        // padding: 20
    },
    text: {},
    button: {
        color: theme.palette.primary.green.main,
        borderColor: theme.palette.primary.green.main,
        backgroundColor: 'white',
        width: 150
    }
});

interface IProps extends WithStyles<typeof styles> {

}

@observer
class Header extends Component<IProps> {
    render() {
        const { classes } = this.props;

        return (
            <Grid className={classes.root} justify='space-between' alignItems='center' container>
                <Typography className={classes.text} variant='h5' color='textPrimary'>
                    Лікарі
                </Typography>
                <Button variant='outlined' className={classes.button}>
                    Додати лікаря
                </Button>
            </Grid>
        );
    }
}

export default withStyles(styles)(Header);
