import React, { Component } from 'react';
import { createStyles, WithStyles, FormControl, InputLabel, Input, FormHelperText, Select } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IPharmacyModalValues } from '../PharmacyModal/PharmacyModal';

export const styles = (theme: any) => createStyles({
    root: {
        margin: '10px 0 6px',
        width: '48%',
    },
    input: {},
    labelRoot: {},
    helperText: {}
});

interface IProps extends WithStyles<typeof styles> {
    label: string;
    values: IPharmacyModalValues;
    propName: keyof IPharmacyModalValues;
    onChange: (propName: keyof IPharmacyModalValues, value: string) => void;
    error: boolean | string;
    disabled?: boolean;
    required?: boolean;
}

@observer
class FormRow extends Component<IProps> {
    changeHandler = ({ target: { value }}: any) => {
        const { onChange, propName } = this.props;
        onChange(propName, value);
    }

    render() {
        const {
            classes,
            values,
            error,
            label,
            propName,
            children,
            disabled,
            required
        } = this.props;

        return (
            <FormControl disabled={disabled} className={classes.root} error={!!error}>
                <InputLabel className={classes.labelRoot} disableAnimation shrink required={required}>
                    { label }
                </InputLabel>
                <Select
                    displayEmpty
                    className={classes.input}
                    onChange={this.changeHandler}
                    disableUnderline
                    value={values[propName]}>
                    { children }
                </Select>
                {
                    !!error && typeof error === 'string' &&
                    <FormHelperText className={classes.helperText}>
                        {error}
                    </FormHelperText>
                }
            </FormControl>
        );
    }
}

export default withStyles(styles)(FormRow);
