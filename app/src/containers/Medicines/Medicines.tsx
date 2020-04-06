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
import { ADD_MEDICINE_MODAL } from '../../constants/Modals';
import AddMedsModal from './AddMedsModal';

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
    currentDepartmentMeds?: IMedicine[];
    getAsyncStatus?: (key: string) => IAsyncStatus;
    openModal?: (modalName: string) => void;
}

@inject(({
    appState: {
        departmentsStore: {
            currentDepartmentMeds,
            getAsyncStatus
        },
        uiStore: {
            openModal
        }
    }
}) => ({
    currentDepartmentMeds,
    getAsyncStatus,
    openModal
}))
@observer
class Medicines extends Component<IProps> {
    get isMedsLoading(): boolean {
        return this.props.getAsyncStatus('loadMeds').loading;
    }

    addMedsClickHandler = () => this.props.openModal(ADD_MEDICINE_MODAL);

    render() {
        const { classes, currentDepartmentMeds } = this.props;

        return (
            <Grid className={classes.root} direction='column' container>
                <Grid className={classes.header} alignItems='center' justify='space-between' container>
                    <Typography variant='h5' color='textPrimary'>
                        Препарати
                    </Typography>
                    <Button
                        onClick={this.addMedsClickHandler}
                        className={classes.addButton}
                        variant='contained'>
                        Додати препарат
                    </Button>
                </Grid>

                <ListHeader />
                {
                    this.isMedsLoading
                    ? <LoadingMask color='primary' />
                    : <List meds={currentDepartmentMeds} />
                }

                <AddMedsModal />
            </Grid>
        );
    }
}

export default withStyles(styles)(Medicines);
