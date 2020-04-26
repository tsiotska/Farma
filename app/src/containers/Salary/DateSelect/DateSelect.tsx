import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    Button,
    Popper,
    Popover,
    Grid,
    Divider
} from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { computed, observable, toJS } from 'mobx';
import { Event } from '@material-ui/icons';
import { uaMonthsNames } from '../../Sales/DateTimeUtils/DateTimeUtils';
import cx from 'classnames';

const styles = (theme: any) => createStyles({
    button: {
        width: 140,
        border: '1px solid #aaa',
        borderRadius: 4,
        background: 'white',
        margin: '0 18px',
        padding: '8px 6px',
        '& *:focus': {
            background: 'white'
        }
    },
    icon: {
        marginRight: 8
    },
    monthColumn: {
        maxHeight: 180,
        overflow: 'auto'
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
}

@observer
class DateSelect extends Component<IProps> {
    @observable popperAnchor: HTMLElement = null;

    @computed
    get years(): number[] {
        const currentYear = new Date().getFullYear();
        return [...new Array(5)].map((x, i) => currentYear - i);
    }

    clickHandler = ({ currentTarget }: any) => {
        this.popperAnchor = currentTarget;
    }

    closeHandler = () => {
        this.popperAnchor = null;
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
            <>
                <Button className={classes.button} onClick={this.clickHandler}>
                    <Event className={classes.icon} fontSize='small' />
                    {
                        uaMonthsNames[month] &&
                        <span style={{ marginRight: 8 }}>
                            {uaMonthsNames[month]}
                        </span>
                    }
                    <span>
                        {year}
                    </span>
                </Button>
                <Popover
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    anchorEl={this.popperAnchor}
                    open={!!this.popperAnchor}
                    onClose={this.closeHandler}>
                    <Grid wrap='nowrap' className={classes.container} container alignItems='flex-start'>
                        <Grid container direction='column'>
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
                        <Divider className={classes.divider} orientation='vertical' />
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
                </Popover>
            </>
        );
    }
}

export default withStyles(styles)(DateSelect);
