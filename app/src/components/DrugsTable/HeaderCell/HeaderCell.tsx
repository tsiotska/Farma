import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { FormControlLabel, Checkbox, createStyles, WithStyles, withStyles, Typography } from '@material-ui/core';
import { GROUP_BY } from '../../../containers/Sales/TableStat/TableStat';

const styles = createStyles({
    label: {
        margin: 0
    },
    checkbox: {
        padding: 0,
        marginRight: 5
    },
    text: {
        fontFamily: 'Source Sans Pro SemiBold',
    }
});

interface IProps extends WithStyles<typeof styles> {
    value: string;
    groupBy: GROUP_BY;

    toggleAllIgnoredLocations?: () => void;
    toggleAllIgnoredAgents?: () => void;
    isAnyAgentIgnored?: boolean;
    isAnyLocationIgnored?: boolean;
}

@inject(({
    appState: {
        salesStore: {
            toggleAllIgnoredLocations,
            toggleAllIgnoredAgents,
            isAnyAgentIgnored,
            isAnyLocationIgnored
        }
    }
}) => ({
    toggleAllIgnoredLocations,
    toggleAllIgnoredAgents,
    isAnyAgentIgnored,
    isAnyLocationIgnored
}))
@observer
class HeaderCell extends Component<IProps> {
    get isChecked(): boolean {
        const { groupBy, isAnyAgentIgnored, isAnyLocationIgnored } = this.props;

        return groupBy === GROUP_BY.AGENT
        ? !isAnyAgentIgnored
        : !isAnyLocationIgnored;
    }

    changeHandler = () => {
        const { groupBy, toggleAllIgnoredAgents, toggleAllIgnoredLocations } = this.props;

        const action = groupBy === GROUP_BY.AGENT
        ? toggleAllIgnoredAgents
        : toggleAllIgnoredLocations;

        action();
    }

    render() {
        const { value, classes } = this.props;

        return (
            <FormControlLabel
                className={classes.label}
                control={
                    <Checkbox
                        className={classes.checkbox}
                        checked={this.isChecked}
                        onChange={this.changeHandler}
                        size='small'
                        color='default'
                    />
                }
                label={
                    <Typography className={classes.text} color='textSecondary'>
                        {value}
                    </Typography>
                }
            />
        );
    }
}

export default withStyles(styles)(HeaderCell);
