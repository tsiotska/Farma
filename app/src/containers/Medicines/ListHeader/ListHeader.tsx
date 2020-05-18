import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Typography } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IUser } from '../../../interfaces';
import { USER_ROLE } from '../../../constants/Roles';
import cx from 'classnames';

const styles = (theme: any) => createStyles({
    root: {
        padding: '0 10px',
        color: theme.palette.primary.gray.light,
        margin: '15px 0 10px'
    },
    firstItem: {
        width: 90,
    },
    lastItem: {
        marginRight: 88
    },
    text: {
        fontSize: 14,
        color: '#aaa',
        fontFamily: 'Source Sans Pro SemiBold',
        textAlign: 'center'
    },
});

interface IProps extends WithStyles<typeof styles> {
    user?: IUser;
}

@inject(({
    appState: {
        userStore: {
            user
        }
    }
}) => ({
    user
}))
@observer
class ListHeader extends Component<IProps> {
    get showPrice(): boolean {
        const { user } = this.props;
        const allowedRoles: USER_ROLE[] = [ USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN ];
        return !!user && allowedRoles.includes(user.position);
    }

    render() {
        const { classes } = this.props;

        return (
            <Grid className={classes.root} wrap='nowrap' alignItems='center' container>

                <Typography variant='subtitle1' noWrap className={classes.firstItem}>
                    Фото
                </Typography>

                <Grid xs item zeroMinWidth>
                    <Typography className={classes.text} noWrap>
                        Назва
                    </Typography>
                </Grid>

                <Grid xs item zeroMinWidth>
                    <Typography className={classes.text} variant='subtitle1' noWrap>
                        Форма выпуску
                    </Typography>
                </Grid>

                <Grid xs item zeroMinWidth>
                    <Typography className={classes.text} variant='subtitle1' noWrap>
                        Дозування, мг
                    </Typography>
                </Grid>

                <Grid xs item zeroMinWidth>
                    <Typography className={classes.text} variant='subtitle1' noWrap>
                        Виробник
                    </Typography>
                </Grid>

                <Grid xs item zeroMinWidth>
                    <Typography className={classes.text} variant='subtitle1' noWrap>
                        Штрихкод
                    </Typography>
                </Grid>

                <Grid className={cx({ [classes.lastItem]: !this.showPrice })} xs item zeroMinWidth>
                    <Typography variant='subtitle1' noWrap>
                        Балл
                    </Typography>
                </Grid>

                {
                    this.showPrice &&
                    <Grid className={classes.lastItem} xs item zeroMinWidth>
                        <Typography variant='subtitle1' noWrap>
                            Ціна, грн
                        </Typography>
                    </Grid>
                }
            </Grid>
        );
    }
}

export default withStyles(styles)(ListHeader);
