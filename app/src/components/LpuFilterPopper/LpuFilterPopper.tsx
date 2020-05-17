import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    Popover,
    Grid,
    Button,
    Divider,
    Input,
    Typography,
    List,
    IconButton,
    ListItem,
    ListItemText
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import cx from 'classnames';
import { SORT_ORDER, ISortBy } from '../../stores/UIStore';
import { ILPU } from '../../interfaces/ILPU';
import SuggestItem from './SuggestItem';
import { toJS, computed } from 'mobx';
import { IState } from '../../containers/HCFList/Header/Header';
import LoadingMask from '../LoadingMask';
import { Search } from '@material-ui/icons';

const styles = (theme: any) => createStyles({
    input: {
        border: '1px solid #aaa',
        borderRadius: 2,
        padding: '0 0 0 8px'
    },
    container: {
        padding: 12
    },
    divider: {
        margin: '10px 0'
    },
    button: {
        marginTop: 10,
        border: '1px solid transparent',
        '&.active': {
            borderColor: '#aaa'
        }
    },
    list: {
        overflow: 'auto',
        maxHeight: 300,
        maxWidth: 250
    },
    listItem: {
        '& .MuiCheckbox-root': {
            padding: 0
        },
        '& .MuiListItemIcon-root': {
            minWidth: 20
        },
        textTransform: 'capitalize'
    },
    submitButton: {
        color: theme.palette.primary.lightBlue
    },
    iconButton: {
        padding: 6,
        borderRadius: 2
    },
    placeholder: {
        marginTop: 12
    },
    alignCenter: {
        textAlign: 'center'
    }
});

// export type SortableProps = 'name' | 'region' | 'oblast' | 'city';
export type SortableProps = 'name' | 'oblast' | 'city';

interface IProps extends WithStyles<typeof styles> {
    anchor: HTMLElement;
    onClose: () => void;
    isLoading: boolean;

    order: SORT_ORDER;
    onOrderChange: (order: SORT_ORDER) => void;

    searchString: string;
    onSearchStringChange: (e: any) => void;
    applySearch: () => void;

    suggestions: Array<{ id: number, value: string}>;
    selectedItems: Array<{ id: number, value: string}>;
    itemClickHandler: (lpu: ILPU) => void;

    applyClickHandler: () => void;
}

@observer
class LpuFilterPopper extends Component<IProps> {
    sortAtoZ = () => {
        this.props.onOrderChange(SORT_ORDER.ASCENDING);
    }

    sortZtoA = () => {
        this.props.onOrderChange(SORT_ORDER.DESCENDING);
    }

    getList = () => {
        const {
            classes,
            isLoading,
            suggestions,
            selectedItems,
            itemClickHandler,
        } = this.props;

        const suggestionsExist = !!suggestions;

        if (isLoading) return <LoadingMask classes={{ wrapper: classes.placeholder }} size={20} />;
        if (suggestionsExist === false || suggestions.length === 0) {
            return <Typography className={classes.placeholder} align='center'>
                {
                    suggestionsExist
                        ? 'Відповідні дані відсутні'
                        : 'Дані відсутні'
                }
            </Typography>;
        }

        const threshold = 100;
        const rest = suggestions.length - threshold;
        const shouldSlice = rest >= threshold;
        const items = shouldSlice
            ? suggestions.slice(0, threshold)
            : suggestions;
        const itemsInRest = suggestions.length - items.length;

        return (
            <List className={classes.list}>
                {
                    items.slice(0, 50).map(x => (
                        <SuggestItem
                            key={x.id}
                            item={x}
                            checked={selectedItems.includes(x) === true}
                            onClick={itemClickHandler}
                            className={classes.listItem}
                        />
                    ))
                }
                {
                    itemsInRest > 0 &&
                    <ListItem className={classes.listItem} dense>
                        <ListItemText
                            className={classes.alignCenter}
                            primary={`і ще ${itemsInRest} об'єктів`}
                        />
                    </ListItem>
                }
            </List>
        );
    }

    render() {
        const {
            classes,
            anchor,
            onClose,
            isLoading,
            order,
            searchString,
            onSearchStringChange,
            applySearch,
            applyClickHandler,
        } = this.props;

        return (
            <Popover
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                onClose={onClose}
                anchorEl={anchor}
                open={!!anchor}>
                    <Grid className={classes.container} container direction='column'>
                        <Button
                            className={cx(classes.button, { active: order === SORT_ORDER.ASCENDING} )}
                            onClick={this.sortAtoZ}>

                                Сортувати від А до Я
                            </Button>
                        <Button
                            className={cx(classes.button, { active: order === SORT_ORDER.DESCENDING} )}
                            onClick={this.sortZtoA}>
                                Сортувати від Я до А
                            </Button>
                        <Divider className={classes.divider} />
                        <Input
                            disabled={isLoading}
                            className={classes.input}
                            disableUnderline
                            onChange={onSearchStringChange}
                            value={searchString}
                            endAdornment={
                                <IconButton
                                    disabled={isLoading}
                                    onClick={applySearch}
                                    className={classes.iconButton} >
                                    <Search fontSize='small' />
                                </IconButton>
                            }
                        />
                        { this.getList() }
                        <Button onClick={applyClickHandler} className={classes.submitButton}>
                            Застосувати
                        </Button>
                    </Grid>
            </Popover>
        );
    }
}

export default withStyles(styles)(LpuFilterPopper);
