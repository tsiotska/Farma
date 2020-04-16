import React, { Component } from 'react';
import {
    WithStyles,
    withStyles,
    createStyles,
    Grid,
    Typography,
    Button,
    IconButton
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { IUserNotification } from '../../../../interfaces/IUserNotification';
import CommitBadge from '../../../../components/CommitBadge';
import { Delete } from '@material-ui/icons';
import { IPosition } from '../../../../interfaces/IPosition';

const styles = (theme: any) => createStyles({
    badge: {
        marginRight: 5,
        backgroundColor: '#f2f2f2',
    },
    confirmButton: {
        padding: '2px 0',
        margin: '0 4px',
        minWidth: 95,
        color: theme.palette.primary.green.main,
        borderColor: theme.palette.primary.green.main
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
    phone: {
        minWidth: 220
    }
});

interface IProps extends WithStyles<typeof styles> {
    agent: IUserNotification;
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
class AgentPanel extends Component<IProps> {
    get positionName(): string {
        const { positions, agent: { position } } = this.props;
        const targetPosition = positions.get(position);
        return targetPosition
            ? targetPosition.alias
            : '-';
    }
    render() {
        const { classes, agent } = this.props;
        const {
            name,
            email,
            workPhone,
            mobilePhone,
            card,
            confirmed
        } = agent;

        return (
            <>
                <Grid xs container item>
                    <CommitBadge committed={confirmed} title='ФФМ' className={classes.badge} />
                    <Typography variant='body2'>
                        {name || '-'}
                    </Typography>
                </Grid>
                <Grid xs container item>
                    <Typography variant='body2'>
                        {email || '-'}
                    </Typography>
                </Grid>
                <Grid xs container item>
                    <Typography variant='body2'>
                        {this.positionName}
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
                        {card || '-'}
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

export default withStyles(styles)(AgentPanel);
