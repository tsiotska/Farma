import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { ListItem, ListItemIcon, ListItemText, Checkbox } from '@material-ui/core';
import { ILPU } from '../../../interfaces/ILPU';

interface IProps {
    onClick: (item: any) => void;
    item: { id: number, value: string };
    checked: boolean;
    className: string;
}

@observer
class SuggestItem extends Component<IProps> {
    clickHandler = () => {
        const { onClick, item } = this.props;
        onClick(item);
    }

    render() {
        const {
            className,
            checked,
            item: { value }
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
                    <ListItemText primary={value} />
            </ListItem>
        );
    }
}

export default SuggestItem;
