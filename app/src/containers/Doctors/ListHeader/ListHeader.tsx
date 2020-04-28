import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Typography, IconButton } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import ExcelIcon from '../../../components/ExcelIcon';

const styles = (theme: any) => createStyles({
    column: {
        minWidth: 120
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
        const { classes, loadDocsExcel } = this.props;

        return (
            <Grid className={classes.root} alignItems='center' wrap='nowrap' container>
                <Grid xs={3} container item>
                    <Typography variant='body2' color='textSecondary'>
                        ЛПУ
                    </Typography>
                </Grid>
                <Grid xs={3} container item>
                    <Typography variant='body2' color='textSecondary'>
                        ПІБ лікаря
                    </Typography>
                </Grid>
                <Grid className={classes.column} xs container item>
                    <Typography variant='body2' color='textSecondary'>
                        Спецільність
                    </Typography>
                </Grid>
                <Grid className={classes.column} xs container item>
                    <Typography variant='body2' color='textSecondary'>
                        Телефон
                    </Typography>
                </Grid>
                <Grid className={classes.column} xs container item>
                    <Typography variant='body2' color='textSecondary'>
                        № карти
                    </Typography>
                </Grid>
                <Grid xs={3} alignItems='center' container item>
                    <Typography variant='body2' color='textSecondary'>
                        Депозит
                    </Typography>
                    <IconButton className={classes.excelButton} onClick={loadDocsExcel}>
                        <ExcelIcon />
                    </IconButton>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(ListHeader);
