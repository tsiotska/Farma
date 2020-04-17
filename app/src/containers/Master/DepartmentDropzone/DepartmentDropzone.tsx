import React, { Component } from 'react';
import { WithStyles, withStyles, createStyles, Backdrop } from '@material-ui/core';
import { observer } from 'mobx-react';
import PhotoDropzone from '../../../components/PhotoDropzone';
import { ArrowDownward, AddAPhotoOutlined, Close } from '@material-ui/icons';
import cx from 'classnames';

const styles = (theme: any) => createStyles({
    dropzone: {
        marginRight: 12,
        width: 70,
        height: 71,
        borderRadius: '50%',
        border: `1px dashed ${theme.palette.primary.lightBlue}`,
        margin: '16px 0',
        display: 'flex',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        outline: 'none'
    },
    hoverable: {
        cursor: 'pointer',
        transition: '0.3s',
        '&:hover': {
            backgroundColor: '#e4e4e4'
        }
    },
    defaultIcon: {
        color: '#636363'
    },
    backdropIcon: {
        color: '#efefef',
        transition: '0.3s'
    },
    backdrop: {
        position: 'absolute',
        zIndex: 200,
        borderRadius: '50%'
    },
    removeIcon: {
        marginBottom: -2
    },
    blueOnHover: {
        '&:hover': {
            color: theme.palette.primary.lightBlue
        }
    },
    redOnHover: {
        '&:hover': {
            color: 'red'
        }
    },
    addPhotoWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        borderRadius: '50%'
    }
});

interface IProps extends WithStyles<typeof styles> {
    file: File;
    appendFile: (file: File) => void;
    removeIcon: () => void;
}

@observer
class DepartmentDropzone extends Component<IProps> {
    render() {
        const { file, appendFile, classes, removeIcon } = this.props;

        return (
            <PhotoDropzone
                classes={{ dropzone: cx(classes.dropzone, {[classes.hoverable]: !file}) }}
                appendFile={appendFile}
                file={file}>
                {
                    (isHovered: boolean, isDragActive: boolean, open: () => void) => (
                        file
                            ? isHovered
                                ?  <Backdrop className={classes.backdrop} open>
                                    <AddAPhotoOutlined
                                        onClick={open}
                                        className={cx(
                                            classes.backdropIcon,
                                            classes.blueOnHover
                                        )}
                                    />
                                    <Close
                                        onClick={removeIcon}
                                        className={cx(
                                            classes.removeIcon,
                                            classes.backdropIcon,
                                            classes.redOnHover
                                        )}
                                    />
                                    </Backdrop>
                                : null
                            : isDragActive
                                ? <ArrowDownward className={classes.defaultIcon} />
                                : <div onClick={open} className={classes.addPhotoWrapper}>
                                    <AddAPhotoOutlined className={classes.defaultIcon} />
                                  </div>
                    )
                }
            </PhotoDropzone>
        );
    }
}

export default withStyles(styles)(DepartmentDropzone);
