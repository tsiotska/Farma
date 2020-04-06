import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, toJS, computed } from 'mobx';
import { ADD_MEDICINE_MODAL } from '../../../constants/Modals';
import Dialog from '../../../components/Dialog';
import PhotoDropzone from '../PhotoDropzone';
import FormContent from '../FormContent';
import { IAsyncStatus } from '../../../stores/AsyncStore';
import Snackbar, { SNACKBAR_TYPE } from '../Snackbar/Snackbar';

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
            getAsyncStatus
        },
        departmentsStore: {
            addMedicine
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

    submitHandler = async (data: any) => {
        const { addMedicine } = this.props;

        const intValues = ['dosage', 'bonus', 'price'];
        const namesMap: Readonly<any> = {
            name: 'name',
            dosage: 'dosage',
            bonus: 'mark',
            releaseForm: 'release_form',
            manufacturer: 'manufacturer',
            price: 'price',
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
                        <PhotoDropzone
                            removeFile={this.removeImage}
                            file={this.image}
                            appendFile={this.appendImage}
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
                />
            </>
        );
    }
}

export default AddMedsModal;
