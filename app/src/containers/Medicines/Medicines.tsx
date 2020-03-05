import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Typography, Button } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import ListHeader from './ListHeader';
import List from './List';

const styles = (theme: any) => createStyles({
    root: {
        padding: '0 20px'
    },
    addButton: {
        backgroundColor: '#868698',
        color: theme.palette.primary.main,
        '&:hover': {
            backgroundColor: '#717186',
        }
    }
});

interface IProps extends WithStyles<typeof styles> {

}

@observer
class Medicines extends Component<IProps> {
    render() {
        const { classes } = this.props;

        return (
            <Grid className={classes.root} direction='column' container>
                <Grid alignItems='center' justify='space-between' container>
                    <Typography variant='h5' color='textPrimary'>
                        Препараты
                    </Typography>
                    <Button className={classes.addButton} variant='contained'>
                        Добавить препарат
                    </Button>
                </Grid>

                <ListHeader />
                <List />
            </Grid>
        );
    }
}

export default withStyles(styles)(Medicines);
