import React, { Component } from 'react';
import { createStyles, WithStyles, Grid } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import PharmaciesList from './PharmaciesList';
import Header from './Header';
import { ILPU } from '../../interfaces/ILPU';

const styles = (theme: any) => createStyles({
    root: {
        textTransform: 'capitalize'
    },
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
    type: 'hcf' | 'pharmacy';
    clearLpuSorting?: () => void;
    clearLpuFilters?: () => void;
}

@inject(({
    appState: {
        uiStore: {
            clearLpuSorting,
            clearLpuFilters
        }
    }
}) => ({
    clearLpuSorting,
    clearLpuFilters
}))
@observer
class HCFList extends Component<IProps> {
    componentWillUnmount() {
        const {unconfirmed, clearLpuSorting, clearLpuFilters} = this.props;
        if (!unconfirmed) {
            clearLpuSorting();
            clearLpuFilters();
        }
    }
    render() {
        const {
            classes,
            data,
            showHeader,
            unconfirmed,
            onDelete,
            confirmHandler,
            type
        } = this.props;

        return (
            <Grid direction='column' className={classes.root} container>
                { showHeader && <Header type={type} />}
                <PharmaciesList
                    confirmHandler={confirmHandler}
                    onDelete={onDelete}
                    data={data}
                    type={type}
                    unconfirmed={unconfirmed} />
            </Grid>
        );
    }
}

export default withStyles(styles)(HCFList);
