import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { GROUP_BY } from '../../../containers/Sales/TableStat/presets';
import { Typography } from '@material-ui/core';

interface IProps {
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
        const { value } = this.props;

        return (
            <Typography color='textSecondary'>
                { value }
            </Typography>
        );
    }
}

export default HeaderCell;
