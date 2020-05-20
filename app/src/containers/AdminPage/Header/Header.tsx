import React, { Component } from 'react';
import { withStyles, createStyles, WithStyles, Grid, Typography, IconButton } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import SalesModeSwitch from '../../../components/SalesModeSwitch';
import DateRangeButton from '../../../components/DateRangeButton';
import ExcelIcon from '../../../components/ExcelIcon';

const styles = (theme: any) => createStyles({
    root: {
        marginBottom: 12
    },
    salesModeSwitch: {
        width: 'auto',
        marginBottom: 0
    },
    excelIcon: {
        marginLeft: 'auto'
    }
});

interface IProps extends WithStyles<typeof styles> {
    loadSalesExcel?: () => void;
}
@inject(({
             appState: {
                 salesStore: {
                     loadSalesExcel
                 },
             }
         }) => ({
    loadSalesExcel
}))
@observer
class Header extends Component<IProps> {

    excelClickHandler = () => {
        const { loadSalesExcel } = this.props;
        loadSalesExcel();
    }

    render() {
        const { classes } = this.props;
        return (
            <Grid className={classes.root} alignItems='center' container>
                <Typography>
                    Реалізація препартів
                </Typography>
                <DateRangeButton />
                <SalesModeSwitch classes={{ root: classes.salesModeSwitch }} />
                <IconButton onClick={this.excelClickHandler}  className={classes.excelIcon} >
                    <ExcelIcon />
                </IconButton>
            </Grid>
        );
    }
}

export default withStyles(styles)(Header);
