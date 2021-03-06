import React, { Component } from 'react';
import {
    Grid,
    createStyles,
    WithStyles,
    withStyles,
    Typography,
    IconButton,
    Button
} from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { ILPU } from '../../../interfaces/ILPU';
import cx from 'classnames';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { gridStyles } from '../gridStyles';
import { ILocation } from '../../../interfaces/ILocation';
import CommitBadge from '../../../components/CommitBadge';
import LoadingMask from '../../../components/LoadingMask';
import { observable, toJS } from 'mobx';
import DeleteButton from '../DeleteButton';
import EditButton from '../EditButton';

const styles = (theme: any) => createStyles({
    ...gridStyles(theme),
    root: {
        marginBottom: 1,
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '5px 0',
        backgroundColor: ({ unconfirmed }: any) => unconfirmed
            ? theme.palette.primary.blue
            : theme.palette.primary.white,
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
    text: {
        lineHeight: 1.5,
        marginRight: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    iconButton: {
        padding: 8,
        borderRadius: 2
    },
    icon: {
        color: ({ unconfirmed }: any) => unconfirmed
            ? theme.palette.primary.white
            : ''
    },
    badge: {
        marginRight: 5,
        '&:last-of-type': {
            marginTop: 5,
            marginBottom: 5
        }
    },
    confirmButton: {
        color: theme.palette.primary.white,
        borderColor: theme.palette.primary.white,
        padding: '2px 0',
        margin: '0 4px',
        minWidth: 95,
        marginRight: 20
    },
    phoneText: {
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    colorGreen: {
        color: theme.palette.primary.green.main
    },
    cell: {}
});

interface IProps extends WithStyles<typeof styles> {
    pharmacy: ILPU;
    unconfirmed?: boolean;
    region: ILocation;
    editClickHandler?: (lpu: ILPU) => void;
    deleteClickHandler?: (lpu: ILPU, anchorEl: Element) => void;
    confirmHandler?: (pharmacy: ILPU) => void;
    type: 'hcf' | 'pharmacy';
}

@observer
class ListItem extends Component<IProps> {
    @observable isLoadingConfirmation: boolean = false;

    confirmClickHandler = async () => {
        const { confirmHandler, pharmacy } = this.props;
        if (!confirmHandler) return;
        this.isLoadingConfirmation = true;
        await confirmHandler(pharmacy);
        this.isLoadingConfirmation = false;
    }

    get regionName(): string {
        const { region } = this.props;
        return region
            ? region.name
            : '-';
    }

    onEditClick = () => {
        const { editClickHandler, pharmacy } = this.props;
        if (editClickHandler) editClickHandler(pharmacy);
    }

    deleteClickHandler = ({ currentTarget }: any) => {
        const { deleteClickHandler, pharmacy } = this.props;
        if (deleteClickHandler) deleteClickHandler(pharmacy, currentTarget);
    }

    render() {
        const {
            classes,
            unconfirmed,
            editClickHandler,
            type: generalType,
            pharmacy: {
                name,
                type,
                region,
                oblast,
                city,
                address,
                phone1,
                phone2,
                lpuName,
                FFMCommit,
                RMCommit
            }
        } = this.props;

        return (
            <Grid className={classes.root} alignItems='center' container>
                <Grid className={cx(classes.cell, classes.name)} xs alignItems='center' container item>
                    {
                        unconfirmed &&
                        <>
                            <CommitBadge className={classes.badge} title='??????' committed={FFMCommit}/>
                            <CommitBadge className={classes.badge} title='????' committed={RMCommit}/>
                        </>
                    }

                    <Grid direction='column' item container>
                        {lpuName &&
                        <Typography className={unconfirmed && classes.text} variant='body2'>
                            {lpuName}
                        </Typography>
                        }
                        <Typography className={classes.text} variant='body2'>
                            {name}
                        </Typography>
                    </Grid>

                </Grid>
                <Grid className={cx(classes.cell, classes.region)} xs={1} alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        {this.regionName}
                    </Typography>
                </Grid>
                <Grid className={cx(classes.cell, classes.oblast)} xs={1} alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        {oblast}
                    </Typography>
                </Grid>
                <Grid className={cx(classes.cell, classes.city)} xs={1} alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        {city}
                    </Typography>
                </Grid>
                <Grid className={cx(classes.cell, classes.address)} xs alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        {address}
                    </Typography>
                </Grid>
                <Grid
                    className={cx(classes.cell, classes.phone, { widder: unconfirmed })}
                    xs={1}
                    wrap='nowrap'
                    alignItems='center'
                    container
                    item>
                    <Typography className={classes.text} variant='body2'>
                        <span className={classes.phoneText}>{phone1}</span>
                        <span className={classes.phoneText}>{phone2}</span>
                    </Typography>
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
                                        : '??????????????????????'
                                }
                            </Button>
                            : <EditButton
                                onClick={this.onEditClick}
                                className={cx(classes.iconButton, classes.colorGreen)}
                                iconClassName={classes.icon}
                                type={generalType}
                                unconfirmed={unconfirmed}
                            />
                    }

                    <DeleteButton
                        unconfirmed={unconfirmed}
                        type={generalType}
                        className={classes.iconButton}
                        onClick={this.deleteClickHandler}>
                        <DeleteOutlineIcon fontSize='small' className={classes.icon}/>
                    </DeleteButton>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(ListItem);
