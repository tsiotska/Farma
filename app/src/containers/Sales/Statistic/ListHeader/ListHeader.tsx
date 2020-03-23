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
    toggleAllMedsDisplayStatus?: () => void;
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
    get isAllMedsDisplayed(): boolean {
        const { medsDisplayStatus } = this.props;
        if (!medsDisplayStatus.size) return false;
        return [...medsDisplayStatus.values()].every(x => !!x);
    }

    render() {
        const { classes, toggleAllMedsDisplayStatus } = this.props;

        return (
            <Grid className={classes.root} alignItems='center' wrap='nowrap' container>
                <Checkbox
                    checked={this.isAllMedsDisplayed}
                    onChange={toggleAllMedsDisplayStatus}
                    className={classes.checkbox}
                    size='small'
                    color='default' />

                <Grid xs={6} container item>
                    <Typography variant='subtitle1' color='textSecondary'>
                        Препараты
                    </Typography>
                </Grid>
                <Grid xs container item>
                    <Typography variant='subtitle1' color='textSecondary'>
                        КПД, %
                    </Typography>
                </Grid>
                <Grid xs container item>
                    <Typography variant='subtitle1' color='textSecondary'>
                        Всего
                    </Typography>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(ListHeader);
