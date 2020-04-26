import React, { Component } from 'react';
import { createStyles, WithStyles, Select, MenuItem } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { computed } from 'mobx';
import { Event } from '@material-ui/icons';

const styles = (theme: any) => createStyles({
    select: {
        border: '1px solid #aaa',
        borderRadius: 4,
        background: 'white',
        margin: '0 18px',
        padding: '0 6px',
        '& *:focus': {
            background: 'white'
        }
    },
    icon: {
        marginRight: 8
    }
});

interface IProps extends WithStyles<typeof styles> {
    year: number;
    changeYear: (value: number) => void;
}

@observer
class YearSelect extends Component<IProps> {
    @computed
    get years(): number[] {
        const currentYear = new Date().getFullYear();
        return [...new Array(5)].map((x, i) => currentYear - i);
    }

    changeHandler = ({ target: { value }}: any) => {
        const { changeYear } = this.props;
        const asInt = +value;
        if (this.years.includes(asInt)) changeYear(asInt);
    }

    render() {
        const { classes, year } = this.props;

        return (
            <Select
                value={year}
                className={classes.select}
                onChange={this.changeHandler}
                startAdornment={<Event className={classes.icon} fontSize='small' />}
                disableUnderline>
                {
                    this.years.map(x => (
                        <MenuItem key={x} value={x}>
                            { x }
                        </MenuItem>
                    ))
                }
            </Select>
        );
    }
}

export default withStyles(styles)(YearSelect);
