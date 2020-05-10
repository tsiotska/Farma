import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Typography, IconButton } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import ExcelIcon from '../../../components/ExcelIcon';

const styles = (theme: any) => createStyles({
    column: {
        minWidth: 120
    },
    accessContainer: {
        minWidth: 100
    },
    root: {
        marginTop: 16,
        paddingLeft: 5,
        marginBottom: 12
    },
    excelButton: {
        marginLeft: 'auto'
    }
});

interface IProps extends WithStyles<typeof styles> {
    loadDocsExcel?: () => void;
    unconfirmed?: boolean;
}

@inject(({
             appState: {
                 departmentsStore: {
                     loadDocsExcel
                 }
             }
         }) => ({
    loadDocsExcel
}))
@observer
class ListHeader extends Component<IProps> {
    render() {
        const { classes, loadDocsExcel, unconfirmed } = this.props;

        return (
            <Grid className={classes.root} alignItems='center' container>
                <Grid xs container item>
                    {
                        unconfirmed &&
                        <Grid className={classes.accessContainer}>
                            <Typography variant='body2' color='textSecondary'>
                                Підтверджено
                            </Typography>
                        </Grid>
                    }
                    <Typography variant='body2' color='textSecondary'>
                        ЛПУ
                    </Typography>
                </Grid>
                <Grid xs container item>
                    <Typography variant='body2' color='textSecondary'>
                        ПІБ лікаря
                    </Typography>
                </Grid>
                <Grid xs={1} className={classes.column} container item>
                    <Typography variant='body2' color='textSecondary'>
                        Спецільність
                    </Typography>
                </Grid>
                <Grid xs={1} className={classes.column} container item>
                    <Typography variant='body2' color='textSecondary'>
                        Телефон
                    </Typography>
                </Grid>
                <Grid xs={1} className={classes.column} container item>
                    <Typography variant='body2' color='textSecondary'>
                        № карти
                    </Typography>
                </Grid>

                <Grid xs={3} alignItems='center' container item>
                    {
                        !unconfirmed &&
                        <>
                            <Typography variant='body2' color='textSecondary'>
                                Депозит
                            </Typography>
                            <IconButton className={classes.excelButton} onClick={loadDocsExcel}>
                                <ExcelIcon/>
                            </IconButton>
                        </>
                    }
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(ListHeader);
