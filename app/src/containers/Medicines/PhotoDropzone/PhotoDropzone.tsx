import React, { useState, useCallback } from 'react';
import { createStyles, WithStyles, Backdrop } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { useDropzone } from 'react-dropzone';
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

export const PhotoDropzone: React.FC<IProps> = ({ file, appendFile, removeFile, classes }) => {
    const onDrop = useCallback((files: File[]) => {
        if (files.length) appendFile(files[0]);
    }, []);

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        open
    } = useDropzone({
        onDrop,
        accept: 'image/*',
        multiple: false,
        noClick: true
    });

    const [isHovered, setHoverStatus] = useState(false);

    const onMouseEnter = () => setHoverStatus(true);

    const onMouseLeave = () => setHoverStatus(false);

    const removeFileClickHandler = () => {
        if (file) removeFile();
    };

    const colorTheme = file
    ? 'white'
    : 'black';

    return (
        <div className={classes.section} {...getRootProps({
            onMouseEnter,
            onMouseLeave,
        })}>
            <input {...getInputProps()}/>
            {
                file
                ? <Backdrop className={classes.backdrop} open={isHovered}>
                    <DropzoneContent
                        fileAppended
                        removeFile={removeFileClickHandler}
                        colorTheme={colorTheme}
                        isDragActive={isDragActive}
                        onButtonClick={open} />
                    </Backdrop>
                : <DropzoneContent
                    fileAppended={false}
                    removeFile={removeFileClickHandler}
                    colorTheme={colorTheme}
                    isDragActive={isDragActive}
                    onButtonClick={open} />
            }
        </div>
    );
};

export default withStyles(styles)(observer(PhotoDropzone));
