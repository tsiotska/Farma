import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, MenuItem, Button } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { observable, computed } from 'mobx';
import { ILocation } from '../../../interfaces/ILocation';
import { ILPU } from '../../../interfaces/ILPU';
import Dialog from '../../../components/Dialog';
import FormRow from '../FormRow';
import { ILpuModalValues } from '../../Lpu/LpuModal/LpuModal';
import SelectFormRow from '../FormRow/SelectFormRow';

const styles = (theme: any) => createStyles({
    submitButton: {
        marginLeft: 'auto',
    },
    header: {
        marginBottom: 10
    }
});

interface IProps extends WithStyles<typeof styles> {
    open: boolean;
    isLoading: boolean;
    title: string;
    onClose: () => void;
    onSubmit: (values: IPharmacyModalValues) => void;

    initialPharmacy?: ILPU;
    oblasti?: Map<number, ILocation>;
    loadSpecificCities?: (oblastName: string) => Promise<ILocation[]>;
    loadSpecificLpus?: (cityId: number) =>  Promise<ILPU[]>;
    loadTypes?: (targetProp: 'hcf' | 'pharmacy') => Promise<string[]>;
}

export interface IPharmacyModalValues {
    name: string;
    oblast: string;
    city: ILocation;
    lpu: string;
    address: string;
    phone1: string;
    phone2: string;
    type: string;
}

@inject(({
    appState: {
        departmentsStore: {
            oblasti,
            loadSpecificCities,
            loadSpecificLpus,
            loadTypes,
        }
    }
}) => ({
    oblasti,
    loadSpecificCities,
    loadSpecificLpus,
    loadTypes,
}))
@observer
class PharmacyModal extends Component<IProps> {
    oblastReactionDispose: any;
    cityReactionDispose: any;

    @observable cities: ILocation[] = [];
    @observable types: string[] = [];
    @observable lpus: ILPU[] = [];

    @observable errors: Map<keyof IPharmacyModalValues, boolean | string> = new Map();
    @observable optionalFields: Array<keyof IPharmacyModalValues> = [ 'phone1', 'phone2' ];
    @observable formValues: IPharmacyModalValues = {
        name: '',
        oblast: '',
        lpu: '',
        city: null,
        type: '',
        address: '',
        phone1: '',
        phone2: '',
    };

    readonly errorMessages: {[key: string]: string} = {
        phone1: 'Телефон має скададатись з 10 або 12 цифр',
        phone2: 'Телефон має скададатись з 10 або 12 цифр',
        default: 'Значення має містити не менше 3 символів'
    };

    @computed
    get allowSubmit(): boolean {
        return true;
    }

    submitHandler = () => {
        console.log('submit handler');
    }

    changeHandler = (propName: keyof ILpuModalValues, value: string) => {
        console.log('change handler');
    }

    render() {
        const {
            open,
            onClose,
            title,
            classes
        } = this.props;

        return (
            <>
            <Dialog
                classes={{ title: classes.header }}
                open={open}
                onClose={onClose}
                title={title}
                fullWidth
                maxWidth='sm'>
                    <FormRow
                        label='Назва'
                        values={this.formValues}
                        onChange={this.changeHandler}
                        propName='name'
                        error={this.errors.get('name')}
                        required
                    />
                    <Grid justify='space-between' container>
                        <SelectFormRow
                            label='Область'
                            values={this.formValues}
                            onChange={this.changeHandler}
                            propName='oblast'
                            required
                            error={this.errors.get('oblast')}>
                                {/* {
                                    this.oblastListItems.map(name => (
                                        <MenuItem key={name} value={name}>
                                            { name }
                                        </MenuItem>
                                    ))
                                } */}
                        </SelectFormRow>
                        <FormRow
                            label='Адрес'
                            values={this.formValues}
                            onChange={this.changeHandler}
                            propName='name'
                            error={this.errors.get('name')}
                            required
                        />
                        <SelectFormRow
                            label='Місто'
                            values={this.formValues}
                            onChange={this.changeHandler}
                            propName='oblast'
                            required
                            error={this.errors.get('oblast')}>
                                {/* {
                                    this.oblastListItems.map(name => (
                                        <MenuItem key={name} value={name}>
                                            { name }
                                        </MenuItem>
                                    ))
                                } */}
                        </SelectFormRow>
                        <FormRow
                            label='Телефон 1'
                            values={this.formValues}
                            onChange={this.changeHandler}
                            propName='name'
                            error={this.errors.get('name')}
                            required
                        />
                        <SelectFormRow
                            label='ЛПУ'
                            values={this.formValues}
                            onChange={this.changeHandler}
                            propName='oblast'
                            required
                            error={this.errors.get('oblast')}>
                                {/* {
                                    this.oblastListItems.map(name => (
                                        <MenuItem key={name} value={name}>
                                            { name }
                                        </MenuItem>
                                    ))
                                } */}
                        </SelectFormRow>
                        <FormRow
                            label='Телефон 2'
                            values={this.formValues}
                            onChange={this.changeHandler}
                            propName='name'
                            error={this.errors.get('name')}
                            required
                        />
                        <SelectFormRow
                            label='Тип'
                            values={this.formValues}
                            onChange={this.changeHandler}
                            propName='oblast'
                            required
                            error={this.errors.get('oblast')}>
                                {/* {
                                    this.oblastListItems.map(name => (
                                        <MenuItem key={name} value={name}>
                                            { name }
                                        </MenuItem>
                                    ))
                                } */}
                        </SelectFormRow>
                    </Grid>
                    <Button
                        variant='contained'
                        color='primary'
                        className={classes.submitButton}
                        onClick={this.submitHandler}
                        disabled={!this.allowSubmit}>
                        Зберегти
                    </Button>
            </Dialog>
            </>
        );
    }
}

export default withStyles(styles)(PharmacyModal);
