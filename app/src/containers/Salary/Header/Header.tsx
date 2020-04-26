import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Typography, Button, IconButton } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import ExcelIcon from '../../../components/ExcelIcon';

const styles = (theme: any) => createStyles({
    iconButton: {
        marginLeft: 'auto'
    }
});

interface IProps extends WithStyles<typeof styles> {

}

@observer
class Header extends Component<IProps> {
    render() {
        const { classes } = this.props;

        return (
            <Grid alignItems='center' container>
                <Typography>
                    Заробітня плата
                </Typography>
                <Button>
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
