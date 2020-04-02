import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles, WithStyles, createStyles, Grid, LinearProgress } from '@material-ui/core';
import { ILPU } from '../../../interfaces/ILPU';
import ListItem from '../ListItem';

const styles = createStyles({});

interface IProps extends WithStyles<typeof styles> {
    data: ILPU[];
    unconfirmed: boolean;
}

@observer
class PharmaciesList extends Component<IProps> {
    // TODO: pagination, sort, search
    render() {
        const { data, unconfirmed } = this.props;

        return (
            <>
                <Grid direction='column' container>
                    {
                        data.map(pharmacy => (
                            <ListItem
                                key={pharmacy.id}
                                pharmacy={pharmacy}
                                unconfirmed={unconfirmed}
                            />
                        ))
                    }
                </Grid>
            </>
        );
    }
}

export default withStyles(styles)(PharmaciesList);
