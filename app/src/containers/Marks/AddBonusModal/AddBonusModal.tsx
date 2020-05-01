import React, { Component } from 'react';
import { createStyles, WithStyles, Button, Typography } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { observable, computed } from 'mobx';
import isFuture from 'date-fns/isFuture';
import Dialog from '../../../components/Dialog';
import { ADD_BONUS_MODAL } from '../../../constants/Modals';
import DateSelect from '../../../components/DateSelect';

const styles = (theme: any) => createStyles({
    dateSelectContainer: {
        margin: '14px auto',
        width: '100%',
        borderTop: '1px solid #dadada',
        borderBottom: '1px solid #dadada',
        maxWidth: 240,
        '& > div': {
            maxHeight: 200
        }
    },
    submitButton: {
        minHeight: 36,
        width: 220,
        margin: '0 auto'
    },
    errorText: {
        maxWidth: 230,
        textAlign: 'center',
        margin: 'auto',
        marginTop: 10,
        lineHeight: 1.4
    }
});

interface IProps extends WithStyles<typeof styles> {
    openModal?: (modalName: string) => void;
    openedModal?: string;
}

@inject(({
    appState: {
        uiStore: {
            openModal,
            openedModal
        }
    }
}) => ({
    openModal,
    openedModal
}))
@observer
class AddBonusModal extends Component<IProps> {
    @observable year: number = new Date().getFullYear();
    @observable month: number = new Date().getMonth();

    @computed
    get isFuture(): boolean {
        return isFuture(new Date(
            this.year,
            this.month
        ));
    }

    yearChangeHandler = (value: number) => {
        this.year = value;
    }

    monthChangeHandler = (value: number) => {
        this.month = value;
    }

    closeHandler = () => this.props.openModal(null);

    render() {
        const { openedModal, classes } = this.props;

        return (
            <Dialog
                open={openedModal === ADD_BONUS_MODAL}
                onClose={this.closeHandler}
                title='Створити розподіл бонусів'
                maxWidth='xs'
                closeIcon>
                    <DateSelect
                        classes={{ container: classes.dateSelectContainer }}
                        year={this.year}
                        month={this.month}
                        changeYear={this.yearChangeHandler}
                        changeMonth={this.monthChangeHandler}
                    />
                    <Button
                        disabled={this.isFuture}
                        className={classes.submitButton}
                        variant='contained'
                        color='primary'>
                        Створити
                    </Button>
                    {
                        this.isFuture &&
                        <Typography className={classes.errorText} color='error' variant='subtitle1'>
                            Неможливо створити розподіл бонусів за майбутній місяць
                        </Typography>
                    }
            </Dialog>
        );
    }
}

export default withStyles(styles)(AddBonusModal);
