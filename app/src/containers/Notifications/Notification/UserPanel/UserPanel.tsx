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
import { IPosition } from '../../../../interfaces/IPosition';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

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
    user: IUserNotification;
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
class UserPanel extends Component<IProps> {
    get positionName(): string {
        const { positions, user: { position } } = this.props;
        const targetPosition = positions.get(position);
        return targetPosition
            ? targetPosition.alias
            : '';
    }

    deleteHandler = ({ currentTarget }: any) => {
        const { type, user: { id }, deleteClickHandler } = this.props;
        deleteClickHandler(currentTarget, type, id);
    }

    acceptHandler = () => {
        const { type, user: { id }, acceptNotification } = this.props;
        acceptNotification(type, id);
    }

    returnHandler = () => {
        const { type, user: { id }, returnNotification } = this.props;
        returnNotification(type, id);
    }

    render() {
        const {
            classes,
            action,
            user: {
                name,
                email,
                workPhone,
                mobilePhone,
                card,
                confirmed,
                deleted
            }
        } = this.props;

        return (
            <>
                <Grid xs container item>
                    {action === 'accept' &&
                    <>
                        <CommitBadge committed={confirmed} title='ФФМ' className={classes.badge}/>
                    </>
                    }
                    <Typography variant='body2'>
                        {name || ''}
                    </Typography>
                </Grid>
                <Grid xs container item>
                    <Typography variant='body2'>
                        {email || ''}
                    </Typography>
                </Grid>
                <Grid xs container item>
                    <Typography variant='body2'>
                        {this.positionName}
                    </Typography>
                </Grid>
                <Grid className={classes.phone} xs container item>
                    <Typography className={classes.text} variant='body2'>
                        <span>{workPhone || ''}</span>
                        <span>{mobilePhone || ''}</span>
                    </Typography>
                </Grid>
                <Grid xs container item>
                    <Typography variant='body2'>
                        {card || ''}
                    </Typography>
                </Grid>
                {action === 'accept' && confirmed ?
                    <>
                        <Typography variant='body1' className={classes.colorGreen}>
                            Підтверджено
                        </Typography>
                        <IconButton onClick={this.deleteHandler}>
                            <DeleteOutlineIcon fontSize='small'/>
                        </IconButton>
                    </>
                    : action === 'accept' && deleted ?
                        <Typography variant='body1' className={classes.colorRed}>
                            Видалено
                        </Typography>
                        : action === 'accept' ?
                            <>
                                <Button onClick={this.acceptHandler} variant='outlined'
                                        className={classes.confirmButton}>
                                    Підтвердити
                                </Button>
                                <IconButton onClick={this.deleteHandler}>
                                    <DeleteOutlineIcon fontSize='small'/>
                                </IconButton>
                            </> : null
                }

                {action === 'return' && deleted ?
                    <Button onClick={this.returnHandler} variant='outlined' className={classes.returnButton}>
                        Повернути
                    </Button>
                    : action === 'return' &&
                    <Typography variant='body1' className={classes.colorRed}>
                        Повернено
                    </Typography>
                }
            </>
        );
    }
}

export default withStyles(styles)(UserPanel);
