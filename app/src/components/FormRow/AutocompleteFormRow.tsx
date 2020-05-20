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
import Autocomplete from '@material-ui/lab/Autocomplete';
import cx from 'classnames';

interface IAutosuggestProps<T> extends IProps<T> {
    renderPropName?: keyof T;
}

@observer
class AutocompleteFormRow<T> extends Component<IAutosuggestProps<T>> {
    @computed
    get renderPropTitle(): (value: any) => string {
        const { renderPropName } = this.props;
        return renderPropName
            ? ({ [renderPropName]: title }: any) => (title || '')
            : (title: string) => (title || '');
    }

    // TODO: Треба посетити ізначальне значення в Autocomplete або зробити його повністю контролюємим
    @computed
    get getSelectedItem() {
        const {
            options,
            value,
            renderPropName
        } = this.props;
       /* console.log('value')
        console.log(value)*/
        if (!value || !options) return '';
        if (typeof value === 'object') {
            const targetValue = value[renderPropName];
            return options
                ? options.find((x: any) => x[renderPropName] === targetValue)
                : '';
        }
        return options.find((x: any) => x === value) || '';
    }

    changeHandler = (event: any, value: any) => {
        const { onChange, propName } = this.props;
        onChange(propName, value);
    }

    public render() {
        const {
            classes,
            error,
            label,
            disabled,
            renderPropName,
            required,
            options,
            id
        } = this.props;
        const preparedOptions = options.map((opt: any) => (opt[renderPropName]));

        return (
            <FormControl disabled={disabled} className={classes.root} error={!!error}>
                <InputLabel className={classes.labelRoot} disableAnimation shrink required={required}>
                    {label}
                </InputLabel>

                <Autocomplete
                    className={cx(classes.autoComplete)}
                    onChange={this.changeHandler}
                    options={preparedOptions}
                    // getOptionLabel={this.renderPropTitle}
                    renderInput={(params) => {
                        return <TextField className={classes.input} {...params}
                                          InputProps={{ ...params.InputProps, disableUnderline: true }}/>;
                    }}
                    defaultValue={this.getSelectedItem}
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