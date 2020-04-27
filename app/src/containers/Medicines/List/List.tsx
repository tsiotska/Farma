import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import { observer } from 'mobx-react';
import { IMedicine } from '../../../interfaces/IMedicine';
import ListItem from '../ListItem';
import { withRestriction } from '../../../components/hoc/withRestriction';
import { IWithRestriction } from '../../../interfaces';
import { PERMISSIONS } from '../../../constants/Permissions';
import { computed } from 'mobx';

interface IProps extends IWithRestriction {
    meds: IMedicine[];
}

@withRestriction([PERMISSIONS.EDIT_DRUG])
class List extends Component<IProps> {
    @computed
    get meds(): IMedicine[] {
        const { meds, isAllowed: showRemovedMeds } = this.props;
        return showRemovedMeds
        ? meds
        : meds.filter(({ deleted }) => !deleted);
    }

    render() {
        const { meds, isAllowed } = this.props;

        return (
            <Grid direction='column' container>
                {
                    this.meds.map(medicine => (
                        <ListItem
                            key={medicine.id}
                            medicine={medicine}
                            allowEdit={isAllowed}
                        />
                    ))
                }
            </Grid>
        );
    }
}

export default List;
