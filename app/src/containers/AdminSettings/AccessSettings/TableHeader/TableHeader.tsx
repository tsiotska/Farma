import React, {Component} from 'react';
import {
    createStyles,
    withStyles,
    Grid,
    WithStyles,
    Typography,
    IconButton
} from '@material-ui/core';
import {observer} from 'mobx-react';
import cx from 'classnames';

const styles = createStyles({
    fullWidth: {
        width: '100%'
    },
    complexHeader: {
        backgroundColor: '#fafcfe',
        marginTop: 40
    },
    cell: {
        borderBottom: '1px solid #E4EDF7',
        height: 40
    },
    title_bold: {
        fontWeight: 600,
        color: '#808080'
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
        const {classes} = this.props;

        return (
            <Grid direction='column' wrap='nowrap' container>

                <Grid className={cx(classes.complexHeader)}>
                    <Grid className={cx(classes.cell)} justify='center'
                          container item>
                        <Typography className={classes.title_bold}
                                    color='textSecondary' variant='body1'>
                            Перегляд
                        </Typography>
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center'
                          container item>
                        <Typography className={classes.title_bold}
                                    variant='body1'>
                            Звіт
                        </Typography>
                    </Grid>
                </Grid>

                <Grid className={cx(classes.complexHeader)}>
                    <Grid className={cx(classes.cell)} justify='center'
                          container item>
                        <Typography className={classes.title_bold}
                                    variant='body1'>
                            Редагування
                        </Typography>
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center'
                          container item>
                        <Typography color='textSecondary'
                                    variant='body1'>
                            Працівники
                        </Typography>
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center'
                          container item>
                        <Typography color='textSecondary'
                                    variant='body1'>
                            ЗП
                        </Typography>
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center'
                          container item>
                        <Typography color='textSecondary'
                                    variant='body1'>
                            Препарати
                        </Typography>
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center'
                          container item>
                        <Typography color='textSecondary'
                                    variant='body1'>
                            ЛПУ
                        </Typography>
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center'
                          container item>
                        <Typography color='textSecondary'
                                    variant='body1'>
                            Аптеки
                        </Typography>
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center'
                          container item>
                        <Typography color='textSecondary'
                                    variant='body1'>
                            Лікарі
                        </Typography>
                    </Grid>
                </Grid>

                <Grid className={cx(classes.complexHeader)}>
                    <Grid className={cx(classes.cell)} justify='center'
                          container item>
                        <Typography className={classes.title_bold}
                                    variant='body1'>
                            Додавання
                        </Typography>
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center'
                          container item>
                        <Typography color='textSecondary'
                                    variant='body1'>
                            Препарати
                        </Typography>
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center'
                          container item>
                        <Typography color='textSecondary'
                                    variant='body1'>
                            ЛПУ
                        </Typography>
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center'
                          container item>
                        <Typography color='textSecondary'
                                    variant='body1'>
                            Аптеки
                        </Typography>
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center'
                          container item>
                        <Typography color='textSecondary'
                                    variant='body1'>
                            Лікарі
                        </Typography>
                    </Grid>
                </Grid>

                <Grid className={cx(classes.complexHeader)}>
                    <Grid className={cx(classes.cell)} justify='center'
                          container item>
                        <Typography className={classes.title_bold}
                                    variant='body1'>
                            Видалення
                        </Typography>
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center'
                          container item>
                        <Typography color='textSecondary'
                                    variant='body1'>
                            Препарати
                        </Typography>
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center'
                          container item>
                        <Typography color='textSecondary'
                                    variant='body1'>
                            ЛПУ
                        </Typography>
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center'
                          container item>
                        <Typography color='textSecondary'
                                    variant='body1'>
                            Аптеки
                        </Typography>
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center'
                          container item>
                        <Typography color='textSecondary'
                                    variant='body1'>
                            Лікарі
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(TableHeader);
