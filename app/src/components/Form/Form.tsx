import React, {PureComponent, useState} from 'react';
import {Field, Form as FinalForm} from 'react-final-form';
import { observer } from 'mobx-react';

import {
    createStyles,
    withStyles,
    WithStyles
} from '@material-ui/core';

const styles = createStyles({
    form: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
    }
});

interface IAnyObject {
    [key: string]: any;
}

interface IProps extends WithStyles<typeof styles> {
    onSubmit: (values: any) => void;
    validate?: (values: IAnyObject) => IAnyObject | Promise<IAnyObject>;
    resetAfterSubmit?: boolean;
    initialValues?: any;
}

@observer
class Form extends PureComponent<IProps, null> {
    render() {
        const {
            classes,
            onSubmit,
            validate,
            children,
            initialValues,
            resetAfterSubmit,
        } = this.props;

        return (
            <FinalForm
                initialValues={initialValues}
                onSubmit={onSubmit}
                validate={validate}
                render={({ handleSubmit, form: {reset} }: any) => {
                    const submitHandler = resetAfterSubmit
                        ? (e: any) => handleSubmit(e).then(reset)
                        : handleSubmit;

                    return (
                        <form
                            onSubmit={submitHandler}
                            onReset={reset}
                            className={classes.form}>
                            { children }
                        </form>
                    );
                }}>
            </FinalForm>
        );
    }
}

export default withStyles(styles)(Form);
