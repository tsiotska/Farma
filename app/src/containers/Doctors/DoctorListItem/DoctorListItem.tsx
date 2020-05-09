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
import { observable } from 'mobx';
import LoadingMask from '../../../components/LoadingMask';
import CommitBadge from '../../../components/CommitBadge';

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
    badgesContainer: {
        minWidth: 100,
        display: 'flex',
        flexWrap: 'nowrap'
    },
    badge: {
        '&:not(:first-child)': {
            marginLeft: 10
        }
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
        // width: '100%',
        // color: '#7B8FFE'
        '&:hover:': {
            cursor: 'pointer'
        }
    }
});

interface IProps extends WithStyles<typeof styles> {
    doctor: IDoctor;
    unconfirmed?: boolean;
    confirmHandler?: (doc: IDoctor) => void;
}

@inject(({
             appState: {
                 departmentsStore: {
                     acceptAgent
                 }
             }
         }) => ({
    acceptAgent
}))
@observer
class DoctorListItem extends Component<IProps> {
    @observable isLoadingConfirmation: boolean = false;

    confirmClickHandler = async () => {
        const { confirmHandler, doctor } = this.props;
        if (!confirmHandler) return;
        this.isLoadingConfirmation = true;
        await confirmHandler(doctor);
        this.isLoadingConfirmation = false;
    }

    render() {
        const {
            unconfirmed,
            classes,
            doctor: {
                FFMCommit,
                RMCommit,
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
                {
                    unconfirmed &&
                    <Grid className={classes.badgesContainer}>
                        <CommitBadge className={classes.badge} title='ФФМ' committed={FFMCommit}/>
                        <CommitBadge className={classes.badge} title='РМ' committed={RMCommit}/>
                    </Grid>
                }
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
                                <Typography className={cx(classes.deposit, classes.text)}>
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
