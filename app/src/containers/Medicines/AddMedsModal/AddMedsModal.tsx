import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import { ADD_MEDICINE_MODAL } from '../../../constants/Modals';
import Dialog from '../../../components/Dialog';
import PhotoDropzone from '../PhotoDropzone';
import FormContent from '../FormContent';
import Config from '../../../../Config';

interface IProps {
    openedModal?: string;
    openModal?: (modalName: string) => void;
}

@inject(({
    appState: {
        uiStore: {
            openedModal,
            openModal
        }
    }
}) => ({
    openedModal,
    openModal
}))
@observer
class AddMedsModal extends Component<IProps> {
    @observable image: File;
    contentRef: any;

    appendImage = (image: File) => {
        this.image = image;
    }

    removeImage = () => {
        this.image = null;
    }

    closeHandler = () => {
        this.props.openModal(null);
    }

    submitHandler = (data: any) => {
        console.log('submit data: ', data);
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
            <Dialog
                disablePortal
                open={openedModal === ADD_MEDICINE_MODAL}
                onClose={this.closeHandler}
                maxWidth='md'
                title='Добавить препарат'>
                    <PhotoDropzone
                        removeFile={this.removeImage}
                        file={this.image}
                        appendFile={this.appendImage}
                    />
                    <FormContent
                        ref={(component: any) => this.contentRef = component}
                        file={this.image}
                        submitHandler={this.submitHandler}
                    />
            </Dialog>
        );
    }
}

export default AddMedsModal;
