import React, { Component } from 'react';
import {
    FormControl,
    InputLabel,
    Input,
    FormHelperText
} from '@material-ui/core';
import { observer } from 'mobx-react';
import { IProps } from '.';

@observer
class InputFormRow<T> extends Component<IProps<T>> {
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
            required,
            value,
        } = this.props;

        return (
            <FormControl className={classes.root} error={!!error}>
                <InputLabel
                    className={classes.labelRoot}
                    required={required}
                    disableAnimation
                    shrink>
                    { label }
                </InputLabel>
                <Input
                    className={classes.input}
                    value={
                        value === undefined
                        ? values[propName]
                        : value
                    }
                    onChange={this.changeHandler}
                    disableUnderline
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

export default InputFormRow;
