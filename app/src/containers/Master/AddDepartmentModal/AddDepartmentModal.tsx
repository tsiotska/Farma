import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles, createStyles, WithStyles, Divider, Typography } from '@material-ui/core';
import Dialog from '../../../components/Dialog';
import { ADD_DEPARTMENT_MODAL } from '../../../constants/Modals';
import { observable, computed, toJS } from 'mobx';
import FFMBlock from '../FFMBlock';
import DepartmentBlock from '../DepartmentBlock';

const styles = (theme: any) => createStyles({
    subtitle: {
        margin: '12px 0'
    }
});

interface IProps extends WithStyles<typeof styles> {
    openedModal?: string;
    openModal?: (modalName: string) => void;
}

export enum TARGET_IMAGE {
    FFM,
    DEPARTMENT
}

export interface IDepartmentData {
    image: File;
    name: string;
}

export interface IFFMData {
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
    readonly initialDepartmentData: IDepartmentData = {
        image: null,
        name: ''
    };
    readonly initialFfmData: IFFMData = {
        image: null,
        name: '',
        phone: '',
        card: '',
        email: '',
    };

    @observable departmentData: IDepartmentData = {...this.initialDepartmentData};

    @observable ffmData: IFFMData = {...this.initialFfmData};

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

    fmmDataChangeHandler = (propName: keyof Omit<IFFMData, 'image'>, value: string) => {
        this.ffmData[propName] = value;
    }

    submitHandler = (data: any) => {
        console.log('submit');
    }

    closeHandler = () => this.props.openModal(null);

    componentDidUpdate({ openedModal: prevModal }: IProps) {
        const { openedModal: currentModal } = this.props;
        const shouldClearValues = prevModal === ADD_DEPARTMENT_MODAL
            && currentModal !== ADD_DEPARTMENT_MODAL;

        if (shouldClearValues) {
            this.ffmData = {...this.initialFfmData};
            this.departmentData = {...this.initialDepartmentData};
        }
    }

    render() {
        const { openedModal, classes } = this.props;

        return (
            <Dialog
                fullWidth
                open={openedModal === ADD_DEPARTMENT_MODAL}
                onClose={this.closeHandler}
                title='Додати відділення'>
                    <DepartmentBlock
                        values={this.departmentData}
                        onNameChange={this.deparmentNameChangeHandler}
                        removeIcon={this.removeImage(TARGET_IMAGE.DEPARTMENT)}
                        appendFile={this.appendImage(TARGET_IMAGE.DEPARTMENT)}
                    />
                    <Divider />
                    <Typography variant='h5' className={classes.subtitle}>
                        Створити ФФМ
                    </Typography>
                    <FFMBlock
                        values={this.ffmData}
                        changeHandler={this.fmmDataChangeHandler}
                        appendFile={this.appendImage(TARGET_IMAGE.FFM)}
                        removeIcon={this.removeImage(TARGET_IMAGE.FFM)}
                    />
            </Dialog>
        );
    }
}

export default withStyles(styles)(AddDepartmentModal);
