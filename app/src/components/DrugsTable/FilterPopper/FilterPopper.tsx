import React, { Component } from 'react';
import { createStyles, WithStyles, Popover, Grid, Button, Input, Divider, FormControlLabel, Checkbox, Typography, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { ISalesPharmacyFilter, SORT_ORDER } from '../../../stores/UIStore';
import cx from 'classnames';
import { ILPU } from '../../../interfaces/ILPU';
import { computed, observable, toJS } from 'mobx';
import SuggestListItem from '../SuggestListItem';
import debounce from 'lodash/debounce';
import DateSelect from '../../../containers/Header/SalaryReviewModal/ModalDateSelectPopper/ModalDateSelectPopper';

const styles = (theme: any) => createStyles({
    input: {
        border: '1px solid #aaa',
        borderRadius: 2,
        padding: '0 8px'
    },
    container: {
        padding: 12,
        maxWidth: 300
    },
    button: {
        marginTop: 10,
        border: '1px solid transparent',
        '&.active': {
            border: '1px solid #aaa'
        }
    },
    select: {
        marginTop: 22,
        maxWidth: '100%',
        border: '1px solid #aaa',
        borderRadius: 2,
        minWidth: 275
    },
    divider: {
        marginTop: 13
    },
    label: {
        margin: 0
    },
    checkbox: {
        padding: 0,
        marginRight: 5
    },
    list: {
        overflow: 'auto',
        flexWrap: 'nowrap',
        maxHeight: 240,
        minHeight: 180,
        padding: 0
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
    withTopMargin: {
        marginTop: 12
    },
    discardButton: {
        color: '#36A0F4',
        width: '100%'
    },
    applyButton: {
        backgroundColor: '#647CFE',
        color: 'white',
        width: '100%',
        '&:hover': {
            backgroundColor: '#7a8fff',
        }
    },
    buttonGroup: {
        padding: 10,
        marginBottom: 10
    }
});

interface IProps extends WithStyles<typeof styles> {
    anchor: HTMLElement;
    closeHandler: () => void;
    salesPharmacyFilter?: ISalesPharmacyFilter;
    pharmaciesMap?: Map<number, ILPU>;
    setPharmacyFilters?: (value: ISalesPharmacyFilter) => void;
    ignoredLocations?: Set<number>;
}

@inject(({
    appState: {
        uiStore: {
            salesPharmacyFilter,
            setPharmacyFilters
        },
        salesStore: {
            pharmaciesMap,
            ignoredLocations
        }
    }
}) => ({
    salesPharmacyFilter,
    pharmaciesMap,
    setPharmacyFilters,
    ignoredLocations
}))
@observer
class FilterPopper extends Component<IProps> {
    @observable search: string = '';
    @observable filters: ISalesPharmacyFilter = {
        order: SORT_ORDER.ASCENDING,
        ignoredLpus: new Set()
    };

    @computed
    get pharmaList(): ILPU[] {
        const { pharmaciesMap } = this.props;
        if (!pharmaciesMap || !pharmaciesMap.size) return [];
        return [...pharmaciesMap.values()];
    }

    get sortedList(): ILPU[] {
        const callback = this.filters.order === SORT_ORDER.ASCENDING
            ? (a: ILPU, b: ILPU) => a.name.localeCompare(b.name)
            : (a: ILPU, b: ILPU) => b.name.localeCompare(a.name);
        return this.pharmaList.sort(callback);
    }

    get filteredList(): ILPU[] {
        if (!this.search) return this.sortedList;
        const changed = this.search.toLowerCase();
        return this.sortedList.filter(({ name, address, city }) => (
            (name || '').includes(changed)
            || (address || '').includes(changed)
            || (city || '').includes(changed)
        ));
    }

    sortAtoZ = () => {
        this.filters.order = SORT_ORDER.ASCENDING;
    }

    sortZtoA = () => {
        this.filters.order = SORT_ORDER.DESCENDING;
    }

    applyFilters = () => {
        const map = this.pharmaList.map(({ id }) => id);
        this.props.setPharmacyFilters({ ...this.filters, map });
        this.props.closeHandler();
    }

    searchChangeHandler = ({ target: { value }}: any) => {
        this.setSearch(value);
    }

    setSearch = debounce(
        (value: string) => {
            this.search = value;
        },
        200
    );

    toggleAll = () => {
        const shouldFlush = !!this.filters.ignoredLpus.size
            && this.filters.ignoredLpus.size === this.pharmaList.length;

        if (shouldFlush) {
            this.filters.ignoredLpus.clear();
        } else {
            this.filters.ignoredLpus = new Set(
                this.pharmaList.map(({ id }) => id)
            );
        }
    }

    lpuClickHandler = ({ id }: ILPU) => {
        if (this.filters.ignoredLpus.has(id)) {
            this.filters.ignoredLpus.delete(id);
        } else {
            this.filters.ignoredLpus.add(id);
        }
    }

    componentDidUpdate(prevProps: IProps) {
        const { anchor: prevAnchor } = prevProps;
        const { anchor, salesPharmacyFilter, ignoredLocations } = this.props;

        if (!prevAnchor && !!anchor) {
            const { order } = salesPharmacyFilter;
            const newIgnoredLpus = new Set(ignoredLocations.values());
            this.filters = { order, ignoredLpus: newIgnoredLpus };
        } else if (!!prevAnchor && !anchor) {
            this.search = '';
        }
    }

    componentWillUnmount() {
        this.props.setPharmacyFilters(null);
    }

    render() {
        const { closeHandler, anchor, classes } = this.props;
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
                anchorEl={anchor}
                open={!!anchor}>
                    <Grid className={classes.container} container direction='column'>
                        <Button
                            className={cx(classes.button, {
                                active: this.filters.order === SORT_ORDER.ASCENDING
                            })}
                            onClick={this.sortAtoZ}>
                                Сортувати від А до Я
                        </Button>
                        <Button
                            className={cx(classes.button, {
                                active: this.filters.order === SORT_ORDER.DESCENDING
                            })}
                            onClick={this.sortZtoA}>
                                Сортувати від Я до А
                        </Button>
                        <Divider className={classes.divider} />
                        <Input
                            className={classes.select}
                            onChange={this.searchChangeHandler}
                            disableUnderline
                            placeholder='Пошук'
                        />
                        <ListItem
                            className={cx(classes.withTopMargin, classes.listItem)}
                            onClick={this.toggleAll}
                            button
                            dense>
                            <ListItemIcon>
                                <Checkbox
                                checked={this.filters.ignoredLpus.size === 0}
                                edge='start'
                                color='default'
                                disableRipple
                                />
                            </ListItemIcon>
                            <ListItemText primary='Аптеки' />
                        </ListItem>
                        <Divider />
                        <List className={classes.list}>
                            {
                                this.filteredList.map(x => (
                                    <SuggestListItem
                                        className={classes.listItem}
                                        key={x.id}
                                        onClick={this.lpuClickHandler}
                                        checked={this.filters.ignoredLpus.has(x.id) === false}
                                        pharma={x}
                                    />
                                ))
                            }
                            {
                                this.filteredList.length === 0 &&
                                <Typography variant='body2'>
                                    {
                                        this.pharmaList.length
                                        ? 'Не знайдено збігів серед імен, назв міст і вулиць'
                                        : 'Список аптек пустий'
                                    }
                                </Typography>
                            }
                        </List>

                        <Grid className={classes.buttonGroup} container wrap='nowrap' alignItems='center'>
                            <Button onClick={closeHandler} className={classes.discardButton}>
                                Відмінити
                            </Button>
                            <Button onClick={this.applyFilters} className={classes.applyButton}>
                                Застосувати
                            </Button>
                        </Grid>
                    </Grid>
            </Popover>
        );
    }
}

export default withStyles(styles)(FilterPopper);
