import React, { Component } from 'react';
import {
    WithStyles,
    withStyles,
    createStyles,
    Grid,
    TextField
} from '@material-ui/core';
import { observer } from 'mobx-react';
import DepartmentDropzone from '../DepartmentDropzone';
import { IDepartmentData } from '../AddDepartmentModal/AddDepartmentModal';

const styles = createStyles({
    input: {
        width: 200,
        border: '1px solid #aaa',
        borderRadius: 2,
        marginBottom: 0
    },
    textField: {

    }
});

interface IProps extends WithStyles<typeof styles> {
    appendFile: (file: File) => void;
    removeIcon: () => void;
    onNameChange?: (e: any) => void;
    values?: IDepartmentData;
    invalidFields?: Set<keyof IDepartmentData>;
}

@observer
class DepartmentBlock extends Component<IProps> {
    appendFileHandler = (file: File) => this.props.appendFile(file);

    removeFileHandler = () => this.props.removeIcon();

    render() {
        const {
            classes,
            onNameChange,
            invalidFields,
            values: {
                name,
                image
            }
         } = this.props;

        return (
            <Grid alignItems='center' wrap='nowrap'  container>
                <DepartmentDropzone
                    file={image}
                    error={invalidFields.has('image')}
                    removeIcon={this.removeFileHandler}
                    appendFile={this.appendFileHandler}
                />
                <TextField
                    value={name}
                    onChange={onNameChange}
                    label='Назва Відділення'
                    className={classes.textField}
                    error={invalidFields.has('name')}
                    InputProps={{
                        className: classes.input,
                        disableUnderline: true
                    }}
                    InputLabelProps={{
                        shrink: true
                    }}
                    required
                />
            </Grid>
        );
    }
}

export default withStyles(styles)(DepartmentBlock);
