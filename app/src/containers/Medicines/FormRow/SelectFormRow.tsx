import React, { Component } from 'react';
import {
    WithStyles,
    FormControl,
    InputLabel,
    Input,
    FormHelperText,
    Select
} from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { styles } from './styles';

interface IProps extends WithStyles<typeof styles> {
    label: string;
    value: string;
    error: boolean | string;
    onChange: (e: any) => void;
    children?: any;
}

@observer
class FormRow extends Component<IProps> {
    render() {
        const {
            classes,
            label,
            value,
            children,
            onChange,
            error
        } = this.props;

        return (
            <FormControl className={classes.root} error={!!error}>
                <InputLabel className={classes.labelRoot} disableAnimation shrink>
                    { label }
                </InputLabel>
                <Select
                    className={classes.input}
                    onChange={onChange}
                    disableUnderline
                    value={value}>
                    { children }
                </Select>
                {
                    !!error && typeof error === 'string' &&
                    <FormHelperText className={classes.helperText}>{error}</FormHelperText>
                }
            </FormControl>
        );
    }
}

export default withStyles(styles)(FormRow);
