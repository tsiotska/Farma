import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Typography, LinearProgress } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IBonusInfo } from '../../interfaces/IBonusInfo';
import TabItem from './TabItem';
import { IAsyncStatus } from '../../stores/AsyncStore';
import { computed } from 'mobx';

const styles = (theme: any) => createStyles({
    root: {
        padding: '0 20px'
    },
    title: {}
});

interface IProps extends WithStyles<typeof styles> {
    loadBonuses?: () => void;
    bonuses?: IBonusInfo[];
    getAsyncStatus?: (key: string) => IAsyncStatus;
}

@inject(({
    appState: {
        userStore: {
            loadBonuses,
            bonuses,
            getAsyncStatus
        }
    }
}) => ({
    loadBonuses,
    bonuses,
    getAsyncStatus
}))
@observer
class Marks extends Component<IProps> {
    @computed
    get isBonusesLoading(): boolean {
        return this.props.getAsyncStatus('').loading;
    }

    @computed
    get isBonusDataLoading(): boolean {
        return this.props.getAsyncStatus('').loading;
    }

    componentDidMount() {
        this.props.loadBonuses();
    }

    render() {
        const { bonuses, classes } = this.props;

        return (
            <Grid className={classes.root} direction='column' container>
                <Typography variant='h5' className={classes.title}>
                    Бонуси
                </Typography>
                {
                    bonuses && bonuses.map(bonusInfo => (
                        <TabItem key={bonusInfo.id} bonus={bonusInfo} selected/>
                    ))
                }
                {
                    (this.isBonusDataLoading || this.isBonusesLoading) &&
                    <LinearProgress />
                }
            </Grid>
        );
    }
}

export default withStyles(styles)(Marks);
