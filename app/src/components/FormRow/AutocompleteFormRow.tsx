import React, { Component } from 'react';
import {
    FormControl,
    InputLabel,
    FormHelperText,
    TextField,
} from '@material-ui/core';
import { observer } from 'mobx-react';
import { IProps } from '.';
import Autocomplete from '@material-ui/lab/Autocomplete';
import cx from 'classnames';

@observer
class AutocompleteFormRow<T> extends Component<IProps<T>> {
    changeHandler = (event: any, value: any) => {
        const { onChange, propName } = this.props;
        onChange(propName, value);
    }

    getSelectedItem() {
        const {options, values, propName} = this.props;
        const item = options.find((opt: any) => {
            if (opt === values[propName]) {
                return opt;
            }
        });
        console.log(item);
        return item || {};
    }

    public render() {
        const {
            classes,
            error,
            label,
            propName,
            disabled,
            required,
            value,
            values,
            options,
            id
        } = this.props;

        return (
            <FormControl disabled={disabled} className={classes.root} error={!!error}>
                <InputLabel className={classes.labelRoot} disableAnimation shrink required={required}>
                    {label}
                </InputLabel>

                <Autocomplete
                    id={id}
                    value={this.getSelectedItem}
                    className={cx(classes.autoComplete)}
                    onChange={this.changeHandler}
                    options={options}
                    getOptionLabel={(option: any) => option}
                    renderInput={(params) => <TextField  {...params} />}
                />

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

export default AutocompleteFormRow;
