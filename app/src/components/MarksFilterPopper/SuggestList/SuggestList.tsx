import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    ListItemIcon,
    Checkbox
} from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import SuggestItem from '../SuggestItem';
import LoadingMask from '../../LoadingMask';

const styles = (theme: any) => createStyles({
    list: {
        overflow: 'auto',
        maxHeight: 300,
        maxWidth: 250
    },
    item: {
        '& .MuiCheckbox-root': {
            padding: 0
        },
        '& .MuiListItemIcon-root': {
            minWidth: 20
        },
        textTransform: 'capitalize'
    },
    alignCenter: {
        textAlign: 'center'
    },
    subheader: {
        background: 'white',
        padding: 0,
        paddingTop: 10,
        '& > div': {
            height: 37
        }
    },
});

interface IMinimumInterface {
    id: number;
}

interface IProps<T extends IMinimumInterface> extends WithStyles<typeof styles> {
    items: T[];
    title: string;
    itemClickHandler: (item: T) => void;
    renderPropName: keyof T;
    // ignoredItems: any[];
    selected: any;
    isLoading: boolean;
    // toggleAll: () => void;
}

@observer
class SuggestList<T extends IMinimumInterface> extends Component<IProps<T>> {

    get itemsToShow(): T[] {
        const { items } = this.props;
        return items;
    }

    render() {
        const {
            classes,
            itemClickHandler,
            renderPropName,
            selected,
            isLoading,
        } = this.props;

        return (
            <List className={classes.list}>
                {
                    this.itemsToShow.map(x => (
                        <SuggestItem
                            key={x.id}
                            onClick={itemClickHandler}
                            item={x}
                            renderPropName={renderPropName}
                            checked={selected === x[renderPropName]}
                            className={classes.item}
                        />
                    ))
                }
                {
                    isLoading
                    && <ListItem>
                        <ListItemText
                            className={classes.alignCenter}
                            primary={<LoadingMask size={20} />}
                        />
                      </ListItem>
                }
            </List>
        );
    }
}

export default withStyles(styles)(SuggestList as any);
