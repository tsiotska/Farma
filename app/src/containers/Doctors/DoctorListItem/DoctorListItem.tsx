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
import cx from 'classnames';
import { observable } from 'mobx';
import { IDoctor } from '../../../interfaces/IDoctor';
import LoadingMask from '../../../components/LoadingMask';
import { EDIT_DOC_MODAL } from '../../../constants/Modals';
import { IDeletePopoverSettings } from '../../../stores/UIStore';

const styles = (theme: any) => createStyles({
    root: {
        backgroundColor: ({ unconfirmed }: any) => unconfirmed
            ? theme.palette.primary.blue
            : 'white',
        marginBottom: 1,
        padding: '5px 0 5px 5px',
        '& > .MuiGrid-container': {
            overflowX: 'hidden'
        },
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
        textTransform: 'capitalize',
        color: ({ unconfirmed }: any) => unconfirmed
            ? 'white'
            : theme.palette.primary.gray.main,
        paddingRight: 5,
        '&.highlight': {
            textDecoration: 'underline',
            fontWeight: 'bolder'
        }
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
        color: '#7B8FFE'
    }
});

interface IProps extends WithStyles<typeof styles> {
    doctor: IDoctor;
    confirmationCallback: (success: boolean) => void;
    deleteHandler: (doc: IDoctor) => (confirm: boolean) => void;
    unconfirmed?: boolean;
    acceptAgent?: (doctor: IDoctor) => boolean;
    openModal?: (modalName: string, payload: any) => void;
    openDelPopper?: (settings: IDeletePopoverSettings) => void;
    rootRef?: any;
    highlight?: boolean;
    removeHighlighting?: () => void;
}

@inject(({
    appState: {
        departmentsStore: {
            acceptAgent
        },
        uiStore: {
            openModal,
            openDelPopper
        }
    }
}) => ({
    openDelPopper,
    acceptAgent,
    openModal
}))
@observer
class DoctorListItem extends Component<IProps> {
    @observable isLoadingConfirmation: boolean = false;
    timeout: any;

    confirmClickHandler =  async () => {
        const { acceptAgent, doctor, unconfirmed, confirmationCallback } = this.props;
        if (!unconfirmed) return;
        this.isLoadingConfirmation = true;
        const isConfirmed = await acceptAgent(doctor);
        this.isLoadingConfirmation = false;
        confirmationCallback(isConfirmed);
    }

    editClickHandler = () => {
        const { doctor, openModal } = this.props;
        openModal(EDIT_DOC_MODAL, doctor);
    }

    deleteClickHandler = ({ currentTarget }: any) => {
        const { openDelPopper, deleteHandler, doctor } = this.props;
        openDelPopper({
            anchorEl: currentTarget,
            callback: deleteHandler(doctor)
        });
    }

    componentDidMount() {
        const { highlight, removeHighlighting } = this.props;
        if (highlight) {
            this.timeout = setTimeout(removeHighlighting, 2000);
        }
    }

    componentWillUnmount() {
        if (this.timeout) window.clearTimeout(this.timeout);
    }

    render() {
        const {
            unconfirmed,
            classes,
            rootRef,
            highlight,
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
            <Grid ref={rootRef} className={classes.root} alignItems='center' wrap='nowrap' container>
                <Grid xs={3} container item>
                    <Typography variant='body2' className={classes.text}>
                        { LPUName || '-' }
                    </Typography>
                </Grid>
                <Grid xs={3} container item>
                    <Typography variant='body2' className={cx(classes.text, { highlight: !!highlight })}>
                        { name || '-' }
                    </Typography>
                </Grid>
                <Grid xs className={classes.column} container item>
                    <Typography variant='body2' className={classes.text}>
                        { specialty || '-'}
                    </Typography>
                </Grid>
                <Grid xs className={classes.column} container item>
                    <Typography variant='body2' className={cx(classes.phoneContainer, classes.text)}>
                        {
                            !mobilePhone && !workPhone
                            ? '-'
                            : <>
                                <span className={classes.phone}>{ mobilePhone }</span>
                                <span className={classes.phone}>{ workPhone }</span>
                              </>
                        }
                    </Typography>
                </Grid>
                <Grid xs className={classes.column} container item>
                    <Typography variant='body2' className={classes.text}>
                        { card || '-'}
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
                                    ? <LoadingMask size={20} />
                                    : 'Підтвердити'
                                }
                          </Button>
                        : <>
                            <Typography variant='body2' className={cx(classes.deposit, classes.text)}>
                                { deposit || 0 }
                            </Typography>
                            <IconButton onClick={this.editClickHandler}>
                                <Edit className={classes.editIcon} fontSize='small' />
                            </IconButton>
                          </>
                    }
                    <IconButton onClick={this.deleteClickHandler}>
                        <Delete
                            className={classes.removeIcon}
                            fontSize='small'
                        />
                    </IconButton>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(DoctorListItem);
