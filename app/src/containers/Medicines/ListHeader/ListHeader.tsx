import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Typography } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';

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
});

interface IProps extends WithStyles<typeof styles> {
}

@observer
class ListHeader extends Component<IProps> {
    render() {
        const { classes } = this.props;

        return (
            <Grid className={classes.root} wrap='nowrap' alignItems='center' container>

                <Typography variant='subtitle1' noWrap className={classes.firstItem}>
                    Фото
                </Typography>

                <Grid xs item zeroMinWidth>
                    <Typography variant='subtitle1' noWrap>
                        Название
                    </Typography>
                </Grid>

                <Grid xs item zeroMinWidth>
                    <Typography variant='subtitle1' noWrap>
                        Форма выпуска
                    </Typography>
                </Grid>

                <Grid xs item zeroMinWidth>
                    <Typography variant='subtitle1' noWrap>
                        Дозировка, мг
                    </Typography>
                </Grid>

                <Grid xs item zeroMinWidth>
                    <Typography variant='subtitle1' noWrap>
                        Производитель
                    </Typography>
                </Grid>

                <Grid xs item zeroMinWidth>
                    <Typography variant='subtitle1' noWrap>
                        Бонус, грн
                    </Typography>
                </Grid>

                <Grid className={classes.lastItem} xs item zeroMinWidth>
                    <Typography variant='subtitle1' noWrap>
                        Цена, грн
                    </Typography>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(ListHeader);
