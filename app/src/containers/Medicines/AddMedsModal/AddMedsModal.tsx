import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, computed, toJS } from 'mobx';
import { ADD_MEDICINE_MODAL } from '../../../constants/Modals';
import Dialog from '../../../components/Dialog';
import FormContent from '../FormContent';
import { IAsyncStatus } from '../../../stores/AsyncStore';
import { SNACKBAR_TYPE } from '../../../constants/Snackbars';
import Snackbar from '../../../components/Snackbar';
import Dropzone from '../Dropzone';
import { IFormValues } from '../FormContent/FormContent';

interface IProps {
    openedModal?: string;
    openModal?: (modalName: string) => void;
    getAsyncStatus?: (key: string) => IAsyncStatus;
    addMedicine?: (data: any) => boolean;
}

@inject(({
    appState: {
        uiStore: {
            openedModal,
            openModal,
        },
        departmentsStore: {
            addMedicine,
            getAsyncStatus
        }
    }
}) => ({
    openedModal,
    openModal,
    getAsyncStatus,
    addMedicine
}))
@observer
class AddMedsModal extends Component<IProps> {
    @observable openSnackbar: boolean = false;
    @observable snackbarType: SNACKBAR_TYPE = SNACKBAR_TYPE.SUCCESS;
    @observable image: File;
    contentRef: any;

    @computed
    get isLoading(): boolean {
        return this.props.getAsyncStatus('addMedicine').loading;
    }

    appendImage = (image: File) => {
        this.image = image;
    }

    removeImage = () => {
        this.image = null;
    }

    closeHandler = () => {
        this.props.openModal(null);
    }

    snackbarCloseHandler = () => {
        this.openSnackbar = false;
    }

    submitHandler = async (data: IFormValues) => {
        const { addMedicine } = this.props;

        const intValues = ['dosage', 'mark', 'price'];
        const namesMap: Readonly<IFormValues> = {
            name: 'name',
            dosage: 'dosage',
            mark: 'mark',
            releaseForm: 'release_form',
            manufacturer: 'manufacturer',
            price: 'price',
            barcode: 'barcode'
        };

        const preparedData: any = Object.entries(data).reduce(
            (total, [ key, value ]) => {
                const newKey = namesMap[key];

                const converted = intValues.includes(key)
                ? +value
                : value;

                return (!!newKey && !!converted)
                ? { ...total, [newKey]: converted }
                : total;
            },
            {}
        );

        const json = JSON.stringify(preparedData);

        const payload = new FormData();
        payload.set('image', this.image);
        payload.set('json', json);

        const medicineAdded = await addMedicine(payload);
        this.openSnackbar = true;
        this.snackbarType = medicineAdded
        ? SNACKBAR_TYPE.SUCCESS
        : SNACKBAR_TYPE.ERROR;
    }

    componentDidUpdate(prevProps: IProps) {
        if (!this.contentRef) return;
        const { openedModal: prevOpenedModal} = prevProps;
        const { openedModal} = this.props;

        const wasOpen = prevOpenedModal === ADD_MEDICINE_MODAL;
        const isOpen = openedModal === ADD_MEDICINE_MODAL;

        const becomeClosed = wasOpen && !isOpen;
        const becomeOpen = !wasOpen && isOpen;

        if (becomeClosed) {
            this.image = null;
            this.contentRef.resetValues();
            this.contentRef.removeEventListener();
        } else if (becomeOpen) {
            this.contentRef.addEventListener();
        }
    }

    render() {
        const { openedModal } = this.props;

        return (
            <>
                <Dialog
                    disablePortal
                    open={openedModal === ADD_MEDICINE_MODAL}
                    onClose={this.closeHandler}
                    maxWidth='md'
                    title='Додати препарат'>
                        <Dropzone
                            appendImage={this.appendImage}
                            image={this.image}
                            removeImage={this.removeImage}
                        />
                        <FormContent
                            ref={(component: any) => this.contentRef = component}
                            file={this.image}
                            submitHandler={this.submitHandler}
                            isLoading={this.isLoading}
                        />
                </Dialog>
                <Snackbar
                    open={!!this.openSnackbar}
                    onClose={this.snackbarCloseHandler}
                    type={this.snackbarType}
                    autoHideDuration={6000}
                    anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
                    message={
                        this.snackbarType === SNACKBAR_TYPE.SUCCESS
                        ? 'Медикамент успішно додано'
                        : 'Неможливо додати медикамент'
                    }
                />
            </>
        );
    }
}

export default AddMedsModal;
