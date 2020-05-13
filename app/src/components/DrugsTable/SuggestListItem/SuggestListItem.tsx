import React, { Component } from 'react';
import { createStyles, WithStyles, ListItem, ListItemIcon, Checkbox, ListItemText } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IDoctor } from '../../../interfaces/IDoctor';
import { ILPU } from '../../../interfaces/ILPU';

interface IProps {
    onClick: (pharma: ILPU) => void;
    pharma: ILPU;
    checked: boolean;
    className: string;
}

@observer
class SuggestListItem extends Component<IProps> {
    clickHandler = () => {
        const { onClick, pharma } = this.props;
        onClick(pharma);
    }

    render() {
        const { className, checked, pharma: { name, city, address }} = this.props;

        return (
            <ListItem
                className={className}
                dense
                button
                onClick={this.clickHandler}>
                <ListItemIcon>
                    <Checkbox
                    checked={checked}
                    edge='start'
                    color='default'
                    disableRipple
                    />
                </ListItemIcon>
                <ListItemText primary={name} secondary={
                    `${city && `${city}, `}${address}`
                } />
            </ListItem>
        );
    }
}

export default SuggestListItem;
