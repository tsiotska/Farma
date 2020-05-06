import React, { Component } from 'react';
import { createStyles, withStyles, WithStyles, Card, CardContent, Grid, Typography } from '@material-ui/core';

const styles = (theme: any) => createStyles({
    root: {
        padding: '10px'
    },
    column: {
        '&:not(:first-child)': { marginTop: '15px' }
    }
});

interface IProps extends WithStyles<typeof styles> {
    phoneNumber?: string;
    address?: string;
}

class InfoWindow extends Component<IProps> {
    render() {
        const { classes, phoneNumber = '+38096207445', address = 'Проспект мира 8' } = this.props;

        return (
            <Card className={classes.root}>
                <CardContent>
                    <Grid className={classes.column}>
                        <Typography color='textSecondary'>
                            телефон
                        </Typography>
                        <Typography>
                            {phoneNumber}
                        </Typography>
                    </Grid>

                    <Grid className={classes.column}>
                        <Typography color='textSecondary'>
                            адрес
                        </Typography>
                        <Typography>
                            {address}
                        </Typography>
                    </Grid>
                </CardContent>
            </Card>
        );
    }
}

export default withStyles(styles)(InfoWindow);
