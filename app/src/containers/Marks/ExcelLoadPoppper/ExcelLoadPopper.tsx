import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    Popper,
    Grid,
    Paper,
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { observable } from 'mobx';
import DatePickers from './DatePickers';
import DefaultContent from './DefaultContent';

const styles = (theme: any) => createStyles({
    root: {
        padding: 16,
        minWidth: 220
    },
    row: {
        margin: '10px 0'
    },
    input: {
        border: '1px solid #aaa',
        borderRadius: 4
    },
    label: {
        marginRight: 0,
        marginLeft: 0,
        '& .MuiCheckbox-root': {
            padding: 4
        }
    },
    closeButton: {
        color: '#36A0F4',
        width: '100%'
    },
    loadButton: {
        backgroundColor: '#647CFE',
        color: 'white',
        width: '100%',
        '&:hover': {
            backgroundColor: '#7a8fff',
        }
    }
});

interface IProps extends WithStyles<typeof styles> {
    anchor: HTMLElement;
    closeHandler: () => void;
}

export type ViewMode = 'datePick' | 'default';
export type DataMode = 'payment' | 'deposit';

@observer
class ExcelLoadPopper extends Component<IProps> {
    @observable dateFrom: Date = new Date();
    @observable dateTo: Date = new Date();
    @observable mode: ViewMode = 'default';
    @observable activeMode: DataMode = 'payment';

    constructor(props: IProps) {
        super(props);
        this.dateTo = new Date();
        const prevMonth = this.dateTo.getMonth() - 1;
        this.dateFrom = new Date(
            prevMonth >= 0
            ? this.dateTo.getFullYear()
            : this.dateTo.getFullYear() - 1,
            prevMonth >= 0
            ? prevMonth
            : 11
        );
    }

    changeDates = (dateFrom: Date, dateTo: Date) => {
        this.dateFrom = dateFrom;
        this.dateTo = dateTo;
        this.mode = 'default';
    }

    setDefaultMode = () => {
        this.mode = 'default';
    }

    setDateMode = () => {
        this.mode = 'datePick';
    }

    activeModeChangeHandler = (mode: DataMode) => {
        this.activeMode = mode;
    }

    render() {
        const { classes, anchor, closeHandler } = this.props;

        return (
            <Popper
                placement='left'
                open={!!anchor}
                anchorEl={anchor}>
                    <Grid
                        className={classes.root}
                        elevation={20}
                        component={Paper}
                        direction='column'
                        container>
                            {
                                this.mode === 'datePick'
                                ? <DatePickers
                                    dateFrom={this.dateFrom}
                                    dateTo={this.dateTo}
                                    applyHandler={this.changeDates}
                                    closeHandler={this.setDefaultMode}
                                  />
                                : <DefaultContent
                                    onDateClick={this.setDateMode}
                                    closeHandler={closeHandler}
                                    from={this.dateFrom}
                                    to={this.dateTo}
                                    mode={this.activeMode}
                                    modeChangeHandler={this.activeModeChangeHandler}
                                />
                            }
                    </Grid>
            </Popper>
        );
    }
}

export default withStyles(styles)(ExcelLoadPopper);
