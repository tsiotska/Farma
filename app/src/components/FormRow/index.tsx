import React, { Component } from 'react';
import { createStyles, WithStyles, withStyles } from '@material-ui/core';
import { observer } from 'mobx-react';
import InputFormRow from './InputFormRow';
import SelectFormRow from './SelectFormRow';

export const styles = (theme: any) => createStyles({
    root: {
        margin: '10px 0 6px',
        width: ({ fullWidth }: any) => fullWidth
            ? '100%'
            : '48%',
    },
    input: {},
    labelRoot: {},
    helperText: {}
});

export interface IProps<T> extends WithStyles<typeof styles> {
    label: string;
    values: T;
    value?: number | string;
    propName: keyof T;
    onChange: (propName: keyof T, value: string) => void;
    error: boolean | string;
    disabled?: boolean;
    required?: boolean;
    fullWidth?: boolean;
    password?: boolean;
}

interface IFormRowProps<T> extends IProps<T> {
    select?: boolean;
}

@observer
class FormRow extends Component<IFormRowProps<any>> {
    render() {
        const { select, ...inputProps } = this.props;

        return select
            ? <SelectFormRow {...inputProps} />
            : <InputFormRow { ...inputProps} />;
    }
}

export default withStyles(styles)(FormRow);
