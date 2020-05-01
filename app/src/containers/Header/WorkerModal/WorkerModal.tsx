import React, { Component } from 'react';
import { createStyles, WithStyles, Grid } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import Dialog from '../../../components/Dialog';
import AvatarDropzone from '../../../components/AvatarDropzone';

const styles = (theme: any) => createStyles({
    modalContent: {
        flexDirection: 'column'
    },
    dropzone: {
        alignItems: 'center',
        minWidth: 130,
        marginRight: 12
    },
    dropzoneButton: {
        width: '100%'
    },
});

interface IProps extends WithStyles<typeof styles> {
    open: boolean;
    onSubmit: () => void;
    onClose: () => void;
    isLoading: boolean;
    title: string;
}

@observer
class WorkerModal extends Component<IProps> {
    render() {
        const { open, onClose, title, classes } = this.props;

        return (
            <Dialog
                classes={{ content: classes.modalContent }}
                open={open}
                onClose={onClose}
                title={title}
                maxWidth='md'
                fullWidth>
                    <Grid wrap='nowrap' container>
                        <AvatarDropzone
                            classes={{
                                dropzone: classes.dropzone,
                                removePhotoButton: classes.dropzoneButton,
                                addPhotoButton: classes.dropzoneButton,
                            }}
                            file={null}
                            error={false}
                            appendFile={(file: File) => {
                                console.log('append file');
                            }}
                            removeIcon={() => {
                                console.log('remove icon');
                            }}
                        />
                        <Grid container>
                            <Grid container>
                                container 1
                            </Grid>
                            <Grid container>
                                container 2
                            </Grid>
                            <Grid container>
                                container 3
                            </Grid>
                        </Grid>
                    </Grid>
            </Dialog>
        );
    }
}

export default withStyles(styles)(WorkerModal);
