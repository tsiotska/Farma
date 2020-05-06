import React, { Component } from 'react';
import { createStyles, WithStyles } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { ISpecialty } from '../../../interfaces/ISpecialty';
import { ILPU } from '../../../interfaces/ILPU';
import Dialog from '../../../components/Dialog';
import FormRow from '../../../components/FormRow';
import { observable } from 'mobx';

const styles = (theme: any) => createStyles({
    submitButton: {
        marginLeft: 'auto',
    },
    header: {
        marginBottom: 10
    },
    menuItem: {
        minHeight: 36
    }
});

interface IProps extends WithStyles<typeof styles> {
    open: boolean;
    isLoading: boolean;
    onClose: () => void;
    onSubmit: (values: IDoctorModalValues) => void;
    lpus: ILPU[];
    title: string;
}

export interface IDoctorModalValues {
    [key: string]: string | ILPU | ISpecialty;
    name: string;
    lpu: ILPU;
    specialty: ISpecialty;
    homePhone: string;
    workPhone: string;
    card: string;
}

// @inject(() => ({
//     specialties
// }))
@observer
class DoctorModal extends Component<IProps> {
    readonly objectFields: Array<keyof IDoctorModalValues> = [ 'lpu', 'specialty' ];
    readonly initialFormValues: IDoctorModalValues = {
        name: '',
        lpu: null,
        specialty: null,
        homePhone: '',
        workPhone: '',
        card: '',
    };
    @observable formValues: IDoctorModalValues = { ...this.initialFormValues };

    changeHandler = (propName: keyof IDoctorModalValues, value: string) => {
        if (this.objectFields.includes(propName)) {
            this.formValues[propName] = value;
        } else {
            this.formValues[propName] = value;
        }
    }

    render() {
        const {
            classes,
            open,
            onClose,
            title
        } = this.props;
        return (
            <Dialog
            classes={{ title: classes.header }}
            open={open}
            onClose={onClose}
            title={title}
            fullWidth
            maxWidth='sm'>
                <FormRow
                    label='ПІБ'
                    values={this.formValues}
                    onChange={this.changeHandler}
                    propName='name'
                    required
                />
            </Dialog>
        );
    }
}

export default withStyles(styles)(DoctorModal);
