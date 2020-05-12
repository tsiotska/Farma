import React, { Component } from 'react';
import { createStyles, withStyles, Grid, WithStyles, Typography, IconButton } from '@material-ui/core';
import { observer } from 'mobx-react';
import cx from 'classnames';
import Settings from '-!react-svg-loader!../../../../../assets/icons/settings.svg';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';

const styles = createStyles({
    fullWidth: {
        width: '100%'
    },
    complexHeader: {
        width: 150,
        backgroundColor: '#fafcfe',
        borderBottom: '1px solid #E4EDF7',
    },
    complexHeader_icon: {
        marginLeft: 10
    },
    headersWrapper: {
        marginLeft: 10,
        '& > p': {
            display: 'flex',
            alignItems: 'center',
            height: 38, // to match with checkbox
            textAlign: 'start',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        }
    }
});

interface IProps extends WithStyles<typeof styles> {
}

@observer
class TableHeader extends Component<IProps> {
    render() {
        const { classes } = this.props;

        return (
            <Grid direction='column' wrap='nowrap' container>
                <Grid xs item/>
                <Grid xs className={classes.complexHeader} alignItems='center' justify='center' item container>
                    <Typography align='center' variant='body2'>
                        Звіт
                    </Typography>
                </Grid>
                <Grid className={classes.complexHeader} alignItems='center' justify='flex-start' item container>
                    <IconButton className={classes.complexHeader_icon}>
                        <Settings width={22} height={22}/>
                    </IconButton>
                    <Grid direction='column' className={classes.headersWrapper} wrap='nowrap' justify='space-around'>
                        <Typography variant='body2'>Працівники</Typography>
                        <Typography variant='body2'>ЗП</Typography>
                        <Typography variant='body2'>Препарати</Typography>
                        <Typography variant='body2'>ЛПУ</Typography>
                        <Typography variant='body2'>Аптеки</Typography>
                        <Typography variant='body2'>Лікарі</Typography>
                    </Grid>
                </Grid>
                <Grid className={classes.complexHeader} alignItems='center' justify='flex-start' item container>
                    <IconButton className={classes.complexHeader_icon}>
                    <AddCircleOutlineIcon />
                    </IconButton>
                    <Grid direction='column' className={classes.headersWrapper} wrap='nowrap' justify='space-around'>
                        <Typography variant='body2'>Препарати</Typography>
                        <Typography variant='body2'>ЛПУ</Typography>
                        <Typography variant='body2'>Аптеки</Typography>
                        <Typography variant='body2'>Лікарі</Typography>
                    </Grid>
                </Grid>
                <Grid className={classes.complexHeader} alignItems='center' justify='flex-start' item container>
                    <IconButton className={classes.complexHeader_icon}>
                        <DeleteOutlinedIcon />
                    </IconButton>
                    <Grid direction='column' className={classes.headersWrapper} wrap='nowrap' justify='space-around'>
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
