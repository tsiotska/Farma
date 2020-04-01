import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles, WithStyles, createStyles, Grid, LinearProgress } from '@material-ui/core';
import { ILPU } from '../../../interfaces/ILPU';
import ListItem from '../ListItem';

const styles = createStyles({});

interface IProps extends WithStyles<typeof styles> {
    isLoading: boolean;
    data: ILPU[];
}

@observer
class PharmaciesList extends Component<IProps> {
    // TODO: pagination, sort, search
    render() {
        const { data, isLoading } = this.props;

        return (
            <>
                { isLoading && <LinearProgress /> }
                <Grid direction='column' container>
                    {
                        data.map(pharmacy => (
                            <ListItem key={pharmacy.id} pharmacy={pharmacy} />
                        ))
                    }
                </Grid>
            </>
        );
    }
}

export default withStyles(styles)(PharmaciesList);
