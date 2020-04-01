import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Typography, Button } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IAsyncStatus } from '../../stores/AsyncStore';
import UncommitedPharmacies from './UncommitedPharmacies';
import PharmaciesList from './PharmaciesList';
import PharmaciesHeader from './PharmaciesHeader';

const styles = (theme: any) => createStyles({
    root: {
        padding: '0 20px'
    },
    header: {
        margin: '24px 0'
    },
    headerText: {
        fontFamily: 'Source Sans Pro SemiBold',
        color: theme.palette.primary.gray.light
    },
    headerCell: {},
    nameCell: {},
    regionCell: {
        minWidth: 130,
    },
    oblastCell: {
        minWidth: 130,
    },
    cityCell: {
        minWidth: 130,
    },
    addressCell: {},
    phoneCell: {
        minWidth: 170
    },
});

interface IProps extends WithStyles<typeof styles> {
    getAsyncStatus?: (key: string) => IAsyncStatus;
    loadPharmacies?: (isInitial: boolean) => void;
}

@inject(({
    appState: {
        departmentsStore: {
            getAsyncStatus,
            loadPharmacies
        }
    }
}) => ({
    getAsyncStatus,
    loadPharmacies
}))
@observer
class Pharmacy extends Component<IProps> {
    readonly headerClasses: any;

    constructor(props: IProps) {
        super(props);
        const { classes } = props;
        this.headerClasses = {
            text: classes.headerText,
            cell: classes.headerCell,
            name: classes.nameCell,
            region: classes.regionCell,
            oblast: classes.oblastCell,
            city: classes.cityCell,
            address: classes.addressCell,
            phone: classes.phoneCell,
        };
    }

    componentDidMount() {
        const { getAsyncStatus, loadPharmacies } = this.props;
        const { loading, success } = getAsyncStatus('loadPharmacies');
        const shouldLoadPharmacies = loading === false && success === false;
        if (shouldLoadPharmacies) loadPharmacies(true);
    }

    render() {
        const { classes } = this.props;

        return (
            <Grid direction='column' className={classes.root} container>
                <UncommitedPharmacies />
                <Grid className={classes.header} justify='space-between' alignItems='center' container>
                    <Typography>
                        Аптеки
                    </Typography>
                    <Button>
                        Додати Аптеку
                    </Button>
                </Grid>
                <PharmaciesHeader classes={this.headerClasses} />
                <PharmaciesList />
            </Grid>
        );
    }
}

export default withStyles(styles)(Pharmacy);
