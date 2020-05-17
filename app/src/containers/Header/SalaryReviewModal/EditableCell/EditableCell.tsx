import React, { Component } from 'react';
import { WithStyles, withStyles, createStyles, Input } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import { IMedSalary } from '../../../../interfaces/ISalaryInfo';

const styles = createStyles({
    inputRoot: {
        maxWidth: 50,
        border: '1px solid #a7a7a7',
        margin: '0 2px',
        borderRadius: 2
    },
    input: {
        textAlign: 'center'
    }
});

interface IProps extends WithStyles<typeof styles> {
    values: [number, number];
    level: number;
    medId: number;
    changeMedSalary?: (level: number, medId: number, propName: keyof IMedSalary, value: number) => void;
    enableSubmitButton: () => void;
    disabledSubmit?: boolean;
}

@inject(({
             appState: {
                 userStore: {
                     changeMedSalary
                 }
             }
         }) => ({
    changeMedSalary
}))
@observer
class EditableCell extends Component<IProps> {
    readonly invalidNumberRegex = new RegExp(/^(0[1-9]+$)/); // match strings like 01234
    @observable bonusStringValue: string;

    amountChangeHandler = ({ target: { value } }: any) => {
        const {
            level,
            medId,
            changeMedSalary,
            enableSubmitButton,
            disabledSubmit
        } = this.props;
        const casted = +value;
        const isValid = value.length
            ? !Number.isNaN(casted)
            : true;
        if (isValid) {
            changeMedSalary(level, medId, 'amount', casted);
            if (disabledSubmit) {
                enableSubmitButton();
            }
        }
    }

    bonusChangeHandler = ({ target: { value } }: any) => {
        const {
            level,
            medId,
            changeMedSalary,
            enableSubmitButton,
            disabledSubmit
        } = this.props;
        const casted = value.length
            ? +value
            : null;

        const isValid = value.length
            ? Number.isNaN(casted) === false
            : true;

        if (isValid) {
            this.bonusStringValue = this.invalidNumberRegex.test(value) ? value[1] : value;
            changeMedSalary(level, medId, 'bonus', casted);
            if (disabledSubmit) {
                enableSubmitButton();
            }
        }
    }

    render() {
        const { classes, values } = this.props;

        return (
            <>
                <Input
                    classes={{
                        input: classes.input,
                        root: classes.inputRoot,
                    }}
                    value={values ? (values[0] || 0) : 0}
                    onChange={this.amountChangeHandler}
                    disableUnderline
                />
                <Input
                    classes={{
                        input: classes.input,
                        root: classes.inputRoot,
                    }}
                    value={this.bonusStringValue || (values ? (values[1] || 0) : 0)}
                    onChange={this.bonusChangeHandler}
                    disableUnderline
                />
            </>
        );
    }
}

export default withStyles(styles)(EditableCell);
