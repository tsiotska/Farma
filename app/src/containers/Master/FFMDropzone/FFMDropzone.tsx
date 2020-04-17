import React, { Component } from 'react';
import { WithStyles, withStyles, createStyles, Backdrop, Grid, Button } from '@material-ui/core';
import { observer } from 'mobx-react';
import PhotoDropzone from '../../../components/PhotoDropzone';
import { ArrowDownward, AddAPhotoOutlined } from '@material-ui/icons';

const styles = (theme: any) => createStyles({
    dropzone: {
        width: 120,
        height: 121,
        borderRadius: '50%',
        border: `1px dashed ${theme.palette.primary.lightBlue}`,
        outline: 'none',
        display: 'flex',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    container: {
        width: 'auto'
    },
    removePhotoButton: {
        marginTop: 12,
    },
    addPhotoButton: {
        marginTop: 12,
        color: theme.palette.primary.lightBlue,
        borderColor: theme.palette.primary.lightBlue,
    },
    icon: {
        color: '#636363'
    }
});

interface IProps extends WithStyles<typeof styles> {
    file: File;
    appendFile: (file: File) => void;
    removeIcon: () => void;
}

@observer
class DepartmentDropzone extends Component<IProps> {
    addImageClickHandler = () => {
        const { appendFile } = this.props;
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.onchange = () => {
            const targetFile = (input.files && input.files.length)
            ? input.files[0]
            : null;
            if (targetFile) appendFile(targetFile);
        };
        input.click();
    }

    render() {
        const { file, appendFile, classes, removeIcon } = this.props;

        return (
            <Grid className={classes.container} direction='column' container item>
                <PhotoDropzone
                    classes={{ dropzone: classes.dropzone }}
                    appendFile={appendFile}
                    file={file}>
                    {
                        (isHovered: boolean, isDragActive: boolean) => (
                            file
                            ? null
                            : isDragActive
                                ? <ArrowDownward className={classes.icon} />
                                : <AddAPhotoOutlined className={classes.icon} />
                        )
                    }
                </PhotoDropzone>
                <Button
                    onClick={this.addImageClickHandler}
                    variant='outlined'
                    className={classes.addPhotoButton}>
                    {
                        file
                        ? 'Змінити фото'
                        : 'Додати фото'
                    }
                </Button>
                <Button
                    disabled={!file}
                    variant='outlined'
                    className={classes.removePhotoButton}
                    onClick={removeIcon}>
                    Видалити фото
                </Button>
            </Grid>
        );
    }
}

export default withStyles(styles)(DepartmentDropzone);
