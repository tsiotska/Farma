import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles, createStyles, WithStyles, Divider } from '@material-ui/core';
import Dialog from '../../../components/Dialog';
import { ADD_DEPARTMENT_MODAL } from '../../../constants/Modals';
import { observable } from 'mobx';
import FFMBlock from '../FFMBlock';
import DepartmentBlock from '../DepartmentBlock';

const styles = (theme: any) => createStyles({
});

interface IProps extends WithStyles<typeof styles> {
    openedModal?: string;
    openModal?: (modalName: string) => void;
}

export enum TARGET_IMAGE {
    FFM,
    DEPARTMENT
}

interface IDepartmentData {
    image: File;
    name: string;
}

interface IFFMData {
    image: File;
    name: string;
    phone: string;
    card: string;
    email: string;
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
class AddDepartmentModal extends Component<IProps> {
    @observable departmentData: IDepartmentData = {
        image: null,
        name: ''
    };

    @observable ffmData: IFFMData = {
        image: null,
        name: '',
        phone: '',
        card: '',
        email: '',
    };

    appendImage = (targetProp: TARGET_IMAGE) => (image: File) => {
        if (targetProp === TARGET_IMAGE.FFM) {
            this.ffmData.image = image;
        } else if (targetProp === TARGET_IMAGE.DEPARTMENT) {
            this.departmentData.image = image;
        }
    }

    removeImage = (targetProp: TARGET_IMAGE) => () => {
        if (targetProp === TARGET_IMAGE.DEPARTMENT) {
            this.departmentData.image = null;
        } else if (targetProp === TARGET_IMAGE.FFM) {
            this.ffmData.image = null;
        }
    }

    deparmentNameChangeHandler = ({ target: { value }}: any) => {
        this.departmentData.name = value;
    }

    submitHandler = (data: any) => {
        console.log('submit');
    }

    closeHandler = () => this.props.openModal(null);

    render() {
        const { openedModal } = this.props;

        return (
            <Dialog
                fullWidth
                open={openedModal === ADD_DEPARTMENT_MODAL}
                onClose={this.closeHandler}
                title='Додати відділення'>
                    <DepartmentBlock
                        file={this.departmentData.image}
                        departmentName={this.departmentData.name}
                        onNameChange={this.deparmentNameChangeHandler}
                        removeIcon={this.removeImage(TARGET_IMAGE.DEPARTMENT)}
                        appendFile={this.appendImage(TARGET_IMAGE.DEPARTMENT)} />
                        <Divider />
                    <FFMBlock />
            </Dialog>
        );
    }
}

export default withStyles(styles)(AddDepartmentModal);
