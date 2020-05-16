import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { IMedicine } from '../../../interfaces/IMedicine';
import ListItem from '../ListItem';
import { withRestriction } from '../../../components/hoc/withRestriction';
import { IWithRestriction } from '../../../interfaces';
import { PERMISSIONS } from '../../../constants/Permissions';
import { computed, observable } from 'mobx';
import { IDeletePopoverSettings } from '../../../stores/UIStore';
import { SNACKBAR_TYPE } from '../../../constants/Snackbars';
import Snackbar from '../../../components/Snackbar';

interface IProps extends IWithRestriction {
    meds: IMedicine[];
    openDelPopper?: (settings: IDeletePopoverSettings) => void;
    removeMeds?: (id: number) => boolean;
}

@inject(({
    appState: {
        uiStore: {
            openDelPopper
        },
        departmentsStore: {
            removeMeds
        },
    }
}) => ({
    openDelPopper,
    removeMeds
}))
@withRestriction([PERMISSIONS.EDIT_DRUG])
@observer
class List extends Component<IProps> {
    @observable showSnackbar: boolean = false;
    @observable snackbarType: SNACKBAR_TYPE = SNACKBAR_TYPE.SUCCESS;

    @computed
    get meds(): IMedicine[] {
        const { meds, isAllowed: showRemovedMeds } = this.props;
        return showRemovedMeds
            ? meds
            : meds.filter(({ deleted }) => !deleted);
    }

    deleteHandler = (medId: number) => async (confirmed: boolean) => {
        const { openDelPopper, removeMeds } = this.props;
        openDelPopper(null);
        if (!confirmed) return;
        const isRemoved = await removeMeds(medId);
        this.snackbarType = isRemoved
            ? SNACKBAR_TYPE.SUCCESS
            : SNACKBAR_TYPE.ERROR;
        this.showSnackbar = true;
    }

    snackbarCloseHandler = () => {
        this.showSnackbar = false;
    }

    render() {
        const { isAllowed } = this.props;

        return (
            <>
            <Snackbar
                open={this.showSnackbar}
                type={this.snackbarType}
                onClose={this.snackbarCloseHandler}
                message={
                    this.snackbarType === SNACKBAR_TYPE.SUCCESS
                        ? 'Медикамент успішно видалена'
                        : 'Видалити медикамент не вдалося'
                }
            />
            <Grid direction='column' container>
                {
                    this.meds.map(medicine => (
                        <ListItem
                            key={medicine.id}
                            medicine={medicine}
                            allowEdit={isAllowed}
                            deleteHandler={this.deleteHandler}
                        />
                    ))
                }
            </Grid>
            </>
        );
    }
}

export default List;
