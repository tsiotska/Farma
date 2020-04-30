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
import { observer } from 'mobx-react';
import { ILPU } from '../../../interfaces/ILPU';
import cx from 'classnames';
import { Edit, Delete } from '@material-ui/icons';
import { gridStyles } from '../gridStyles';
import { ILocation } from '../../../interfaces/ILocation';
import CommitBadge from '../../../components/CommitBadge';

const styles = (theme: any) => createStyles({
    ...gridStyles(theme),
    root: {
        marginBottom: 1,
        minHeight: 48,
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
        fontSize: '1rem',
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
        minWidth: 95
    },
    phoneText: {
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    }
});

interface IProps extends WithStyles<typeof styles> {
    pharmacy: ILPU;
    unconfirmed: boolean;
    region: ILocation;
    editClickHandler?: (lpu: ILPU) => void;
}

@observer
class ListItem extends Component<IProps> {
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

    render() {
        const {
            classes,
            unconfirmed,
            editClickHandler,
            pharmacy: {
                name,
                type,
                region,
                oblast,
                city,
                address,
                phone1,
                phone2,
                ffmConfirm,
                rmConfirm
            }
        } = this.props;

        return (
            <Grid className={classes.root} alignItems='center' container>
                <Grid className={cx(classes.cell, classes.name)} xs alignItems='center' container item>
                    {
                        unconfirmed &&
                        <>
                            <CommitBadge className={classes.badge} title='ФФМ' committed={ffmConfirm} />
                            <CommitBadge className={classes.badge} title='РМ' committed={rmConfirm} />
                        </>
                    }
                    <Typography className={classes.text} variant='body2'>
                        { name }
                    </Typography>
                </Grid>
                <Grid className={cx(classes.cell, classes.region)} xs={1} alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        { this.regionName }
                    </Typography>
                </Grid>
                <Grid className={cx(classes.cell, classes.oblast)} xs={1} alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        { oblast }
                    </Typography>
                </Grid>
                <Grid className={cx(classes.cell, classes.city)} xs={1} alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        { city }
                    </Typography>
                </Grid>
                <Grid className={cx(classes.cell, classes.address)} xs alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        { address }
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
                        <span className={classes.phoneText}>{ phone1 }</span>
                        <span className={classes.phoneText}>{ phone2 }</span>
                    </Typography>
                    {
                        unconfirmed
                        ? <Button variant='outlined' className={classes.confirmButton}>
                            Підтвердити
                          </Button>
                        : <IconButton onClick={this.onEditClick} className={classes.iconButton}>
                            <Edit className={classes.icon} />
                          </IconButton>
                    }
                    <IconButton className={classes.iconButton}>
                        <Delete className={classes.icon} />
                    </IconButton>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(ListItem);
