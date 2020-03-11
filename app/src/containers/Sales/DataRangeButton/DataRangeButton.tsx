import React, { Component } from 'react';
import { createStyles, WithStyles, Button } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { DATA_RANGE_MODAL } from '../../../constants/Modals';

const styles = (theme: any) => createStyles({
    root: {
        marginLeft: 5
    }
});

interface IProps extends WithStyles<typeof styles> {
    dateFrom?: Date;
    dateTo?: Date;
    openModal?: (modalName: string) => void;
}

@inject(({
    appState: {
        salesStore: {
            dateFrom,
            dateTo
        },
        uiStore: {
            openModal
        }
    }
}) => ({
    dateFrom,
    dateTo,
    openModal
}))
@observer
class DataRangeButton extends Component<IProps> {
    readonly locale: string = 'ru';
    readonly dateOptions: any = { day: 'numeric', month: 'short' };

    get title(): string {
        const { dateFrom, dateTo } = this.props;

        if (!dateFrom || !dateTo) return '-';

        const d1 = dateFrom.toLocaleDateString(this.locale, this.dateOptions).replace(/\./g, '');
        const d2 = dateTo.toLocaleDateString(this.locale, this.dateOptions).replace(/\./g, '');

        const year1 = dateFrom.getFullYear() === dateTo.getFullYear()
        ? ''
        : dateFrom.getFullYear();

        const year2 = dateTo.getFullYear();

        return `${d1} ${year1} - ${d2} ${year2}`;
    }

    clickHandler = () => this.props.openModal(DATA_RANGE_MODAL);

    render() {
        const { classes } = this.props;

        return (
            <Button onClick={this.clickHandler} className={classes.root}>
                { this.title }
            </Button>
        );
    }
}

export default withStyles(styles)(DataRangeButton);