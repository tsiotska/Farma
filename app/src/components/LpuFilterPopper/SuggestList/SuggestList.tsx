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
    ignoredItems: any[];
    isLoading: boolean;
    toggleAll: () => void;
}

@observer
class SuggestList<T extends IMinimumInterface> extends Component<IProps<T>> {
    readonly threshold: number = 100;

    get itemsToShow(): T[] {
        const { items } = this.props;

        const rest = items.length - this.threshold;
        const shouldSlice = rest >= this.threshold;

        return shouldSlice
            ? items.slice(0, this.threshold)
            : items;
    }

    get itemsInRest(): number {
        const { items } = this.props;
        return (items || []).length - this.itemsToShow.length;
    }

    render() {
        const {
            classes,
            itemClickHandler,
            renderPropName,
            ignoredItems,
            isLoading,
            title,
            toggleAll
        } = this.props;

        return (
            <List
                className={classes.list}
                subheader={
                    <ListSubheader className={classes.subheader}>
                        <ListItem
                            className={classes.item}
                            onClick={toggleAll}
                            button
                            divider
                            dense>
                                <ListItemIcon>
                                    <Checkbox
                                        checked={ignoredItems.length === 0}
                                        edge='start'
                                        color='default'
                                        disableRipple
                                    />
                                </ListItemIcon>
                                <ListItemText primary={title} />
                        </ListItem>
                    </ListSubheader>
                }
            >
                {
                    this.itemsToShow.map(x => (
                        <SuggestItem
                            key={x.id}
                            onClick={itemClickHandler}
                            item={x}
                            renderPropName={renderPropName}
                            checked={ignoredItems.includes(x[renderPropName]) === false}
                            className={classes.item}
                        />
                    ))
                }
                {
                    isLoading
                    ? <ListItem>
                        <ListItemText
                            className={classes.alignCenter}
                            primary={<LoadingMask size={20} />}
                        />
                      </ListItem>
                    : this.itemsInRest > 0 &&
                      <ListItem>
                        <ListItemText
                            className={classes.alignCenter}
                            primary={`і ще ${this.itemsInRest} об'єктів`}
                        />
                      </ListItem>
                }
            </List>
        );
    }
}

export default withStyles(styles)(SuggestList as any);
