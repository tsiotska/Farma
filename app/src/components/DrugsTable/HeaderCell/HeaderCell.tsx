import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { GROUP_BY } from '../../../containers/Sales/TableStat/presets';
import { Typography } from '@material-ui/core';

interface IProps {
    value: string;
    groupBy: GROUP_BY;
}

@observer
class HeaderCell extends Component<IProps> {
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
