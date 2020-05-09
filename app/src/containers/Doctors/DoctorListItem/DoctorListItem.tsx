import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    Grid,
    Button,
    IconButton,
    Typography
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { Delete, Edit } from '@material-ui/icons';
import { IDoctor } from '../../../interfaces/IDoctor';
import cx from 'classnames';
import { observable, toJS } from 'mobx';
import LoadingMask from '../../../components/LoadingMask';
import EditDepositModal from '../EditDepositModal';
import { ADD_MEDICINE_MODAL, EDIT_DEPOSIT_MODAL } from '../../../constants/Modals';

const styles = (theme: any) => createStyles({
    root: {
        backgroundColor: ({ unconfirmed }: any) => unconfirmed
            ? theme.palette.primary.blue
            : 'white',
        marginBottom: 1,
        padding: '5px 0 5px 5px',
        '& > .MuiGrid-container': {
            overflowX: 'hidden'
        }
    },
    column: {
        minWidth: 120
    },
    phone: {},
    phoneContainer: {
        display: 'flex',
        flexDirection: 'column'
    },
    editIcon: {
        color: theme.palette.primary.green.main
    },
    removeIcon: {
        color: ({ unconfirmed }: any) => unconfirmed
            ? 'white'
            : theme.palette.primary.gray.light
    },
    text: {
        color: ({ unconfirmed }: any) => unconfirmed
            ? 'white'
            : theme.palette.primary.gray.main,
        paddingRight: 5
    },
    confirmButton: {
        color: 'white',
        borderColor: 'white',
        height: 36,
        padding: '0 8px',
        minWidth: 100
    },
    deposit: {
        width: '100%',
        color: '#647CFE',
        '&:hover': {
            cursor: 'pointer'
        }
    }
});

interface IProps extends WithStyles<typeof styles> {
    doctor: IDoctor;
    confirmationCallback: (success: boolean) => void;
    unconfirmed?: boolean;
    acceptAgent?: (doctor: IDoctor) => boolean;
    openModal?: (modalName: string, payload: any) => void;
}

@inject(({
             appState: {
                 uiStore: {
                     openModal,
                 },
                 departmentsStore: {
                     acceptAgent
                 }
             }
         }) => ({
    openModal,
    acceptAgent
}))
@observer
class DoctorListItem extends Component<IProps> {
    @observable isLoadingConfirmation: boolean = false;

    confirmClickHandler = async () => {
        const { acceptAgent, doctor, unconfirmed, confirmationCallback } = this.props;
        if (!unconfirmed) return;
        this.isLoadingConfirmation = true;
        const isConfirmed = await acceptAgent(doctor);
        this.isLoadingConfirmation = false;
        confirmationCallback(isConfirmed);
    }

    depositModalHandler = () => {
        const { openModal, doctor} = this.props;
        console.log('doctor');
        console.log(toJS(doctor));
        openModal(EDIT_DEPOSIT_MODAL, doctor);
    }

    render() {
        const {
            unconfirmed,
            classes,
            doctor: {
                LPUName,
                name,
                specialty,
                mobilePhone,
                workPhone,
                deposit,
                card,
            }
        } = this.props;

        return (
            <Grid className={classes.root} alignItems='center' wrap='nowrap' container>
                <Grid xs={3} container item>
                    <Typography className={classes.text}>
                        {LPUName || '-'}
                    </Typography>
                </Grid>
                <Grid xs={3} container item>
                    <Typography className={classes.text}>
                        {name || '-'}
                    </Typography>
                </Grid>
                <Grid xs className={classes.column} container item>
                    <Typography className={classes.text}>
                        {specialty || '-'}
                    </Typography>
                </Grid>
                <Grid xs className={classes.column} container item>
                    <Typography className={cx(classes.phoneContainer, classes.text)}>
                        {
                            !mobilePhone && !workPhone
                                ? '-'
                                : <>
                                    <span className={classes.phone}>{mobilePhone}</span>
                                    <span className={classes.phone}>{workPhone}</span>
                                </>
                        }
                    </Typography>
                </Grid>
                <Grid xs className={classes.column} container item>
                    <Typography className={classes.text}>
                        {card || '-'}
                    </Typography>
                </Grid>
                <Grid xs={3} alignItems='center' justify='flex-end' wrap='nowrap' container item>
                    {
                        unconfirmed
                            ? <Button
                                disabled={this.isLoadingConfirmation}
                                onClick={this.confirmClickHandler}
                                className={classes.confirmButton}
                                variant='outlined'>
                                {
                                    this.isLoadingConfirmation
                                        ? <LoadingMask size={20}/>
                                        : 'Підтвердити'
                                }
                            </Button>
                            : <>
                                <Typography onClick={this.depositModalHandler}
                                            className={cx(classes.deposit, classes.text)}>
                                    {deposit || 0}
                                </Typography>
                                <IconButton>
                                    <Edit className={classes.editIcon} fontSize='small'/>
                                </IconButton>
                            </>
                    }
                    <IconButton>
                        <Delete className={classes.removeIcon} fontSize='small'/>
                    </IconButton>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(DoctorListItem);
