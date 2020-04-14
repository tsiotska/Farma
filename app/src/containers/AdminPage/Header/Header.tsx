import React, { Component } from 'react';
import { withStyles, createStyles, WithStyles, Grid, Typography } from '@material-ui/core';
import { observer } from 'mobx-react';
import SalesModeSwitch from '../../../components/SalesModeSwitch';
import DateRangeButton from '../../../components/DateRangeButton';

const styles = (theme: any) => createStyles({
    root: {
        marginBottom: 12
    },
    salesModeSwitch: {
        width: 'auto',
        marginBottom: 0
    }
});

interface IProps extends WithStyles<typeof styles> {}

@observer
class Header extends Component<IProps> {
    render() {
        const { classes } = this.props;

        return (
            <Grid className={classes.root} alignItems='center' container>
                <Typography>
                    Реалізація препартів
                </Typography>
                <DateRangeButton />
                <SalesModeSwitch classes={{ root: classes.salesModeSwitch }} />
            </Grid>
        );
    }
}

export default withStyles(styles)(Header);
