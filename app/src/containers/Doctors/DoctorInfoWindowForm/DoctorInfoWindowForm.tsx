import React, { Component } from 'react';
import { Card, CardContent, createStyles, Grid, Typography, WithStyles } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';

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

@observer
class DoctorInfoWindowForm extends Component<IProps> {

    render() {
        const { classes, phoneNumber, address } = this.props;

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

export default withStyles(styles)(DoctorInfoWindowForm);
