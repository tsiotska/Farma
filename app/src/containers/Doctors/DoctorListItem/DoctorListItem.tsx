import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    Grid,
    Button,
    IconButton,
    Typography,
    Popover
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import cx from 'classnames';

import { IDoctor } from '../../../interfaces/IDoctor';
import { observable, toJS } from 'mobx';
import LoadingMask from '../../../components/LoadingMask';
import CommitBadge from '../../../components/CommitBadge';
import { EDIT_DEPOSIT_MODAL } from '../../../constants/Modals';
import { EDIT_DOC_MODAL } from '../../../constants/Modals';
import { IDeletePopoverSettings } from '../../../stores/UIStore';
import DeleteDocButton from '../DeleteDocButton';
import { PERMISSIONS } from '../../../constants/Permissions';
import { IWithRestriction } from '../../../interfaces';
import { withRestriction } from '../../../components/hoc/withRestriction';

const styles = (theme: any) => createStyles({
    root: {
        marginBottom: 1,
        minHeight: 48,
        padding: '5px 0 5px 8px',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: ({ unconfirmed }: any) => unconfirmed
            ? theme.palette.primary.blue
            : theme.palette.primary.white,
        '& > .MuiGrid-container': {
            overflowX: 'hidden'
        },
        color: ({ unconfirmed }: any) => unconfirmed
            ? theme.palette.primary.white
            : theme.palette.primary.gray.main,
        '&:first-of-type': {
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
        },
        '&:last-of-type': {
            borderBottomLeftRadius: 2,
            borderBottomRightRadius: 2,
        }
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
    removeIcon: {
        color: ({ unconfirmed }: any) => unconfirmed
            ? 'white'
            : theme.palette.primary.gray.light
    },
    confirmButton: {
        color: 'white',
        borderColor: 'white',
        height: 36,
        padding: '0 8px',
        marginLeft: 'auto',
        marginRight: 20,
        minWidth: 100
    },
    infoIcon: {
        alignSelf: 'center'
    },
    deposit: {
        width: '100%',
        color: '#647cfe',
        '&:hover': {
            cursor: 'pointer'
        }
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
        },
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    cell: {
        minWidth: 120
    },
    colorGreen: {
        color: theme.palette.primary.green.main
    }
});

interface IProps extends WithStyles<typeof styles>, IWithRestriction {
    doctor: IDoctor;
    deleteHandler: (doc: IDoctor) => (confirm: boolean) => void;
    unconfirmed?: boolean;
    showBadges?: boolean;
    confirmHandler?: (doc: IDoctor) => void;
    openModal?: (modalName: string, payload: any) => void;
    openDelPopper?: (settings: IDeletePopoverSettings) => void;
    rootRef?: any;
    highlight?: boolean;
    removeHighlighting?: () => void;
}

@inject(({
             appState: {
                 uiStore: {
                     openModal,
                     openDelPopper,
                     clearSorting,
                     clearFilters
                 }
             }
         }) => ({
    openDelPopper,
    openModal,
    clearSorting,
    clearFilters
}))
@withRestriction([PERMISSIONS.EDIT_AGENT])
@observer
class DoctorListItem extends Component<IProps> {
    @observable isLoadingConfirmation: boolean = false;
    timeout: any;

    confirmClickHandler = async () => {
        const { confirmHandler, doctor } = this.props;
        if (!confirmHandler) return;
        this.isLoadingConfirmation = true;
        await confirmHandler(doctor);
        this.isLoadingConfirmation = false;
    }

    depositModalHandler = () => {
        const { openModal, doctor } = this.props;
        openModal(EDIT_DEPOSIT_MODAL, doctor);
    }

    editClickHandler = () => {
        const { doctor, openModal } = this.props;
        openModal(EDIT_DOC_MODAL, doctor);
    }

    deleteClickHandler = ({ currentTarget }: any) => {
        const { openDelPopper, deleteHandler, doctor } = this.props;
        openDelPopper({
            anchorEl: currentTarget,
            callback: deleteHandler(doctor),
            name: 'deleteDoc'
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
            showBadges,
            classes,
            rootRef,
            isAllowed,
            highlight,
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
                address
            }
        } = this.props;

        return (
            <Grid ref={rootRef} className={classes.root} alignItems='center' wrap='nowrap' container>
                {
                    unconfirmed && showBadges &&
                    <Grid className={cx(classes.cell, classes.badgesContainer)}>
                        <CommitBadge className={classes.badge} title='ФФМ' committed={FFMCommit}/>
                        <CommitBadge className={classes.badge} title='РМ' committed={RMCommit}/>
                    </Grid>
                }
                <Grid xs className={classes.cell} container item>
                    <Typography variant='body2' className={classes.text}>
                        {LPUName || '-'}
                    </Typography>
                    <Typography className={classes.text}>
                        {address}
                    </Typography>
                </Grid>
                <Grid xs className={classes.cell} container item>
                    <Typography variant='body2' className={cx(classes.text, { highlight: !!highlight })}>
                        {name || '-'}
                    </Typography>
                </Grid>
                <Grid xs={1} className={classes.cell} container item>
                    <Typography variant='body2' className={classes.text}>
                        {specialty || '-'}
                    </Typography>
                </Grid>
                <Grid xs={1} className={classes.cell} container item>
                    <Typography variant='body2' className={cx(classes.phoneContainer, classes.text)}>
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
                <Grid xs={1} className={classes.cell} container item>
                    <Typography variant='body2' className={classes.text}>
                        {card || '-'}
                    </Typography>
                </Grid>
                <Grid xs={3} className={classes.cell} alignItems='center' wrap='nowrap' container item>
                    {
                        (unconfirmed && isAllowed)
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
                                <Typography
                                    variant='body2'
                                    onClick={this.depositModalHandler}
                                    className={cx(classes.deposit)}>
                                    {deposit || 0}
                                </Typography>
                                {
                                    isAllowed &&
                                    <IconButton onClick={this.editClickHandler} className={classes.colorGreen}>
                                        <EditOutlinedIcon fontSize='small'/>
                                    </IconButton>
                                }
                            </>
                    }
                    {
                        <DeleteDocButton
                            onClick={this.deleteClickHandler}
                            className={classes.removeIcon}
                        />
                    }
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(DoctorListItem);
