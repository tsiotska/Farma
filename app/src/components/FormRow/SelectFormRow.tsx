import React, { Component } from 'react';
import {
    FormControl,
    InputLabel,
    FormHelperText,
    Select
} from '@material-ui/core';
import { observer } from 'mobx-react';
import { IProps } from '.';

@observer
class SelectFormRow<T> extends Component<IProps<T>> {
    changeHandler = ({ target: { value }}: any) => {
        const { onChange, propName } = this.props;
        onChange(propName, value);
    }

    public render() {
        const {
            classes,
            error,
            label,
            propName,
            children,
            disabled,
            required,
            value,
            values,
            autoComplete
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
                    value={
                        value === undefined
                        ? values[propName]
                        : value
                    }>
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

export default SelectFormRow;
