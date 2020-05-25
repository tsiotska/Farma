import React, { Component } from 'react';
import { createStyles, WithStyles, Button, Typography } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { observable, computed } from 'mobx';
import isFuture from 'date-fns/isFuture';
import Dialog from '../../../components/Dialog';
import { ADD_BONUS_MODAL } from '../../../constants/Modals';
import DateSelect from '../../../components/DateSelect';
import { SNACKBAR_TYPE } from '../../../constants/Snackbars';
import Snackbar from '../../../components/Snackbar';
import LoadingMask from '../../../components/LoadingMask';

const styles = (theme: any) => createStyles({
    title: {
        margin: '6px 6px 0'
    },
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
    createBonus?: (year: number, month: number) => boolean;
}

@inject(({
    appState: {
        uiStore: {
            openModal,
            openedModal,
        },
        userStore: {
            createBonus
        }
    }
}) => ({
    openModal,
    openedModal,
    createBonus
}))
@observer
class AddBonusModal extends Component<IProps> {
    @observable year: number = new Date().getFullYear();
    @observable month: number = new Date().getMonth();
    @observable showSnackbar: boolean = false;
    @observable snackbarType: SNACKBAR_TYPE = SNACKBAR_TYPE.SUCCESS;
    @observable isLoading: boolean = false;

    @computed
    get isFuture(): boolean {
        return isFuture(new Date(
            this.year,
            this.month
        ));
    }

    submitHandler = async () => {
        const { createBonus } = this.props;
        this.isLoading = true;
        const created = await createBonus(this.year, this.month);
        this.isLoading = false;
        this.showSnackbar = true;
        this.snackbarType = created
            ? SNACKBAR_TYPE.SUCCESS
            : SNACKBAR_TYPE.ERROR;
        if (created) this.closeHandler();
    }

    yearChangeHandler = (value: number) => {
        this.year = value;
    }

    monthChangeHandler = (value: number) => {
        this.month = value;
    }

    closeHandler = () => this.props.openModal(null);

    snackbarCloseHandler = () => {
        this.showSnackbar = false;
    }

    render() {
        const { openedModal, classes } = this.props;

        return (
            <>
            <Dialog
                classes={{ title: classes.title }}
                open={openedModal === ADD_BONUS_MODAL}
                onClose={this.closeHandler}
                title='Створити розподіл бонусів'
                maxWidth='xs'>
                    <DateSelect
                        classes={{ container: classes.dateSelectContainer }}
                        year={this.year}
                        month={this.month}
                        changeYear={this.yearChangeHandler}
                        changeMonth={this.monthChangeHandler}
                    />
                    <Button
                        onClick={this.submitHandler}
                        disabled={this.isFuture || this.isLoading}
                        className={classes.submitButton}
                        variant='contained'
                        color='primary'>
                            {
                                this.isLoading
                                ? <LoadingMask size={20} />
                                : 'Створити'
                            }
                    </Button>
                    {
                        this.isFuture &&
                        <Typography className={classes.errorText} color='error' variant='subtitle1'>
                            Неможливо створити розподіл бонусів за майбутній місяць
                        </Typography>
                    }
            </Dialog>
            <Snackbar
                open={this.showSnackbar}
                onClose={this.snackbarCloseHandler}
                type={this.snackbarType}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                autoHideDuration={6000}
                message={
                    this.snackbarType === SNACKBAR_TYPE.SUCCESS
                        ? 'Розподіл балів створено'
                        : 'Неможливо створити розподіл балів'
                }
            />
            </>
        );
    }
}

export default withStyles(styles)(AddBonusModal);
