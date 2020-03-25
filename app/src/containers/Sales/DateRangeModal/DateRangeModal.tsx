import React, { Component } from 'react';
import { createStyles, WithStyles, Button, Grid } from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import Dialog from '../../../components/Dialog';
import { DATA_RANGE_MODAL } from '../../../constants/Modals';
import { observable } from 'mobx';

const styles = (theme: any) => createStyles({
    pickersContainer: {
        paddingTop: 16,
        '& > :first-of-type': {
            marginRight: 10
        }
    },
    submitButton: {
        marginLeft: 'auto',
        color: theme.palette.primary.lightBlue
    }
});

interface IProps extends WithStyles<typeof styles> {
    openedModal?: string;
    openModal?: (modalName: string) => void;
    dateFrom?: Date;
    dateTo?: Date;
    setDateTo?: (newDate: Date) => void;
    setDateFrom?: (newDate: Date) => void;
    loadMedsStat?: () => void;
    loadLocaleSalesStat?: () => void;
    loadAgentSalesStat?: () => void;
}

@inject(({
    appState: {
        uiStore: {
            openedModal,
            openModal
        },
        salesStore: {
            dateFrom,
            dateTo,
            setDateTo,
            setDateFrom,
            loadMedsStat,
            loadLocaleSalesStat
        }
    }
}) => ({
    openedModal,
    openModal,
    dateFrom,
    dateTo,
    setDateTo,
    setDateFrom,
    loadMedsStat,
    loadLocaleSalesStat
}))
@observer
class DateRangeModal extends Component<IProps> {
    @observable localDateTo: Date;
    @observable localDateFrom: Date;

    closeHandler = () => this.props.openModal(null);

    setDateFrom = (newDate: Date) => {
        this.localDateFrom = newDate;
    }

    setDateTo = (newDate: Date) => {
        this.localDateTo = newDate;
    }

    submitHandler = () => {
        const {
            setDateFrom,
            setDateTo,
            dateFrom,
            dateTo,
            loadMedsStat,
            loadLocaleSalesStat,
            loadAgentSalesStat
        } = this.props;

        const isDateToChanged = this.localDateTo
        ? this.localDateTo.getTime() !== dateTo.getTime()
        : false;

        const isDateFromChanged = this.localDateFrom
        ? this.localDateFrom.getTime() !== dateFrom.getTime()
        : false;

        this.closeHandler();
        if (isDateToChanged) setDateTo(this.localDateTo);
        if (isDateFromChanged) setDateFrom(this.localDateFrom);
        if (isDateToChanged || isDateFromChanged) {
            loadMedsStat();
            loadLocaleSalesStat();
            loadAgentSalesStat();
        }
    }

    componentDidUpdate(prevProps: IProps) {
        const { openedModal: prevModal } = prevProps;
        const { openedModal: currentModal } = this.props;

        const condition = prevModal === DATA_RANGE_MODAL && currentModal !== DATA_RANGE_MODAL;

        if (condition) {
            this.localDateFrom = null;
            this.localDateTo = null;
        }
    }

    render() {
        const {
            classes,
            openedModal,
            dateTo,
            dateFrom
        } = this.props;

        return (
            <Dialog
                open={openedModal === DATA_RANGE_MODAL}
                onClose={this.closeHandler}
                maxWidth='md'
                title='Дата'>
                <Grid className={classes.pickersContainer} alignItems='center' justify='center' container>
                    <DatePicker
                        autoOk
                        disableFuture
                        disableToolbar
                        variant='static'
                        openTo='date'
                        value={this.localDateFrom || dateFrom}
                        onChange={this.setDateFrom}
                    />
                    <DatePicker
                        autoOk
                        disableFuture
                        disableToolbar
                        variant='static'
                        openTo='date'
                        value={this.localDateTo || dateTo}
                        onChange={this.setDateTo}
                    />
                </Grid>
                <Button onClick={this.submitHandler} className={classes.submitButton}>
                    Применить
                </Button>
            </Dialog>
        );
    }
}

export default withStyles(styles)(DateRangeModal);
