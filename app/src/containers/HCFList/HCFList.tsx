import React, { Component } from 'react';
import { createStyles, WithStyles, Grid } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import PharmaciesList from './PharmaciesList';
import Header from './Header';
import { ILPU } from '../../interfaces/ILPU';

const styles = (theme: any) => createStyles({
    root: {},
    pagination: {
        margin: '16px 0 60px auto'
    }
});

interface IProps extends WithStyles<typeof styles> {
    data?: ILPU[];
    showHeader?: boolean;
    confirmHandler?: (pharmacy: ILPU) => void;
    unconfirmed?: boolean;
    onDelete?: (deleted: boolean) => void;
}

@observer
class HCFList extends Component<IProps> {
    render() {
        const {
            classes,
            data,
            showHeader,
            unconfirmed,
            onDelete,
            confirmHandler
        } = this.props;

        return (
            <Grid direction='column' className={classes.root} container>
                { showHeader && <Header />}
                <PharmaciesList
                    confirmHandler={confirmHandler}
                    onDelete={onDelete}
                    data={data}
                    unconfirmed={unconfirmed} />
            </Grid>
        );
    }
}

export default withStyles(styles)(HCFList);
