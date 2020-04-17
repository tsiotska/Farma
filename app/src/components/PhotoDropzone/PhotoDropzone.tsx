import React, { useState, useCallback } from 'react';
import { createStyles, WithStyles } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { useDropzone } from 'react-dropzone';
import cx from 'classnames';

const styles = (theme: any) => createStyles({
    dropzone: {},
    input: {},
    background: {
        background: ({ file }: any) => file
        ? `url(${URL.createObjectURL(file)}) center / cover no-repeat`
        : 'transparent',
    }
});

interface IProps extends WithStyles<typeof styles> {
    file: File;
    appendFile: (file: File) => void;
    children?: (isHovered: boolean, isDragActive: boolean, openHandler: () => void) => any;
}

export const PhotoDropzone: React.FC<IProps> = ({ appendFile, classes, children }) => {
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

    return (
        <div {...getRootProps({
            className: cx(classes.dropzone, classes.background),
            onMouseEnter,
            onMouseLeave,
        })}>
            <input {...getInputProps({ className: classes.input })}/>
            {
                children
                ? children(isHovered, isDragActive, open)
                : null
            }
        </div>
    );
};

export default withStyles(styles)(observer(PhotoDropzone));
