import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { ListItem, ListItemIcon, ListItemText, Checkbox } from '@material-ui/core';
import { ILPU } from '../../../interfaces/ILPU';

interface IProps {
    onClick: (lpu: ILPU) => void;
    lpu: ILPU;
    title: keyof ILPU;
    checked: boolean;
    className: string;
}

@observer
class SuggestItem extends Component<IProps> {
    clickHandler = () => {
        console.log('click');
    }

    render() {
        const {
            className,
            checked,
            lpu,
            title
        } = this.props;

        return (
            <ListItem
                onClick={this.clickHandler}
                className={className}
                button
                dense>
                    <ListItemIcon>
                        <Checkbox
                            checked={checked}
                            edge='start'
                            color='default'
                            disableRipple
                        />
                    </ListItemIcon>
                    <ListItemText primary={lpu[title]} />
            </ListItem>
        );
    }
}

export default SuggestItem;
