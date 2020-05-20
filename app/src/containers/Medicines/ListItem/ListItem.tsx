import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    Grid,
    IconButton,
    Typography,
    Button
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';

import { IMedicine } from '../../../interfaces/IMedicine';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import ImageLoader from '../../../components/ImageLoader';
import Config from '../../../../Config';
import RestoreButton from '../RestoreButton';
import cx from 'classnames';
import { MEDICINE_EDIT_MODAL } from '../../../constants/Modals';
import { IDeletePopoverSettings } from '../../../stores/UIStore';
import RemoveButton from '../RemoveButton';
import { USER_ROLE } from '../../../constants/Roles';
import { IUser } from '../../../interfaces';

const styles = (theme: any) => createStyles({
    wrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
    },
    root: {
        minHeight: 86,
        backgroundColor: '#f5f5f5',
        padding: '0 10px',
        '&:nth-child(even)': {
            backgroundColor: theme.palette.primary.white
        },
        '& .MuiGrid-item': {
            minWidth: 80,
            '&:last-child': {
                marginRight: ({ medicine: { deleted }}: any) => deleted ? 88 : 0
            }
        }
    },
    rounded: {
        '&:first-child': {
            borderRadius: '4px 4px 0 0'
        },
        '&:last-child': {
            borderRadius: '0 0 4px 4px',
        },
    },
    deletedItem: {
        '& > div': {
            opacity: .5,
            borderStyle: 'solid',
            borderColor: 'red',
            borderWidth: '1px 1px 0px 1px',
            borderRadius: 0,
        },
        '&:last-of-type': {
            '& > div': {
                borderWidth: '1px 1px 1px 1px',
            }
        }
    },
    image: {
        width: 80,
        maxHeight: 80,
        margin: '0 10px 0 0',
    },
    bold: {
        fontFamily: 'Source Sans Pro SemiBold'
    },
    colorGreen: {
        color: theme.palette.primary.green.main
    },
    restoreButton: {
        position: 'absolute',
        right: 12,
        backgroundColor: '#647cfe',
        color: 'white',
        height: 36,
        width: 100,
        '&:hover': {
            backgroundColor: '#8d9eff'
        }
    },
    buttonsWrapper: {
        display: 'flex',
        alignItems: 'center',
        width: 88
    }
});

interface IProps extends WithStyles<typeof styles> {
    medicine: IMedicine;
    allowEdit: boolean;
    openModal?: (modalName: string, payload: any) => void;
    openDelPopper?: (settings: IDeletePopoverSettings) => void;
    deleteHandler?: (medId: number) => (confirmed: boolean) => void;
    user?: IUser;
}

@inject(({
    appState: {
        uiStore: {
            openModal,
            openDelPopper
        },
        userStore: {
            user
        }
    }
}) => ({
    user,
    openModal,
    openDelPopper
}))
@observer
class ListItem extends Component<IProps> {
    get showPrice(): boolean {
        const { user } = this.props;
        const allowedRoles: USER_ROLE[] = [ USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN ];
        return !!user && allowedRoles.includes(user.position);
    }

    removeClickHandler = ({ currentTarget }: any) => {
        const { openDelPopper, deleteHandler, medicine: { id } } = this.props;
        openDelPopper({
            anchorEl: currentTarget,
            callback: deleteHandler(id),
            name: 'medicineDelete'
        });
    }

    editClickHandler = () => {
        const { openModal, medicine } = this.props;
        openModal(MEDICINE_EDIT_MODAL, medicine);
    }

    render() {
        const {
            classes,
            medicine,
            allowEdit,
        } = this.props;

        const {
            name,
            barcode,
            image,
            releaseForm,
            dosage,
            manufacturer,
            mark,
            price,
            deleted
        } = medicine;

        return (
            <div className={cx(classes.wrapper, {[classes.deletedItem]: deleted})}>
            <Grid className={cx(classes.root, {[classes.rounded]: deleted === false})} wrap='nowrap' alignItems='center' container>
                <ImageLoader
                    className={classes.image}
                    loadPlaceholder={<p className={classes.image} />}
                    src={`${Config.ASSETS_URL}/${image}`}
                />

                <Grid xs container item zeroMinWidth>
                    <Typography variant='body2'>
                        { name }
                    </Typography>
                </Grid>
                <Grid xs container item zeroMinWidth>
                    <Typography variant='body2'>
                        { releaseForm }
                    </Typography>
                </Grid>
                <Grid xs container item zeroMinWidth>
                    <Typography variant='body2'>
                        { dosage }
                    </Typography>
                </Grid>
                <Grid xs container item zeroMinWidth>
                    <Typography variant='body2'>
                        { manufacturer }
                    </Typography>
                </Grid>
                <Grid xs container item zeroMinWidth>
                    <Typography variant='body2'>
                        { barcode }
                    </Typography>
                </Grid>
                <Grid xs container item zeroMinWidth>
                    <Typography className={classes.bold} variant='body2'>
                        { mark }
                    </Typography>
                </Grid>
                {
                    this.showPrice &&
                    <Grid xs container item zeroMinWidth>
                        <Typography className={classes.bold} variant='body2'>
                            { price }
                        </Typography>
                    </Grid>
                }

                <div className={classes.buttonsWrapper}>
                    {
                        deleted === false &&
                        <>
                            {
                                allowEdit &&
                                <IconButton onClick={this.editClickHandler} className={classes.colorGreen}>
                                    <EditOutlinedIcon fontSize='small' />
                                </IconButton>
                            }
                            <RemoveButton onClick={this.removeClickHandler} />
                        </>
                    }
                </div>
            </Grid>
            {
                deleted === true && allowEdit === true &&
                <RestoreButton medicine={medicine} className={classes.restoreButton} />
            }
            </div>
        );
    }
}

export default withStyles(styles)(ListItem);
