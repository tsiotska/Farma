import React, { Component } from 'react';
import { WithStyles, withStyles, createStyles, Backdrop } from '@material-ui/core';
import { observer } from 'mobx-react';
import { computed } from 'mobx';

import PhotoDropzone from '../../../components/PhotoDropzone';
import DropzoneContent from '../DropzoneContent';

const styles = (theme: any) => createStyles({
    dropzone: {
        minHeight: 300,
        border: `1px dashed ${theme.palette.primary.lightBlue}`,
        margin: '26px 0',
        display: 'flex',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    backdrop: {
        position: 'absolute',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column'
    },
});

interface IProps extends WithStyles<typeof styles> {
    image: File | string;
    appendImage: (image: File) => void;
    removeImage: () => void;
}

@observer
class Dropzone extends Component<IProps> {
    @computed
    get theme(): 'white' | 'black' {
        return this.props.image
            ? 'white'
            : 'black';
    }

    render() {
        const { classes, image, appendImage, removeImage } = this.props;
        return (
            <PhotoDropzone
                classes={{ dropzone: classes.dropzone }}
                appendFile={appendImage}
                file={image}>
                    {
                        (isHovered: boolean, isDragActive: boolean, openHandler: () => void) => (
                            image
                            ? <Backdrop className={classes.backdrop} open={isHovered}>
                                <DropzoneContent
                                    fileAppended
                                    removeFile={removeImage}
                                    colorTheme={this.theme}
                                    isDragActive={isDragActive}
                                    onButtonClick={openHandler} />
                                </Backdrop>
                            : <DropzoneContent
                                fileAppended={false}
                                removeFile={removeImage}
                                colorTheme={this.theme}
                                isDragActive={isDragActive}
                                onButtonClick={openHandler} />
                        )
                    }
            </PhotoDropzone>
        );
    }
}

export default withStyles(styles)(Dropzone);
