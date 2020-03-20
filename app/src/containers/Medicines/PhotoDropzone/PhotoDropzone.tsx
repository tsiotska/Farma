import React, { Component } from 'react';
import { createStyles, WithStyles, Backdrop } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import Dropzone from 'react-dropzone';
import { observable } from 'mobx';
import DropzoneContent from '../DropzoneContent';

const styles = (theme: any) => createStyles({
    section: {
        minHeight: 300,
        border: `1px dashed ${theme.palette.primary.lightBlue}`,
        margin: '26px 0',
        display: 'flex',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        background: ({ file }: any) => file
        ? `url(${URL.createObjectURL(file)}) center center/280px 280px no-repeat`
        : 'transparent',
    },
    backdrop: {
        position: 'absolute',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column'
    },
});

interface IProps extends WithStyles<typeof styles> {
    file: File;
    appendFile: (file: File) => void;
    removeFile: () => void;
}

@observer
class PhotoDropzone extends Component<IProps> {
    @observable hovered: boolean = false;

    onMouseOver = () => {
        this.hovered = true;
    }

    onMouseOut = () => {
        this.hovered = false;
    }

    removeFileClickHandler = () => {
        const { file, removeFile } = this.props;
        if (file) removeFile();
    }

    dropHandler = (droppedFiles: File[]) => {
        if (!droppedFiles.length) return;
        this.props.appendFile(droppedFiles[0]);
    }

    render() {
        const { classes, file } = this.props;

        const isHovered = this.hovered;
        const colorTheme = file
        ? 'white'
        : 'black';

        return (
            <Dropzone
                accept='image/*'
                onDrop={this.dropHandler}
                multiple={false}
                noClick>
                {
                    ({
                        getRootProps,
                        getInputProps,
                        isDragActive,
                        open,
                    }) => (
                        <section
                            onMouseEnter={this.onMouseOver}
                            onMouseLeave={this.onMouseOut}
                            className={classes.section}
                            {...getRootProps()}>
                                <input {...getInputProps()} />
                                {
                                    file
                                    ? <Backdrop className={classes.backdrop} open={isHovered}>
                                        <DropzoneContent
                                            fileAppended
                                            removeFile={this.removeFileClickHandler}
                                            colorTheme={colorTheme}
                                            isDragActive={isDragActive}
                                            onButtonClick={open} />
                                        </Backdrop>
                                    : <DropzoneContent
                                        fileAppended={false}
                                        removeFile={this.removeFileClickHandler}
                                        colorTheme={colorTheme}
                                        isDragActive={isDragActive}
                                        onButtonClick={open} />
                                }
                        </section>
                    )
                }
            </Dropzone>
        );
    }
}

export default withStyles(styles)(PhotoDropzone);
