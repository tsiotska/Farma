import React, { Component } from 'react';
import { WithStyles, withStyles, createStyles, Grid, Typography, Button, IconButton } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { ILPU } from '../../../../interfaces/ILPU';
import { toJS } from 'mobx';
import CommitBadge from '../../../../components/CommitBadge';
import { Edit, Delete } from '@material-ui/icons';
import cx from 'classnames';
import { ILocation } from '../../../../interfaces/ILocation';

const styles = (theme: any) => createStyles({
    root: {},
    cell: {},
    name: {},
    badge: {
        marginRight: 5,
        backgroundColor: '#f2f2f2',
    },
    text: {
        lineHeight: 1.5,
        marginRight: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    region: {},
    oblast: {},
    city: {},
    address: {},
    phoneText: {},
    confirmButton: {
        padding: '2px 0',
        margin: '0 4px',
        minWidth: 95,
        color: theme.palette.primary.green.main,
        borderColor: theme.palette.primary.green.main
    },
    iconButton: {},
    icon: {},
    phone: {
        minWidth: 220
    }
});

interface IProps extends WithStyles<typeof styles> {
    hcf: ILPU;
    regions?: Map<number, ILocation>;
    cities?: Map<number, ILocation>;
}

@inject(({
    appState: {
        departmentsStore: {
            regions,
            cities
        }
    }
}) => ({
    regions,
    cities
}))
@observer
class HCFPanel extends Component<IProps> {
    get cityName(): string {
        const { cities, hcf: { city } } = this.props;
        const targetCity = cities.get(city);
        return targetCity
            ? targetCity.name
            : '-';
    }

    get regionName(): string {
        const { regions, hcf: { region } } = this.props;
        const targetRegion = regions.get(region);
        return targetRegion
            ? targetRegion.name
            : '-';
    }
    render() {
        const {
            classes,
            hcf: {
                name,
                oblast,
                address,
                phone1,
                phone2,
                ffmConfirm,
                rmConfirm
            }
        } = this.props;

        return (
            <>
                <Grid className={cx(classes.cell, classes.name)} xs={3} alignItems='center' container item>
                    <>
                        <CommitBadge className={classes.badge} title='ФФМ' committed={true} />
                        <CommitBadge className={classes.badge} title='РМ' committed={rmConfirm} />
                    </>
                    <Typography className={classes.text} variant='body2'>
                        { name }
                    </Typography>
                </Grid>
                <Grid className={cx(classes.cell, classes.region)} xs alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        { this.regionName }
                    </Typography>
                </Grid>
                <Grid className={cx(classes.cell, classes.oblast)} xs alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        { oblast }
                    </Typography>
                </Grid>
                <Grid className={cx(classes.cell, classes.city)} xs alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        { this.cityName }
                    </Typography>
                </Grid>
                <Grid className={cx(classes.cell, classes.address)} xs alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        { address }
                    </Typography>
                </Grid>
                <Grid
                    className={cx(classes.cell, classes.phone)}
                    xs={1}
                    wrap='nowrap'
                    alignItems='center'
                    container
                    item>
                    <Typography className={classes.text} variant='body2'>
                        <span className={classes.phoneText}>{ phone1 }</span>
                        <span className={classes.phoneText}>{ phone2 }</span>
                    </Typography>
                </Grid>
                <Button variant='outlined' className={classes.confirmButton}>
                    Підтвердити
                </Button>
                <IconButton className={classes.iconButton}>
                    <Delete className={classes.icon} />
                </IconButton>
            </>
        );
    }
}

export default withStyles(styles)(HCFPanel);
