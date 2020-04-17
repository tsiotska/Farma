import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, toJS, computed } from 'mobx';
import { ADD_MEDICINE_MODAL } from '../../../constants/Modals';
import Dialog from '../../../components/Dialog';
import PhotoDropzone from '../../../components/PhotoDropzone';
import FormContent from '../FormContent';
import { IAsyncStatus } from '../../../stores/AsyncStore';
import { SNACKBAR_TYPE } from '../../../constants/Snackbars';
import Snackbar from '../../../components/Snackbar';
import { createStyles, WithStyles, withStyles, Backdrop } from '@material-ui/core';
import DropzoneContent from '../DropzoneContent';

const styles = (theme: any) => createStyles({
    dropzone: {
        minHeight: 300,
        border: `1px dashed ${theme.palette.primary.lightBlue}`,
        margin: '26px 0',
        display: 'flex',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    backdrop: {
        position: 'absolute',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column'
    },
});

interface IProps extends WithStyles<typeof styles> {
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
        const { openedModal, classes } = this.props;

        return (
            <>
                <Dialog
                    disablePortal
                    open={openedModal === ADD_MEDICINE_MODAL}
                    onClose={this.closeHandler}
                    maxWidth='md'
                    title='Додати препарат'>
                        <PhotoDropzone
                            classes={{
                                dropzone: classes.dropzone
                            }}
                            file={this.image}
                            appendFile={this.appendImage}>
                            {
                                (isHovered: boolean, isDragActive: boolean, openHandler: () => void) => {
                                    const colorTheme = this.image
                                    ? 'white'
                                    : 'black';

                                    return this.image
                                        ? <Backdrop className={classes.backdrop} open={isHovered}>
                                            <DropzoneContent
                                                fileAppended
                                                removeFile={this.removeImage}
                                                colorTheme={colorTheme}
                                                isDragActive={isDragActive}
                                                onButtonClick={openHandler} />
                                            </Backdrop>
                                        : <DropzoneContent
                                            fileAppended={false}
                                            removeFile={this.removeImage}
                                            colorTheme={colorTheme}
                                            isDragActive={isDragActive}
                                            onButtonClick={openHandler} />;
                                }
                            }
                        </PhotoDropzone>
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

export default withStyles(styles)(AddMedsModal);
