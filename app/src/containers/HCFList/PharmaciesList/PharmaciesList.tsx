import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles, WithStyles, createStyles, Grid } from '@material-ui/core';
import { ILPU } from '../../../interfaces/ILPU';
import ListItem from '../ListItem';
import { ILocation } from '../../../interfaces/ILocation';
import { withRouter, RouteComponentProps, matchPath } from 'react-router-dom';
import { PHARMACY_ROUTE, LPU_ROUTE } from '../../../constants/Router';
import { EDIT_LPU_MODAL, EDIT_PHARMACY_MODAL } from '../../../constants/Modals';
import { IDeletePopoverSettings } from '../../../stores/UIStore';

const styles = createStyles({});

interface IProps extends WithStyles<typeof styles>, Partial<RouteComponentProps<any>> {
    data: ILPU[];
    regions?: Map<number, ILocation>;
    openModal?: (modalName: string, payload: any) => void;
    deleteLpu?: (lpu: ILPU, unconfirmed: boolean) => boolean;
    deletePharmacy?: (lpu: ILPU, unconfirmed: boolean) => boolean;
    openDelPopper?: (settings: IDeletePopoverSettings) => void;
    onDelete?: (isRemoved: boolean) => void;
    confirmHandler?: (pharmacy: ILPU) => void;
    unconfirmed?: boolean;
    type: 'hcf' | 'pharmacy';
}

@inject(({
    appState: {
        departmentsStore: {
            regions,
            deleteLpu,
            deletePharmacy
        },
        uiStore: {
            openModal,
            openDelPopper
        }
    }
}) => ({
    regions,
    openModal,
    deleteLpu,
    deletePharmacy,
    openDelPopper
}))
@withRouter
@observer
class PharmaciesList extends Component<IProps> {
    editClickHandler = (lpu: ILPU) => {
        const { openModal, history: { location: { pathname } } } = this.props;
        let targetModal: string;
        if (!!matchPath(pathname, LPU_ROUTE)) targetModal = EDIT_LPU_MODAL;
        if (!!matchPath(pathname, PHARMACY_ROUTE)) targetModal = EDIT_PHARMACY_MODAL;
        if (targetModal) openModal(targetModal, lpu);
    }

    delCallback = (lpu: ILPU) => async (confirmed: boolean) => {
        const {
            openDelPopper,
            deleteLpu,
            deletePharmacy,
            onDelete,
            unconfirmed,
            history: { location: { pathname }}
        } = this.props;
        openDelPopper(null);
        if (!confirmed) return;
        let lpuDeleted: boolean = false;
        if (!!matchPath(pathname, LPU_ROUTE)) lpuDeleted = await deleteLpu(lpu, unconfirmed);
        if (!!matchPath(pathname, PHARMACY_ROUTE)) lpuDeleted = await deletePharmacy(lpu, unconfirmed);
        if (onDelete) onDelete(lpuDeleted);
    }

    deleteClickHandler = (lpu: ILPU, anchorEl: Element) => this.props.openDelPopper({
            anchorEl,
            callback: this.delCallback(lpu),
            name: 'lpuDelete'
        })

    render() {
        const {
            data,
            unconfirmed,
            regions,
            confirmHandler,
            type
        } = this.props;

        return (
            <>
                <Grid direction='column' container>
                    {
                        data.map(pharmacy => (
                            <ListItem
                                key={pharmacy.id}
                                pharmacy={pharmacy}
                                region={regions.get(pharmacy.region)}
                                editClickHandler={this.editClickHandler}
                                deleteClickHandler={this.deleteClickHandler}
                                confirmHandler={confirmHandler}
                                unconfirmed={unconfirmed}
                                type={type}
                            />
                        ))
                    }
                </Grid>
            </>
        );
    }
}

export default withStyles(styles)(PharmaciesList);
