import React, {Component} from 'react';
import {InputProps} from '@material-ui/core/Input';
import {observer} from 'mobx-react';
import {Input} from '@material-ui/core';

export interface ITextFieldProps extends InputProps {
    label: any;
    input: any;
    meta: any;
    ErrorComponent?: any;
}

@observer
class TextField extends Component<ITextFieldProps> {
    render() {
        const {
            label,
            input,
            classes,
            meta: { touched, error, submitError },
            ErrorComponent,
            ...custom
        } = this.props;

        const isError = (touched && error) || submitError;

        return (
            <>
                <Input
                    label={label}
                    disableUnderline
                    classes={classes}
                    error={isError}
                    {...input}
                    {...custom}
                />
                {
                    !!ErrorComponent && <ErrorComponent isError={isError} />
                }
            </>
        );
    }
}

export default TextField;
