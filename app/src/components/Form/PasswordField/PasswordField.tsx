import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Input} from '@material-ui/core';
import { ITextFieldProps } from '../TextField/TextField';
import {VisibilityOutlined} from '@material-ui/icons';
import {observable} from 'mobx';

interface IPasswordFieldProps extends ITextFieldProps {
    showAdornment?: boolean;
    classes: 'adornment' | any;
}

@observer
class PasswordField extends Component<IPasswordFieldProps> {
    @observable hidePassword: boolean = true;

    mouseDownHandler = () => this.hidePassword = false;
    mouseUpHandler = () => this.hidePassword = true;

    render() {
        const {
            label,
            input,
            classes,
            meta: { touched, error, submitError },
            ErrorComponent,
            showAdornment,
        ...custom
        } = this.props;
        const {type, ...inputProps} = input;

        const { adornment, ...inputClasses } = classes;
        const isError = (touched && error) || submitError;
        const inputType = this.hidePassword
            ? 'password'
            : 'text';
        return (
            <>
                <Input
                    label={label}
                    disableUnderline
                    classes={inputClasses}
                    type={inputType}
                    error={isError}
                    endAdornment={
                        <VisibilityOutlined
                            onMouseDown={this.mouseDownHandler}
                            onMouseUp={this.mouseUpHandler}
                            cursor='pointer'
                            fontSize='small'
                            color='primary'
                            className={adornment} />
                    }
                    {...inputProps}
                    {...custom}
                />
                { !!ErrorComponent && <ErrorComponent isError={isError} />}
            </>
        );
    }
}

export default PasswordField;
