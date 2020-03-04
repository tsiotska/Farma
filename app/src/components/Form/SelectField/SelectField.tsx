import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {MenuItem, Select} from '@material-ui/core';
import cx from 'classnames';

interface ISelectFieldProps {
    customValidation?: (input: any, meta: any) => any;
    isDisabled?: boolean;
    fullWidth?: boolean;
    withDefault?: boolean;

    inputProps?: any;
    name: any;
    input: any;
    classes: any;
    options: any;
    errorClassName: any;
    meta: any;
}

@observer
class SelectField extends Component<ISelectFieldProps> {
    render() {
        const {
            name,
            input,
            classes,
            options,
            errorClassName,
            meta,
            inputProps,
            ...customProps
        } = this.props;

        const {
            customValidation,
            isDisabled,
            fullWidth = false,
            withDefault = true,
        } = customProps;

        const { touched, error } = meta;

        const  isError = customValidation
            ? customValidation(input, meta)
            : touched && error;

        return (
            <Select
                {...input}
                disableUnderline
                fullWidth={fullWidth}
                inputProps={{
                    name,
                    id: name,
                    disabled: isDisabled
                }}
                classes={{
                    root: cx(
                        {[classes.root]: !isError},
                        {[errorClassName]: isError }
                    ),
                    select: classes.select
                }}
            >
                {withDefault && <MenuItem />}
                {
                    options.map(({ key, value }: any) => (
                        <MenuItem key={key} value={value}>
                            {key}
                        </MenuItem>)
                    )
                }
            </Select>
        );
    }
}

export default SelectField;
