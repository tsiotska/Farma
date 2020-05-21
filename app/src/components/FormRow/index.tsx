import React, { Component } from 'react';
import { createStyles, WithStyles, withStyles } from '@material-ui/core';
import { observer } from 'mobx-react';
import InputFormRow from './InputFormRow';
import SelectFormRow from './SelectFormRow';
import AutocompleteFormRow from './AutocompleteFormRow';

export const styles = (theme: any) => createStyles({
    root: {
        margin: '10px 0 6px',
        width: ({ fullWidth }: any) => fullWidth
            ? '100%'
            : '48%',
    },
    input: {
        textIndent: 8,  // for select
        '& input': {
            textIndent: 8, // for input, autocomplete
        }
    },
    labelRoot: {},
    helperText: {},
    autoComplete: {
        marginTop: 16
    }
});

export interface IProps<T> extends WithStyles<typeof styles> {
    label: string;
    values: T;
    value?: number | string | T;
    propName: keyof T;
    onChange: (propName: keyof T, value: number | string | T) => void;
    error: boolean | string;
    disabled?: boolean;
    required?: boolean;
    fullWidth?: boolean;

    password?: boolean;
    options?: any;

    autoComplete?: boolean;
}

interface IFormRowProps<T> extends IProps<T> {
    select?: boolean;
 //   autoComplete?: boolean;
}

@observer
class FormRow extends Component<IFormRowProps<any>> {
    render() {
        const { select, autoComplete, ...inputProps } = this.props;

        return select
            ? <SelectFormRow {...inputProps} />
            : autoComplete ?
                <AutocompleteFormRow {...inputProps}/>
                : <InputFormRow {...inputProps} />;
    }
}

export default withStyles(styles)(FormRow);
