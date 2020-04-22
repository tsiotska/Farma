import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Typography } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';

const styles = (theme: any) => createStyles({
    column: {
        minWidth: 120
    },
    root: {
        marginTop: 16,
        paddingLeft: 5,
        marginBottom: 12
    }
});

interface IProps extends WithStyles<typeof styles> {

}

@observer
class ListHeader extends Component<IProps> {
    render() {
        const { classes } = this.props;

        return (
            <Grid className={classes.root} alignItems='center' wrap='nowrap' container>
                <Grid xs={3} container item>
                    <Typography variant='body2' color='textSecondary'>
                        ЛПУ/Аптека
                    </Typography>
                </Grid>
                <Grid xs={3} container item>
                    <Typography variant='body2' color='textSecondary'>
                        ПІБ лікаря
                    </Typography>
                </Grid>
                <Grid className={classes.column} xs container item>
                    <Typography variant='body2' color='textSecondary'>
                        Спецільність
                    </Typography>
                </Grid>
                <Grid className={classes.column} xs container item>
                    <Typography variant='body2' color='textSecondary'>
                        Телефон
                    </Typography>
                </Grid>
                <Grid className={classes.column} xs container item>
                    <Typography variant='body2' color='textSecondary'>
                        № карти
                    </Typography>
                </Grid>
                <Grid xs={3} container item>
                    <Typography variant='body2' color='textSecondary'>
                        Депозит
                    </Typography>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(ListHeader);
