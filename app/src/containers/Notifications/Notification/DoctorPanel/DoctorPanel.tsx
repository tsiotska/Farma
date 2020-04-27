import React, { Component } from 'react';
import { WithStyles, withStyles, createStyles, Grid, Typography, Button, IconButton } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { IDoctor } from '../../../../interfaces/IDoctor';
import { Delete } from '@material-ui/icons';
import CommitBadge from '../../../../components/CommitBadge';
import { IPosition } from '../../../../interfaces/IPosition';

const styles = (theme: any) =>  createStyles({
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
    phone: {
        minWidth: 220
    }
});

interface IProps extends WithStyles<typeof styles> {
    doctor: IDoctor;
    positions?: Map<number, IPosition>;
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
    render() {
        const {
            classes,
            doctor: {
                FFMCommit,
                RMCommit,
                name,
                mobilePhone,
                workPhone,
                card,
                LPUName,
                position
            }
        } = this.props;

        return (
            <>
                <Grid xs wrap='nowrap' alignItems='center' container item>
                    <CommitBadge committed={FFMCommit} title='ФФМ' className={classes.badge} />
                    <CommitBadge committed={RMCommit} title='РМ' className={classes.badge} />
                    <Typography variant='body2'>
                        { name }
                    </Typography>
                </Grid>
                <Grid xs container item>
                    <Typography variant='body2'>
                        { LPUName }
                    </Typography>
                </Grid>
                <Grid xs container item>
                    <Typography variant='body2'>
                        { position }
                    </Typography>
                </Grid>
                <Grid className={classes.phone} xs container item>
                    <Typography className={classes.text} variant='body2'>
                        <span>{ workPhone || '-' }</span>
                        <span>{ mobilePhone || '-' }</span>
                    </Typography>
                </Grid>
                <Grid xs container item>
                    <Typography variant='body2'>
                        { card }
                    </Typography>
                </Grid>
                <Button variant='outlined' className={classes.confirmButton}>
                    Підтвердити
                </Button>
                <IconButton>
                    <Delete />
                </IconButton>
            </>
        );
    }
}

export default withStyles(styles)(DoctorPanel);
