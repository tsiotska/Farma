import React, { Component } from 'react';
import {
    FormControl,
    InputLabel,
    FormHelperText,
    Input,
    TextField
} from '@material-ui/core';
import { observer } from 'mobx-react';
import { computed, toJS } from 'mobx';

import { IProps } from '.';
import Autocomplete, { RenderInputParams } from '@material-ui/lab/Autocomplete';
import cx from 'classnames';

interface IAutosuggestProps<T> extends IProps<T> {
    renderPropName?: keyof T;
}

@observer
class AutocompleteFormRow<T> extends Component<IAutosuggestProps<T>> {
    constructor(props: IAutosuggestProps<T>) {
        super(props);
        const { renderPropName } = props;
        this.renderPropTitle = renderPropName
            ? ({ [renderPropName]: title }: any) => (title || '')
            : (title: string) => (title || '');
    }

    renderPropTitle: (value: any) => string;

    changeHandler = (event: any, value: any) => {
        const { onChange, propName } = this.props;
        onChange(propName, value);
    }

    renderInput = (params: RenderInputParams) => (
        <TextField
            {...params}
            className={this.props.classes.input}
            InputProps={{ ...params.InputProps, disableUnderline: true }}
        />
    )

    public render() {
        const {
            classes,
            error,
            label,
            disabled,
            required,
            options,
            value
        } = this.props;

        return (
            <FormControl disabled={disabled} className={classes.root} error={!!error}>
                <InputLabel className={classes.labelRoot} disableAnimation shrink required={required}>
                    {label}
                </InputLabel>

                <Autocomplete
                    value={value}
                    className={cx(classes.autoComplete)}
                    onChange={this.changeHandler}
                    options={options}
                    getOptionLabel={this.renderPropTitle}
                    renderInput={this.renderInput}
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
