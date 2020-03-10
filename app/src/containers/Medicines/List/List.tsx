import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import { observer } from 'mobx-react';
import { IMedicine } from '../../../interfaces/IMedicine';
import ListItem from '../ListItem';

interface IProps {
    meds: IMedicine[];
}

@observer
class List extends Component<IProps> {
    render() {
        const { meds } = this.props;

        return (
            <Grid direction='column' container>
                {
                    meds.map(medicine => (
                        <ListItem key={medicine.id} medicine={medicine} />
                    ))
                }
            </Grid>
        );
    }
}

export default List;
