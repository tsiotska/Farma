import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

import { IMedicine } from '../../../interfaces/IMedicine';
import Dialog from '../../../components/Dialog';
import Dropzone from '../Dropzone';
import FormContent from '../FormContent';
import { IFormValues } from '../FormContent/FormContent';

interface IProps {
    open: boolean;
    title: string;
    isLoading: boolean;
    onClose: () => void;
    onSubmit: (image: File | string, data: IFormValues) => void;
    defaultMedicine?: IMedicine;
}

@observer
class MedsModal extends Component<IProps> {
    @observable image: File | string;
    contentRef: any;

    appendImage = (image: File) => {
        this.image = image;
    }

    removeImage = () => {
        this.image = null;
    }

    submitHandler = (data: IFormValues) => this.props.onSubmit(this.image, data);

    componentDidUpdate(prevProps: IProps) {
        if (!this.contentRef) return;

        const { open: wasOpened } = prevProps;
        const { open: isOpen, defaultMedicine } = this.props;

        const becomeOpen = wasOpened === false && isOpen === true;
        const becomeClosed = wasOpened === true && isOpen === false;

        if (becomeClosed) {
            this.image = null;
            this.contentRef.resetValues();
            this.contentRef.removeEventListener();
        } else if (becomeOpen) {
            this.contentRef.resetValues(defaultMedicine);
            this.contentRef.addEventListener();
            if (defaultMedicine) {
                const { image } = defaultMedicine;
                this.image = image;
            }
        }
    }

    render() {
        const {
            open,
            isLoading,
            onClose,
            title
        } = this.props;

        return (
            <Dialog
                disablePortal
                open={open}
                onClose={onClose}
                title={title}
                maxWidth='md'>
                <Dropzone
                    appendImage={this.appendImage}
                    image={this.image}
                    removeImage={this.removeImage}
                />
                <FormContent
                    ref={(component: any) => this.contentRef = component}
                    file={this.image}
                    submitHandler={this.submitHandler}
                    isLoading={isLoading}
                />
            </Dialog>
        );
    }
}

export default MedsModal;
