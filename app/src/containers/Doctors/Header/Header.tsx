import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Typography, Button } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { CREATE_DOC_MODAL } from '../../../constants/Modals';

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
    openModal?: (modalName: string) => void;
}

@inject(({
    appState: {
        uiStore: {
            openModal
        }
    }
}) => ({
    openModal
}))
@observer
class Header extends Component<IProps> {
    addClickHandler = () => this.props.openModal(CREATE_DOC_MODAL);

    render() {
        const { classes } = this.props;

        return (
            <Grid className={classes.root} justify='space-between' alignItems='center' container>
                <Typography className={classes.text} variant='h5' color='textPrimary'>
                    Лікарі
                </Typography>
                <Button
                    onClick={this.addClickHandler}
                    variant='outlined'
                    className={classes.button}>
                    Додати лікаря
                </Button>
            </Grid>
        );
    }
}

export default withStyles(styles)(Header);
