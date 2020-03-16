import React, { Component } from 'react';
import { createStyles, WithStyles, Typography, Button } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { ArrowDownward } from '@material-ui/icons';
import cx from 'classnames';

const styles = (theme: any) => createStyles({
    button: {
        borderColor: theme.palette.primary.blue,
        '&.white': {
            color: theme.palette.primary.white,
            backgroundColor: theme.palette.primary.blue
        },
        '&.black': {
            color: theme.palette.primary.blue
        }
    },
    helperText: {
        marginTop: theme.spacing(1),
        '&.white': {
            color: theme.palette.primary.white
        },
        '&.black': {
            color: theme.palette.primary.gray.mainLight
        }
    },
    removeButton: {
        padding: '5px 15px',
        marginTop: theme.spacing(1),
        color: theme.palette.primary.white,
        border: `1px solid transparent`,
        '&:hover': {
            borderColor: theme.palette.primary.white
        }
    }
});

interface IProps extends WithStyles<typeof styles> {
    isDragActive: boolean;
    onButtonClick: () => void;
    colorTheme: 'black' | 'white';
    removeFile: () => void;
    fileAppended: boolean;
}

@observer
class DropzoneContent extends Component<IProps> {
    render() {
        const {
            classes,
            isDragActive,
            onButtonClick,
            colorTheme,
            removeFile,
            fileAppended,
        } = this.props;

        return (
            <>
                {
                    isDragActive
                    ? <ArrowDownward />
                    : <Button
                        className={cx(classes.button, {  white: colorTheme === 'white', black: colorTheme === 'black' })}
                        variant='outlined'
                        onClick={onButtonClick}>
                            {
                                fileAppended
                                ? 'Изменить фото'
                                : 'Добавить фото'
                            }
                      </Button>

                }
                {
                    fileAppended
                    ? <Button className={classes.removeButton} onClick={removeFile}>
                        Удалить файл
                      </Button>
                    : <Typography className={cx(classes.helperText, { white: colorTheme === 'white', black: colorTheme === 'black'})} variant='subtitle1'>
                        Выберите или добавьте фотографию
                      </Typography>
                }
            </>
        );
    }
}

export default withStyles(styles)(DropzoneContent);
