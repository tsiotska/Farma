import React, { Component } from 'react';
import { WithStyles, withStyles, createStyles, Grid, Typography, Button, IconButton } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { ILPU } from '../../../../interfaces/ILPU';
import { toJS } from 'mobx';
import CommitBadge from '../../../../components/CommitBadge';
import { Edit, Delete } from '@material-ui/icons';
import cx from 'classnames';
import { ILocation } from '../../../../interfaces/ILocation';

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
        color:  theme.palette.secondary.dark
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
            : '-';
    }

    deleteHandler = ({ currentTarget }: any) => {
        const { type, deleteClickHandler } = this.props;
        const id = this.props[type].id;
        deleteClickHandler(currentTarget, type, id);
    }

    acceptHandler = () => {
        const { type, acceptNotification } = this.props;
        const id = this.props[type].id;
        acceptNotification(type, id);
    }

    returnHandler = () => {
        const { type, returnNotification } = this.props;
        const id = this.props[type].id;
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
                deleted,
                confirmed
            }
        } = this.props;
        return (
            <>
                <Grid xs={3} alignItems='center' wrap='nowrap' container item>
                    {action === 'accept' &&
                    <>
                        <CommitBadge className={classes.badge} title='ФФМ' committed={FFMCommit}/>
                        <CommitBadge className={classes.badge} title='РМ' committed={RMCommit}/>
                    </>
                    }
                    <Typography className={classes.text} variant='body2'>
                        {name || '-'}
                    </Typography>
                </Grid>
                <Grid xs alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        {this.regionName}
                    </Typography>
                </Grid>
                <Grid xs alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        {oblast || '-'}
                    </Typography>
                </Grid>
                <Grid xs alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        {this.cityName}
                    </Typography>
                </Grid>
                <Grid xs alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        {address || '-'}
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
                        <span>{phone1 || '-'}</span>
                        <span>{phone2 || '-'}</span>
                    </Typography>
                </Grid>

                {action === 'accept' && confirmed ?
                    <>
                        <Typography variant='body1' className={classes.colorGreen}>
                            Підтверджено
                        </Typography>
                        <IconButton onClick={this.deleteHandler}>
                            <Delete/>
                        </IconButton>
                    </>
                    : action === 'accept' &&
                    <>
                        <Button onClick={this.acceptHandler} variant='outlined'
                                className={classes.confirmButton}>
                            Підтвердити
                        </Button>
                        <IconButton onClick={this.deleteHandler}>
                            <Delete/>
                        </IconButton>
                    </>

                }

                {action === 'return' && deleted ?
                    <Typography variant='body1' className={classes.colorRed}>
                        Повернено
                    </Typography>
                    : action === 'return' ?
                        <Button onClick={this.returnHandler} variant='outlined' className={classes.returnButton}>
                            Повернути
                        </Button>
                        :
                        deleted &&
                        <Typography variant='body1' className={classes.colorRed}>
                            Видалено
                        </Typography>
                }
            </>
        );
    }
}

export default withStyles(styles)(HCFPanel);
