import React, { Component } from 'react';
import { createStyles, withStyles, Grid, WithStyles, Typography } from '@material-ui/core';
import { observer } from 'mobx-react';
import cx from 'classnames';

const styles = createStyles({
    fullWidth: {
        width: '100%'
    },
    complexHeader: {
        marginLeft: 5,
        backgroundColor: '#fafcfe',
        width: 270,
        '&.wider': {
            width: 350
        }
    },
    headersWrapper: {
        '& > p': {
            width: '100%',
            textAlign: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        }
    }
});

interface IProps extends WithStyles<typeof styles> {}

@observer
class TableHeader extends Component<IProps> {
    render() {
        const { classes } = this.props;

        return (
            <Grid alignItems='flex-end' wrap='nowrap' container>
                <Grid xs item>
                    <Typography variant='body2'>
                        Ролі
                    </Typography>
                </Grid>
                <Grid xs={1} item>
                    <Typography align='center' variant='body2'>
                        Звіт
                    </Typography>
                </Grid>
                <Grid className={cx(classes.complexHeader, { wider: true })} justify='center' item container>
                    <Typography variant='body2'>Редагування</Typography>
                    <Grid className={classes.headersWrapper} wrap='nowrap' justify='space-around' container>
                        <Typography variant='body2'>Працівники</Typography>
                        <Typography variant='body2'>ЗП</Typography>
                        <Typography variant='body2'>Препарати</Typography>
                        <Typography variant='body2'>ЛПУ</Typography>
                        <Typography variant='body2'>Аптеки</Typography>
                        <Typography variant='body2'>Лікарі</Typography>
                    </Grid>
                </Grid>
                <Grid className={classes.complexHeader} justify='space-around' item container>
                    <Typography variant='body2'>Додавання</Typography>
                    <Grid className={classes.headersWrapper} wrap='nowrap' justify='space-around' container>
                        <Typography variant='body2'>Препарати</Typography>
                        <Typography variant='body2'>ЛПУ</Typography>
                        <Typography variant='body2'>Аптеки</Typography>
                        <Typography variant='body2'>Лікарі</Typography>
                    </Grid>
                </Grid>
                <Grid className={classes.complexHeader} justify='space-around' item container>
                    <Typography variant='body2'>Видалення</Typography>
                    <Grid className={classes.headersWrapper} wrap='nowrap' justify='space-around' container>
                        <Typography variant='body2'>Препарати</Typography>
                        <Typography variant='body2'>ЛПУ</Typography>
                        <Typography variant='body2'>Аптеки</Typography>
                        <Typography variant='body2'>Лікарі</Typography>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(TableHeader);
