import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    Checkbox,
    Grid,
    Typography
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';

import { IMedicine } from '../../../../interfaces/IMedicine';
import { DisplayMode } from '../../../../stores/SalesStore';
import { IMedsSalesStat } from '../../../../interfaces/ISalesStat';

const styles = (theme: any) => createStyles({
    root: {
        marginBottom: 8,
        '&:last-of-type': {
            marginBottom: 0,
        }
    },
    checkbox: {
        marginRight: 5,
        padding: 0
    },
    withColor: {
        position: 'relative',
        paddingLeft: 12,
        display: 'flex',
        alignItems: 'center',
        '&::before': {
            content: '" "',
            position: 'absolute',
            width: 10,
            height: 10,
            borderRadius: 2,
            marginLeft: -12,
            backgroundColor: ({ medicament }: any) => (medicament && medicament.color)
            ? medicament.color
            : 'transparent'
        }
    }
});

interface IProps extends WithStyles<typeof styles> {
    stat: IMedsSalesStat;
    medicament: IMedicine;
    displayMode: DisplayMode;
    displayed: boolean;
    toggleMedsDisplayStatus?: (id: number) => void;
}

@inject(({
    appState: {
        salesStore: {
            toggleMedsDisplayStatus
        }
    }
}) => ({
    toggleMedsDisplayStatus
}))
@observer
class ListItem extends Component<IProps> {
    get kpd(): string {
        const { stat } = this.props;
        return stat
        ? `${stat.kpd}`
        : '-';
    }

    get total(): string {
        const { stat, displayMode } = this.props;

        const propName = displayMode === 'currency'
        ? 'money'
        : 'amount';

        const mantisLength = displayMode === 'currency'
        ? 2
        : 0;

        return stat
        ? stat[propName].toFixed(mantisLength)
        : '-';
    }

    get medId(): number {
        const { stat, medicament } = this.props;
        if (stat) return stat.medId;
        if (medicament) return medicament.id;
        return -1;
    }

    onCheckboxChange = () => this.props.toggleMedsDisplayStatus(this.medId);

    render() {
        const {
            classes,
            medicament,
            displayed,
        } = this.props;

        if (!medicament) return null;

        return (
            <Grid className={classes.root} wrap='nowrap' alignItems='center' container>
                <Checkbox
                    onChange={this.onCheckboxChange}
                    checked={displayed}
                    className={classes.checkbox}
                    size='small'
                    color='default'
                />

                <Grid xs={6} item>
                    <Typography className={classes.withColor} variant='subtitle1'>
                        { medicament.name }
                    </Typography>
                </Grid>
                <Grid xs item>
                    <Typography variant='subtitle1'>
                        { this.kpd }
                    </Typography>
                </Grid>
                <Grid xs item>
                    <Typography variant='subtitle1'>
                        { this.total }
                    </Typography>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(ListItem);
