import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    Grid,
    Typography,
    Button
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';

import { IMedicine } from '../../interfaces/IMedicine';
import { IAsyncStatus } from '../../stores/AsyncStore';
import LoadingMask from '../../components/LoadingMask';
import ListHeader from './ListHeader';
import List from './List';

const styles = (theme: any) => createStyles({
    root: {
        padding: '0 20px'
    },
    addButton: {
        backgroundColor: '#868698',
        color: theme.palette.primary.main,
        '&:hover': {
            backgroundColor: '#717186',
        }
    },
    header: {
        paddingLeft: 10
    }
});

interface IProps extends WithStyles<typeof styles> {
    meds?: Map<number, IMedicine>;
    getAsyncStatus?: (key: string) => IAsyncStatus;
}

@inject(({
    appState: {
        departmentsStore: {
            meds,
            getAsyncStatus
        }
    }
}) => ({
    meds,
    getAsyncStatus
}))
@observer
class Medicines extends Component<IProps> {
    get isMedsLoading(): boolean {
        return this.props.getAsyncStatus('loadMeds').loading;
    }

    render() {
        const { classes, meds } = this.props;

        return (
            <Grid className={classes.root} direction='column' container>
                <Grid className={classes.header} alignItems='center' justify='space-between' container>
                    <Typography variant='h5' color='textPrimary'>
                        Препараты
                    </Typography>
                    <Button className={classes.addButton} variant='contained'>
                        Добавить препарат
                    </Button>
                </Grid>

                <ListHeader />
                {
                    this.isMedsLoading
                    ? <LoadingMask color='primary' />
                    : <List meds={[...meds.values()]} />
                }
            </Grid>
        );
    }
}

export default withStyles(styles)(Medicines);
