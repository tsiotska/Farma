import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
    ListItem,
    ListItemIcon,
    ListItemText,
    Checkbox
} from '@material-ui/core';
import { toJS } from 'mobx';

interface IProps<T> {
    onClick: (item: T) => void;
    item: T;
    renderPropName: keyof T;
    checked: boolean;
    className: string;
}

@observer
class SuggestItem<T> extends Component<IProps<T>> {
    clickHandler = () => {
        const { onClick, item } = this.props;
        onClick(item);
    }

    render() {
        const {
            className,
            checked,
            item,
            renderPropName
        } = this.props;

        const title = item[renderPropName];

        if (!title) return null;

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
                    <ListItemText primary={title} />
            </ListItem>
        );
    }
}

export default SuggestItem;
