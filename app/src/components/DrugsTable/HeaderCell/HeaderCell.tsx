import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { FormControlLabel, Checkbox, createStyles, WithStyles, withStyles, Typography, IconButton } from '@material-ui/core';
import { GROUP_BY } from '../../../containers/Sales/TableStat/TableStat';
import { FilterList, Close } from '@material-ui/icons';
import FilterPopper from '../FilterPopper';
import { observable } from 'mobx';
import { ISalesPharmacyFilter } from '../../../stores/UIStore';

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
        display: 'flex',
        alignItems: 'center'
    },
    value: {
        marginLeft: 3,
        marginRight: 8
    },
    iconButton: {
        padding: 5,
        borderRadius: 2
    }
});

interface IProps extends WithStyles<typeof styles> {
    value: string;
    groupBy: GROUP_BY;

    isAnyAgentIgnored?: boolean;
    isAnyLocationIgnored?: boolean;

    toggleAllIgnoredLocations?: () => void;
    toggleAllIgnoredAgents?: () => void;
    setPharmacyFilters?: (value: ISalesPharmacyFilter) => void;
}

@inject(({
    appState: {
        salesStore: {
            toggleAllIgnoredLocations,
            toggleAllIgnoredAgents,
            isAnyAgentIgnored,
            isAnyLocationIgnored,
        },
        uiStore: {
            setPharmacyFilters
        }
    }
}) => ({
    toggleAllIgnoredLocations,
    toggleAllIgnoredAgents,
    isAnyAgentIgnored,
    isAnyLocationIgnored,
    setPharmacyFilters
}))
@observer
class HeaderCell extends Component<IProps> {
    @observable anchor: any = null;

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

    clearFilters = () => this.props.setPharmacyFilters(null);

    openFilter = ({ currentTarget }: any) => {
        this.anchor = currentTarget;
    }

    closeHandler = () => {
        this.anchor = null;
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
                        <span className={classes.value}>{value}</span>
                        {
                            value === 'Аптеки' &&
                            <>
                                <IconButton onClick={this.openFilter} className={classes.iconButton}>
                                    <FilterList fontSize='small' />
                                </IconButton>
                                <IconButton onClick={this.clearFilters} className={classes.iconButton}>
                                    <Close fontSize='small' />
                                </IconButton>
                            </>
                        }
                        <FilterPopper
                            anchor={this.anchor}
                            closeHandler={this.closeHandler}
                        />
                    </Typography>
                }
            />
        );
    }
}

export default withStyles(styles)(HeaderCell);
