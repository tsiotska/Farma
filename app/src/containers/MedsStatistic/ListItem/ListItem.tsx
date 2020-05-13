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
import { IMedsSalesStat } from '../../../interfaces/ISalesStat';
import { IMedicine } from '../../../interfaces/IMedicine';
import { STAT_DISPLAY_MODE } from '../../../stores/SalesStore';
import { computed } from 'mobx';

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
    displayMode: STAT_DISPLAY_MODE;
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
    @computed
    get kpd(): string {
        const { stat } = this.props;
        return stat
        ? `${stat.kpd}`
        : '-';
    }

    @computed
    get total(): string {
        const { stat, displayMode } = this.props;

        const propName = displayMode === STAT_DISPLAY_MODE.CURRENCY
        ? 'money'
        : 'amount';

        return stat
        ? stat[propName].toFixed(0)
        : '-';
    }

    @computed
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
