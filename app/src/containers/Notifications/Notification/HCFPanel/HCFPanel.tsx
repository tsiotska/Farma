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
    confirmButton: {
        padding: '2px 0',
        margin: '0 4px',
        minWidth: 95,
        color: theme.palette.primary.green.main,
        borderColor: theme.palette.primary.green.main
    },
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
                <Grid xs={3} alignItems='center' container item>
                    <>
                        <CommitBadge className={classes.badge} title='ФФМ' committed={ffmConfirm} />
                        <CommitBadge className={classes.badge} title='РМ' committed={rmConfirm} />
                    </>
                    <Typography className={classes.text} variant='body2'>
                        { name || '-' }
                    </Typography>
                </Grid>
                <Grid xs alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        { this.regionName }
                    </Typography>
                </Grid>
                <Grid xs alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        { oblast || '-' }
                    </Typography>
                </Grid>
                <Grid xs alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        { this.cityName }
                    </Typography>
                </Grid>
                <Grid xs alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        { address || '-' }
                    </Typography>
                </Grid>
                <Grid
                    className={classes.phone}
                    xs={1}
                    wrap='nowrap'
                    alignItems='center'
                    container
                    item>
                    <Typography className={classes.text} variant='body2'>
                        <span>{ phone1 || '-' }</span>
                        <span>{ phone2 || '-' }</span>
                    </Typography>
                </Grid>
                <Button variant='outlined' className={classes.confirmButton}>
                    Підтвердити
                </Button>
                <IconButton>
                    <Delete />
                </IconButton>
            </>
        );
    }
}

export default withStyles(styles)(HCFPanel);
