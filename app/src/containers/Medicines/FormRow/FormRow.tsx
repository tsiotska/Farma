import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    FormControl,
    InputLabel,
    Input,
    FormHelperText
} from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';

const styles = (theme: any) => createStyles({
    root: {
        margin: '10px 0 6px',
    },
    input: {},
    labelRoot: {},
    helperText: {}
});

interface IProps extends WithStyles<typeof styles> {
    label: string;
    value: string;
    error: boolean | string;
    onChange: (e: any) => void;
}

@observer
class FormRow extends Component<IProps> {
    render() {
        const {
            classes,
            label,
            value,
            onChange,
            error
        } = this.props;

        return (
            <FormControl className={classes.root} error={!!error}>
                <InputLabel className={classes.labelRoot} disableAnimation shrink>
                    { label }
                </InputLabel>
                <Input
                    className={classes.input}
                    value={value}
                    onChange={onChange}
                    disableUnderline />
                {
                    !!error && typeof error === 'string' &&
                    <FormHelperText className={classes.helperText}>{error}</FormHelperText>
                }
            </FormControl>
        );
    }
}

export default withStyles(styles)(FormRow);
