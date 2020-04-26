import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Typography } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';

const styles = (theme: any) => createStyles({
    root: {},
    text: {
        fontSize: 14,
        color: '#aaa',
        fontFamily: 'Source Sans Pro SemiBold',
        textAlign: 'center'
    },
    textBold: {
        fontSize: 16,
        color: '#868698',
        fontFamily: 'Source Sans Pro SemiBold',
        textAlign: 'left',
    },
    constantCol: {
        width: 300
    }
});

interface IProps extends WithStyles<typeof styles> {

}

@observer
class ListHeader extends Component<IProps> {
    render() {
        const { classes } = this.props;
        return (
            <Grid className={classes.root} wrap='nowrap' alignItems='flex-end' container>
                <Grid className={classes.constantCol} alignItems='flex-end' container item>
                    <Typography className={classes.textBold}>
                        Регіональні менеджери
                    </Typography>
                </Grid>
                <Grid xs justify='center' alignItems='flex-end' container item>
                    <Typography className={classes.text}>
                        Посада
                    </Typography>
                </Grid>
                <Grid xs justify='center' alignItems='flex-end' container item>
                    <Typography className={classes.text}>
                        Факт. сума
                    </Typography>
                </Grid>
                <Grid xs justify='center' alignItems='flex-end' container item>
                    <Typography className={classes.text}>
                        Рівень
                    </Typography>
                </Grid>
                <Grid xs justify='center' alignItems='flex-end' container item>
                    <Typography className={classes.text}>
                        Зарплата
                    </Typography>
                </Grid>
                <Grid xs justify='center' alignItems='flex-end' container item>
                    <Typography className={classes.text}>
                        Додаткові витрати
                    </Typography>
                </Grid>
                <Grid xs justify='center' alignItems='flex-end' container item>
                    <Typography className={classes.text}>
                        KPI Звіти
                    </Typography>
                </Grid>
                <Grid xs justify='center' alignItems='flex-end' container item>
                    <Typography className={classes.text}>
                        Бонус
                    </Typography>
                </Grid>
                <Grid xs justify='center' alignItems='flex-end' container item>
                    <Typography className={classes.text}>
                        Всього
                    </Typography>
                </Grid>

            </Grid>
        );
    }
}

export default withStyles(styles)(ListHeader);
