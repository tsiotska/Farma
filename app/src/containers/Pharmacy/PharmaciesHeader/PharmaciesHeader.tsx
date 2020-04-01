import React, { Component } from 'react';
import { WithStyles, createStyles, Grid, Typography } from '@material-ui/core';
import { observer } from 'mobx-react';
import cx from 'classnames';

export const pharmaciesHeaderStyles = createStyles({
    text: {},
    cell: {},
    name: {},
    region: {},
    oblast: {},
    city: {},
    address: {},
    phone: {}
});

export interface IPharmaciesHeaderProps extends WithStyles<typeof pharmaciesHeaderStyles> {}

@observer
class PharmaciesHeader extends Component<IPharmaciesHeaderProps> {
    render() {
        const { classes } = this.props;

        return (
            <Grid container alignItems='center'>
                <Grid className={cx(classes.cell, classes.name)} xs alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        Назва
                    </Typography>
                </Grid>
                <Grid className={cx(classes.cell, classes.region)} xs={1} alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        Регіон
                    </Typography>
                </Grid>
                <Grid className={cx(classes.cell, classes.oblast)} xs={1} alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        Область
                    </Typography>
                </Grid>
                <Grid className={cx(classes.cell, classes.city)} xs={1} alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        Місто
                    </Typography>
                </Grid>
                <Grid className={cx(classes.cell, classes.address)} xs alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        Адрес
                    </Typography>
                </Grid>
                <Grid className={cx(classes.cell, classes.phone)} xs={1} alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        Телефон
                    </Typography>
                </Grid>
            </Grid>
        );
    }
}

export default PharmaciesHeader;
