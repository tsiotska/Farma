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
import LoadingMask from '../LoadingMask';
import { Search } from '@material-ui/icons';
import SuggestList from './SuggestList';

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

    totalLength: number;
    suggestions: Array<{ id: number, value: string}>;
    selectedItems: Array<{ id: number, value: string}>;
    itemClickHandler: (lpu: ILPU) => void;

    applyClickHandler: () => void;
}

@observer
class LpuFilterPopper extends Component<IProps> {
    readonly wrapperClasses: any;
    readonly anchorOrigin: any = {
        vertical: 'bottom',
        horizontal: 'center',
    };
    readonly transformOrigin: any = {
        vertical: 'top',
        horizontal: 'center',
    };

    constructor(props: IProps) {
        super(props);
        this.wrapperClasses = { wrapper: props.classes.placeholder };
    }

    sortAtoZ = () => this.props.onOrderChange(SORT_ORDER.ASCENDING);

    sortZtoA = () => this.props.onOrderChange(SORT_ORDER.DESCENDING);

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
            suggestions,
            itemClickHandler,
            selectedItems
        } = this.props;

        return (
            <Popover
                anchorOrigin={this.anchorOrigin}
                transformOrigin={this.transformOrigin}
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
                            disableUnderline
                            // disabled={isLoading}
                            className={classes.input}
                            onChange={onSearchStringChange}
                            value={searchString}
                            endAdornment={
                                <IconButton
                                    // disabled={isLoading}
                                    onClick={applySearch}
                                    className={classes.iconButton} >
                                    <Search fontSize='small' />
                                </IconButton>
                            }
                        />
                        {
                            (!!suggestions && suggestions.length)
                            ? <SuggestList
                                items={suggestions}
                                itemClickHandler={itemClickHandler}
                                renderPropName='value'
                                selectedItems={selectedItems}
                                isLoading={isLoading}
                              />
                            : isLoading
                                ? <LoadingMask classes={this.wrapperClasses} size={20} />
                                : <Typography>
                                    {
                                        !!suggestions
                                            ? 'Відповідні дані відсутні'
                                            : 'Дані відсутні'
                                    }
                                </Typography>
                        }
                        <Button onClick={applyClickHandler} className={classes.submitButton}>
                            Застосувати
                        </Button>
                    </Grid>
            </Popover>
        );
    }
}

export default withStyles(styles)(LpuFilterPopper);
