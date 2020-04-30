import React, { Component } from 'react';
import { createStyles, WithStyles } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IAsyncStatus } from '../../../stores/AsyncStore';
import { observable, computed } from 'mobx';
import { SNACKBAR_TYPE } from '../../../constants/Snackbars';
import { IPharmacyModalValues } from '../PharmacyModal/PharmacyModal';

const styles = (theme: any) => createStyles({});

interface IProps extends WithStyles<typeof styles> {
    getAsyncStatus?: (key: string) => IAsyncStatus;
    openModal?: (modalName: string) => void;
    openedModal?: string;
    editPharmacy?: (data: any) => boolean;
}

@inject(({
    appState: {
        uiStore: {
            openModal,
            openedModal
        },
        departmentsStore: {
            getAsyncStatus,
            editPharmacy
        }
    }
}) => ({
    getAsyncStatus,
    openModal,
    openedModal,
    editPharmacy,
}))
@observer
class EditPharmacy extends Component<IProps> {
    @observable openSnackbar: boolean = false;
    @observable snackbarType: SNACKBAR_TYPE = SNACKBAR_TYPE.SUCCESS;

    @computed
    get isLoading(): boolean {
        return this.props.getAsyncStatus('editPharmacy').loading;
    }

    snackbarCloseHandler = () => {
        this.openSnackbar = false;
    }

    closeHandler = () => this.props.openModal(null);

    submitHandler = async (formValues: IPharmacyModalValues) => {
        const { editPharmacy } = this.props;
        const lpuCreated = await editPharmacy(formValues);
        this.openSnackbar = true;
        this.snackbarType = !!lpuCreated
            ? SNACKBAR_TYPE.SUCCESS
            : SNACKBAR_TYPE.ERROR;
    }

    render() {
        return (
            <div>
                EditPharmacy
            </div>
        );
    }
}

export default withStyles(styles)(EditPharmacy);
