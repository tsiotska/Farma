import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles, WithStyles, createStyles, Grid, LinearProgress } from '@material-ui/core';
import { ILPU } from '../../../interfaces/ILPU';
import ListItem from '../ListItem';
import { ILocation } from '../../../interfaces/ILocation';
import { withRouter, RouteComponentProps, matchPath } from 'react-router-dom';
import { PHARMACY_ROUTE, LPU_ROUTE } from '../../../constants/Router';
import { EDIT_LPU_MODAL, EDIT_PHARMACY_MODAL } from '../../../constants/Modals';

const styles = createStyles({});

interface IProps extends WithStyles<typeof styles>, Partial<RouteComponentProps<any>> {
    data: ILPU[];
    unconfirmed: boolean;
    regions?: Map<number, ILocation>;
    openModal?: (modalName: string, payload: any) => void;
}

@inject(({
    appState: {
        departmentsStore: {
            regions,
        },
        uiStore: {
            openModal
        }
    }
}) => ({
    regions,
    openModal
}))
@withRouter
@observer
class PharmaciesList extends Component<IProps> {
    editClickHandler = (lpu: ILPU) => {
        const { openModal, history: { location: { pathname }}} = this.props;
        let targetModal: string;
        if (!!matchPath(pathname, LPU_ROUTE)) targetModal = EDIT_LPU_MODAL;
        if (!!matchPath(pathname, PHARMACY_ROUTE)) targetModal = EDIT_PHARMACY_MODAL;
        if (targetModal) openModal(targetModal, lpu);
    }

    // TODO: pagination, sort, search
    render() {
        const {
            data,
            unconfirmed,
            regions,
        } = this.props;

        return (
            <>
                <Grid direction='column' container>
                    {
                        data.map(pharmacy => (
                            <ListItem
                                key={pharmacy.id}
                                pharmacy={pharmacy}
                                unconfirmed={unconfirmed}
                                region={regions.get(pharmacy.region)}
                                editClickHandler={this.editClickHandler}
                            />
                        ))
                    }
                </Grid>
            </>
        );
    }
}

export default withStyles(styles)(PharmaciesList);
