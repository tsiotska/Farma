import React, { Component } from 'react';
import { WithStyles, withStyles, createStyles, Grid, Typography, Button, IconButton } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { ILPU } from '../../../../interfaces/ILPU';
import CommitBadge from '../../../../components/CommitBadge';
import { ILocation } from '../../../../interfaces/ILocation';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

const styles = (theme: any) => createStyles({
    badge: {
        marginRight: 5,
        backgroundColor: '#f2f2f2',
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
    confirmButton: {
        padding: '2px 0',
        margin: '0 4px',
        minWidth: 95,
        color: theme.palette.primary.green.main,
        borderColor: theme.palette.primary.green.main
    },
    returnButton: {
        padding: '2px 0',
        margin: '0 4px',
        minWidth: 95,
        color: theme.palette.secondary.dark,
        borderColor: theme.palette.secondary.dark
    },
    phone: {
        minWidth: 220
    },
    colorGreen: {
        color: theme.palette.primary.green.main,
    },
    colorRed: {
        color: theme.palette.secondary.dark
    }
});

interface IProps extends WithStyles<typeof styles> {
    hcf: ILPU;
    regions?: Map<number, ILocation>;
    action?: string;
    type?: string;

    acceptNotification?: (type: string, id: number) => void;
    deleteClickHandler?: (currentTarget: any, type: string, id: number) => void;
    returnNotification?: (type: string, id: number) => void;
}

@inject(({
             appState: {
                 departmentsStore: {
                     regions,
                 }
             }
         }) => ({
    regions,
}))
@observer
class HCFPanel extends Component<IProps> {
    get cityName(): string {
        const { hcf: { city } } = this.props;
        return city || '-';
    }

    get regionName(): string {
        const { regions, hcf: { region } } = this.props;
        const targetRegion = regions.get(region);
        return targetRegion
            ? targetRegion.name
            : '';
    }

    deleteHandler = ({ currentTarget }: any) => {
        const { type, hcf, deleteClickHandler } = this.props;
        const id = hcf.id;
        deleteClickHandler(currentTarget, type, id);
    }

    acceptHandler = () => {
        const { type, hcf, acceptNotification } = this.props;
        const id = hcf.id;
        acceptNotification(type, id);
    }

    returnHandler = () => {
        const { type, hcf, returnNotification } = this.props;
        const id = hcf.id;
        returnNotification(type, id);
    }

    render() {
        const {
            classes,
            action,
            hcf: {
                name,
                oblast,
                address,
                phone1,
                phone2,
                FFMCommit,
                RMCommit,
                id,
                confirmed,
                deleted
            }
        } = this.props;

        return (
            <>
                <Grid xs={3} alignItems='center' wrap='nowrap' container item>
                    {action === 'accept' &&
                    <>
                        <CommitBadge className={classes.badge} title='??????' committed={FFMCommit}/>
                        <CommitBadge className={classes.badge} title='????' committed={RMCommit}/>
                    </>
                    }
                    <Typography className={classes.text} variant='body2'>
                        {name || ''}
                    </Typography>
                </Grid>
                <Grid xs alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        {this.regionName}
                    </Typography>
                </Grid>
                <Grid xs alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        {oblast || ''}
                    </Typography>
                </Grid>
                <Grid xs alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        {this.cityName}
                    </Typography>
                </Grid>
                <Grid xs alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        {address || ''}
                    </Typography>
                </Grid>
                <Grid
                    className={classes.phone}
                    xs={1}
                    wrap='nowrap'
                    alignItems='center'
                    container
                    item>
                    <Typography className={classes.text} variant='body2'>
                        <span>{phone1 || ''}</span>
                        <span>{phone2 || ''}</span>
                    </Typography>
                </Grid>

                {action === 'accept' && confirmed ?
                    <>
                        <Typography variant='body1' className={classes.colorGreen}>
                            ????????????????????????
                        </Typography>
                        <IconButton onClick={this.deleteHandler}>
                            <DeleteOutlineIcon fontSize='small'/>
                        </IconButton>
                    </>
                    : action === 'accept' && deleted ?
                            <Typography variant='body1' className={classes.colorRed}>
                                ????????????????
                            </Typography>
                        : action === 'accept' ?
                        <>
                            <Button onClick={this.acceptHandler} variant='outlined'
                                    className={classes.confirmButton}>
                                ??????????????????????
                            </Button>
                            <IconButton onClick={this.deleteHandler}>
                                <DeleteOutlineIcon fontSize='small'/>
                            </IconButton>
                        </> : null
                }

                {action === 'return' && deleted ?
                    <Button onClick={this.returnHandler} variant='outlined' className={classes.returnButton}>
                        ??????????????????
                    </Button>
                    : action === 'return' &&
                    <Typography variant='body1' className={classes.colorRed}>
                        ??????????????????
                    </Typography>
                }
            </>
        );
    }
}

export default withStyles(styles)(HCFPanel);
