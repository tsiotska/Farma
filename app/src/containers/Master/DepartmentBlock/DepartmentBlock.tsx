import React, { Component } from 'react';
import {
    WithStyles,
    withStyles,
    createStyles,
    Grid,
    Input,
    Button,
    TextField
} from '@material-ui/core';
import { observer } from 'mobx-react';
import DepartmentDropzone from '../DepartmentDropzone';

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
    file: File;
    appendFile: (file: File) => void;
    removeIcon: () => void;
    departmentName: string;
    onNameChange?: (e: any) => void;
}

@observer
class DepartmentBlock extends Component<IProps> {
    render() {
        const {
            file,
            appendFile,
            classes,
            removeIcon,
            departmentName,
            onNameChange
         } = this.props;

        return (
            <Grid alignItems='center' wrap='nowrap'  container>
                <DepartmentDropzone file={file} removeIcon={removeIcon} appendFile={appendFile} />
                <TextField
                    value={departmentName}
                    onChange={onNameChange}
                    label='Назва Відділення'
                    className={classes.textField}
                    InputProps={{
                        className: classes.input,
                        disableUnderline: true
                    }}
                    InputLabelProps={{
                        shrink: true
                    }}
                />
            </Grid>
        );
    }
}

export default withStyles(styles)(DepartmentBlock);
