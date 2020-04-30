import React, { Component } from 'react';
import { createStyles, WithStyles, FormControl, InputLabel, Input, FormHelperText } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { ILpuModalValues } from '../LpuModal/LpuModal';

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
    values: ILpuModalValues;
    propName: keyof ILpuModalValues;
    onChange: (propName: keyof ILpuModalValues, value: string) => void;
    error: boolean | string;
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
            required
        } = this.props;

        return (
            <FormControl className={classes.root} error={!!error}>
                <InputLabel className={classes.labelRoot} disableAnimation shrink required={required}>
                    { label }
                </InputLabel>
                <Input
                    className={classes.input}
                    value={values[propName]}
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

export default withStyles(styles)(FormRow);
