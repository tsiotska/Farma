import React, { useState, useCallback } from 'react';
import { createStyles, WithStyles } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { useDropzone } from 'react-dropzone';
import cx from 'classnames';
import Config from '../../../Config';

const styles = (theme: any) => createStyles({
    dropzone: {},
    input: {},
    background: {
        backgroundImage: ({ file }: any) => {
            if (!file) return 'transparent';
            return typeof file === 'string'
                ? `url(${Config.ASSETS_URL}/${file})`
                : `url(${URL.createObjectURL(file)})`;
        },
        '-webkit-background-size': 'cover',
        '-moz-background-size': 'cover',
        '-o-background-size': 'cover',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    }
});

interface IProps extends WithStyles<typeof styles> {
    file: string | File;
    appendFile: (file: File) => void;
    children?: (isHovered: boolean, isDragActive: boolean, openHandler: () => void) => any;
}

export const PhotoDropzone: React.FC<IProps> = ({ appendFile, classes, children }) => {
    const [isHovered, setHoverStatus] = useState(false);

    const onMouseEnter = useCallback(
        () => setHoverStatus(true),
        [setHoverStatus]
    );

    const onMouseLeave = useCallback(
        () => setHoverStatus(false),
        [setHoverStatus]
    );

    const onDrop = useCallback((files: File[]) => {
        if (files.length === 1 && files[0].size <= 2000000) {
            appendFile(files[0]);
            setHoverStatus(false);
        }
    }, [appendFile, setHoverStatus]);

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        open
    } = useDropzone({
        onDrop,
        accept: 'image/*',
        multiple: false,
        noClick: true,
    });

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
