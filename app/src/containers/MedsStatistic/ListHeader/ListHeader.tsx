import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    Grid,
    Checkbox,
    Typography
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { computed } from 'mobx';
import { IMedicine } from '../../../interfaces/IMedicine';

const styles = (theme: any) => createStyles({
    root: {
        '& *': {
            lineHeight: 1
        },
        marginBottom: 8,
        paddingRight: ({ paddingRight }: any) => paddingRight
    },
    checkbox: {
        marginRight: 5,
        padding: 0
    }
});

interface IProps extends WithStyles<typeof styles> {
    departmentId: number;
    meds: IMedicine[];
    toggleAllMedsDisplayStatus?: (departmentId: number) => void;
    medsDisplayStatus?: Map<number, boolean>;
    paddingRight: number;
}

@inject(({
    appState: {
        salesStore: {
            toggleAllMedsDisplayStatus,
            medsDisplayStatus
        }
    }
}) => ({
    toggleAllMedsDisplayStatus,
    medsDisplayStatus
}))
@observer
class ListHeader extends Component<IProps> {
    @computed
    get isAllMedsDisplayed(): boolean {
        const { medsDisplayStatus, meds } = this.props;
        if (!meds.length) return false;
        return meds.every(({ id }) => medsDisplayStatus.get(id) === true);
    }

    toggleAllClickHandler = () => {
        const { toggleAllMedsDisplayStatus, departmentId } = this.props;
        toggleAllMedsDisplayStatus(departmentId);
    }

    render() {
        const { classes } = this.props;

        return (
            <Grid className={classes.root} alignItems='center' wrap='nowrap' container>
                <Checkbox
                    checked={this.isAllMedsDisplayed}
                    onChange={this.toggleAllClickHandler}
                    className={classes.checkbox}
                    size='small'
                    color='default' />

                <Grid xs={6} container item>
                    <Typography variant='subtitle1' color='textSecondary'>
                        Препарати
                    </Typography>
                </Grid>
                <Grid xs container item>
                    <Typography variant='subtitle1' color='textSecondary'>
                        ККД, %
                    </Typography>
                </Grid>
                <Grid xs container item>
                    <Typography variant='subtitle1' color='textSecondary'>
                        Всього
                    </Typography>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(ListHeader);
