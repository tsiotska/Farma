import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Button, Typography } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import DateSelect from '../../../components/DateSelect';
import { observable, toJS } from 'mobx';

const styles = (theme: any) => createStyles({
    discardButton: {
        color: '#36A0F4',
        width: '100%'
    },
    applyButton: {
        backgroundColor: '#647CFE',
        color: 'white',
        width: '100%',
        '&:hover': {
            backgroundColor: '#7a8fff',
        }
    },
    text: {
        fontFamily: 'Source Sans Pro SemiBold',
        color: '#aaa',
        fontSize: theme.typography.pxToRem(13)
    },
    container: {
        paddingTop: 2
    }
});

interface IProps extends WithStyles<typeof styles> {
    dateFrom: Date;
    dateTo: Date;
    applyHandler: (dateFrom: Date, dateTo: Date) => void;
    closeHandler: () => void;
}

@observer
class DatePickers extends Component<IProps> {
    @observable dateFrom: Date = new Date();
    @observable dateTo: Date = new Date();

    dateToChangeHandler = (propName: 'month' | 'year') => (value: number) => {
        this.dateTo = propName === 'year'
            ? new Date( value, this.dateTo.getMonth(), this.dateTo.getDate())
            : new Date( this.dateTo.getFullYear(), value, this.dateTo.getDate());
    }

    dateFromChangeHandler = (propName: 'month' | 'year') => (value: number) => {
        this.dateFrom = propName === 'year'
            ? new Date( value, this.dateFrom.getMonth(), this.dateFrom.getDate())
            : new Date( this.dateFrom.getFullYear(), value, this.dateFrom.getDate());
    }

    applyClickHandler = () => this.props.applyHandler(this.dateFrom, this.dateTo);

    componentDidMount() {
        const { dateFrom, dateTo } = this.props;
        this.dateFrom = new Date(dateFrom.getTime());
        this.dateTo = new Date(dateTo.getTime());
    }

    render() {
        const { classes, closeHandler } = this.props;
        console.log(toJS(this.dateFrom), this.dateFrom.getFullYear());
        return (
            <>
                <Typography className={classes.text}>
                    З
                </Typography>
                <DateSelect
                    minYear={2016}
                    year={this.dateFrom.getFullYear()}
                    month={this.dateFrom.getMonth()}
                    classes={{ container: classes.container}}
                    changeYear={this.dateFromChangeHandler('year')}
                    changeMonth={this.dateFromChangeHandler('month')}
                />
                <Typography className={classes.text}>
                    По
                </Typography>
                <DateSelect
                    minYear={2016}
                    year={this.dateTo.getFullYear()}
                    month={this.dateTo.getMonth()}
                    classes={{ container: classes.container}}
                    changeYear={this.dateToChangeHandler('year')}
                    changeMonth={this.dateToChangeHandler('month')}
                />
                <Grid container wrap='nowrap' alignItems='center'>
                    <Button onClick={closeHandler} className={classes.discardButton}>
                        Відмінити
                    </Button>
                    <Button onClick={this.applyClickHandler} className={classes.applyButton}>
                        Застосувати
                    </Button>
                </Grid>
            </>
        );
    }
}

export default withStyles(styles)(DatePickers);
