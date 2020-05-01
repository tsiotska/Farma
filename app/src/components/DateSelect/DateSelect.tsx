import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    Button,
    Grid,
    Divider
} from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { computed, observable, toJS } from 'mobx';
import { uaMonthsNames } from '../../containers/Sales/DateTimeUtils/DateTimeUtils';
import cx from 'classnames';

const styles = (theme: any) => createStyles({
    monthColumn: {
        maxHeight: 180,
        overflow: 'auto'
    },
    yearColumn: {
        maxHeight: 180,
        overflow: 'auto',
        direction: 'rtl'
    },
    container: {
        width: 220,
        padding: '15px 0 15px 0px'
    },
    divider: {
        height: 180
    },
    listItem: {
        borderRadius: 0,
        '&.active': {
            background: '#e8e8e8'
        }
    }
});

interface IProps extends WithStyles<typeof styles> {
    year: number;
    month: number;
    changeYear: (value: number) => void;
    changeMonth: (value: number) => void;
    minYear?: number;
}

@observer
class DateSelect extends Component<IProps> {
    @computed
    get years(): number[] {
        const { minYear } = this.props;
        const currentYear = new Date().getFullYear();
        const count = minYear ? currentYear - minYear : 5;
        return [...new Array(count)].map((x, i) => currentYear - i);
    }

    setYear = ({ currentTarget: { value }}: any) => {
        const { changeYear } = this.props;
        const asInt = +value;
        const year = this.years[asInt];
        if (year) changeYear(year);
    }

    setMonth = ({ currentTarget: { value }}: any) => {
        const { changeMonth } = this.props;
        const asInt = +value;
        if (uaMonthsNames[asInt]) changeMonth(asInt);
    }

    render() {
        const { classes, year, month } = this.props;

        return (
            <Grid wrap='nowrap' className={classes.container} container alignItems='flex-start'>
                <Grid wrap='nowrap' className={classes.yearColumn} container direction='column'>
                    {
                        this.years.map((value, i) => (
                            <Button
                                onClick={this.setYear}
                                className={cx(classes.listItem, { active: year === value })}
                                key={value}
                                value={i}>
                                { value }
                            </Button>
                        ))
                    }
                </Grid>
                <Divider className={classes.divider} flexItem orientation='vertical' />
                <Grid wrap='nowrap' className={classes.monthColumn} container direction='column'>
                    {
                        uaMonthsNames.map((value, i) => (
                            <Button
                                onClick={this.setMonth}
                                className={cx(classes.listItem, { active: month === i })}
                                key={value}
                                value={i}>
                                { value }
                            </Button>
                        ))
                    }
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(DateSelect);
