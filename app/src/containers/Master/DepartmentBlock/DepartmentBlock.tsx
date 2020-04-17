import React, { Component } from 'react';
import {
    WithStyles,
    withStyles,
    createStyles,
    Grid,
    Input,
    Button
} from '@material-ui/core';
import { observer } from 'mobx-react';
import DepartmentDropzone from '../DepartmentDropzone';

const styles = createStyles({
    input: {
        width: 200,
        border: '1px solid #aaa',
        borderRadius: 2
    },
});

interface IProps extends WithStyles<typeof styles> {
    file: File;
    appendFile: (file: File) => void;
    removeIcon: () => void;
}

@observer
class DepartmentBlock extends Component<IProps> {
    render() {
        const { file, appendFile, classes, removeIcon } = this.props;

        return (
            <Grid alignItems='center' wrap='nowrap'  container>
                <DepartmentDropzone file={file} removeIcon={removeIcon} appendFile={appendFile} />
                <Input className={classes.input} disableUnderline />
            </Grid>
        );
    }
}

export default withStyles(styles)(DepartmentBlock);
