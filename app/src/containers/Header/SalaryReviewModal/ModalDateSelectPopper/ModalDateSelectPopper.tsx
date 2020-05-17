import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    Button,
    Popover, Grid,
} from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { observable } from 'mobx';
import { Event } from '@material-ui/icons';
import { uaMonthsNames } from '../../../Sales/DateTimeUtils/DateTimeUtils';
import DateSelect from '../../../../components/DateSelect';

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
    buttonGroup: {
        padding: 10,
        marginBottom: 10
    }
});

interface IProps extends WithStyles<typeof styles> {
    year: number;
    month: number;
    changeYear: (value: number) => void;
    changeMonth: (value: number) => void;
    applyHandler?: () => void;
}

@observer
class ModalDateSelectPopper extends Component<IProps> {
    @observable popperAnchor: HTMLElement = null;

    clickHandler = ({ currentTarget }: any) => {
        this.popperAnchor = currentTarget;
    }

    closeHandler = () => {
        this.popperAnchor = null;
    }

    applyClickHandler = () => {
        this.props.applyHandler();
        this.closeHandler();
    }

    render() {
        const {
            classes,
            year,
            month,
            changeYear,
            changeMonth
        } = this.props;

        return (
            <>
                <Button className={classes.button} onClick={this.clickHandler}>
                    <Event className={classes.icon} fontSize='small'/>
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
                    open={!!this.popperAnchor}>
                    <DateSelect
                        year={year}
                        month={month}
                        changeYear={changeYear}
                        changeMonth={changeMonth}
                    />
                    <Grid className={classes.buttonGroup} container wrap='nowrap' alignItems='center'>
                        <Button onClick={this.closeHandler} className={classes.discardButton}>
                            Відмінити
                        </Button>
                        <Button onClick={this.applyClickHandler} className={classes.applyButton}>
                            Застосувати
                        </Button>
                    </Grid>
                </Popover>
            </>
        );
    }
}

export default withStyles(styles)(ModalDateSelectPopper);
