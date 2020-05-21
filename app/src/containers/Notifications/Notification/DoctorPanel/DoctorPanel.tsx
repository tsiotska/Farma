import React, { Component } from 'react';
import { WithStyles, withStyles, createStyles, Grid, Typography, Button, IconButton } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { IDoctor } from '../../../../interfaces/IDoctor';
import { Delete } from '@material-ui/icons';
import CommitBadge from '../../../../components/CommitBadge';
import { IPosition } from '../../../../interfaces/IPosition';

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
    doctor: IDoctor;
    positions?: Map<number, IPosition>;
    action?: string;
    type?: string;

    acceptNotification?: (type: string, id: number) => void;
    deleteClickHandler?: (currentTarget: any, type: string, id: number) => void;
    returnNotification?: (type: string, id: number) => void;
}

@inject(({
             appState: {
                 departmentsStore: {
                     positions
                 }
             }
         }) => ({
    positions
}))
@observer
class DoctorPanel extends Component<IProps> {

    deleteHandler = ({ currentTarget }: any) => {
        const { type, doctor: { id }, deleteClickHandler } = this.props;
        deleteClickHandler(currentTarget, type, id);
    }

    acceptHandler = () => {
        const { type, doctor: { id }, acceptNotification } = this.props;
        acceptNotification(type, id);
    }

    returnHandler = () => {
        const { type, doctor: { id }, returnNotification } = this.props;
        returnNotification(type, id);
    }

    render() {
        const {
            classes,
            action,
            doctor: {
                FFMCommit,
                RMCommit,
                name,
                mobilePhone,
                workPhone,
                card,
                LPUName,
                position,
                deleted,
                confirmed,
                id,
            }
        } = this.props;

        return (
            <>
                <Grid xs wrap='nowrap' alignItems='center' container item>
                    {action === 'accept' &&
                    <>
                        <CommitBadge committed={FFMCommit} title='ФФМ' className={classes.badge}/>
                        <CommitBadge committed={RMCommit} title='РМ' className={classes.badge}/>
                    </>
                    }
                    <Typography variant='body2'>
                        {name}
                    </Typography>
                </Grid>
                <Grid xs container item>
                    <Typography variant='body2'>
                        {LPUName}
                    </Typography>
                </Grid>
                <Grid xs container item>
                    <Typography variant='body2'>
                        {position}
                    </Typography>
                </Grid>
                <Grid className={classes.phone} xs container item>
                    <Typography className={classes.text} variant='body2'>
                        <span>{workPhone || '-'}</span>
                        <span>{mobilePhone || '-'}</span>
                    </Typography>
                </Grid>
                <Grid xs container item>
                    <Typography variant='body2'>
                        {card}
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
                    : action === 'return' &&
                    <Button onClick={this.returnHandler} variant='outlined' className={classes.returnButton}>
                        Повернути
                    </Button>
                }
            </>
        );
    }
}

export default withStyles(styles)(DoctorPanel);
