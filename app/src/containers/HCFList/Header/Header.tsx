import React, { Component } from 'react';
import { WithStyles, createStyles, Grid, Typography, withStyles, IconButton } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import cx from 'classnames';
import { gridStyles } from '../gridStyles';
import { FilterList, Close } from '@material-ui/icons';
import { observable, computed, toJS, reaction } from 'mobx';
import LpuFilterPopper from '../../../components/LpuFilterPopper';
import { LPUSortableProps } from '../../../components/LpuFilterPopper/LpuFilterPopper';
import { ILPU } from '../../../interfaces/ILPU';
import { SORT_ORDER, ISortBy, IFilterBy } from '../../../stores/UIStore';
import { IAsyncStatus } from '../../../stores/AsyncStore';

const styles = (theme: any) => createStyles({
    ...gridStyles(theme),
    root: {
        marginTop: 16,
        padding: '0 10px',
        height: 40,
    },
    text: {
        fontFamily: 'Source Sans Pro SemiBold',
        color: theme.palette.primary.gray.light,
        width: '100%'
    },
    iconButton: {
        padding: 4,
        borderRadius: 2,
        marginLeft: 5,
        '&.active': {
            color: theme.palette.primary.green.main
        }
    },
    closeIconButton: {
        padding: 4,
        borderRadius: 2,
        fontSize: 10,
        marginRight: 2,
    }
});

interface IProps extends WithStyles<typeof styles> {
    type: 'hcf' | 'pharmacy';

    getAsyncStatus?: (key: string) => IAsyncStatus;
    sortDataBy?: (propName: LPUSortableProps, order: SORT_ORDER) => void;
    clearSorting?: () => void;
    clearFilters?: () => void;
    LPUs?: ILPU[];
    pharmacies?: ILPU[];
    sortSettings?: ISortBy;
    filterSettings?: IFilterBy;
    filterDataBy?: (propName: LPUSortableProps, selectedValues: ILPU[]) => void;

}

export interface IState {
    propName: LPUSortableProps;
    order: SORT_ORDER;
    selectedLpus: Array<{ id: number, value: string }>;
}

@inject(({
             appState: {
                 departmentsStore: {
                     LPUs,
                     getAsyncStatus,
                     pharmacies
                 },
                 uiStore: {
                     sortSettings,
                     filterSettings,
                     filterDataBy,
                     sortDataBy,
                     clearSorting,
                     clearFilters
                 }
             }
         }) => ({
    LPUs,
    pharmacies,
    getAsyncStatus,
    sortSettings,
    filterSettings,
    filterDataBy,
    sortDataBy,
    clearSorting,
    clearFilters
}))
@observer
class Header extends Component<IProps> {
    sortReaction: any;

    @observable filterPopperAnchor: HTMLElement = null;
    @observable searchString: string = '';
    @observable searchInputValue: string = '';
    @observable propName: LPUSortableProps = null;
    @observable order: SORT_ORDER = null;
    // @observable selectedItems: any[] = [];
    @observable ignoredItems: any[] = [];

    @observable source: ILPU[] = null;

    get totalLength(): number {
        const { type, pharmacies, LPUs } = this.props;
        const source = type === 'pharmacy'
            ? pharmacies
            : LPUs;
        return (source || []).length;
    }

    @computed
    get isLoading(): boolean {
        const { getAsyncStatus, type } = this.props;
        const targetFoo = type === 'pharmacy'
            ? 'loadPharmacies'
            : 'loadLPUs';
        return getAsyncStatus(targetFoo).loading;
    }

    @computed
    get sortCallback(): any {
        return this.order === SORT_ORDER.ASCENDING
            ? (a: any, b: any) => a[this.propName].localeCompare(b[this.propName])
            : (a: any, b: any) => b[this.propName].localeCompare(a[this.propName]);
    }

    @computed
    get sortedOptions(): ILPU[] {
        return (this.order && this.source)
            ? this.source.slice().sort(this.sortCallback)
            : this.source;
    }

    @computed
    get filteredOptions(): any[] {
        const checklist: string[] = [];
        const res: any[] = [];

        if (!this.sortedOptions) return res;

        const maxIter = this.isLoading
            ? (this.sortedOptions.length > 200 ? 200 : this.sortedOptions.length)
            : this.sortedOptions.length;

        const lowerCaseFilter = this.searchString
            ? this.searchString.toLowerCase()
            : '';

        for (let i = 0; i < maxIter; ++i) {
            const value = this.sortedOptions[i][this.propName];

            // if filterString === '' -> its already pass filter, otherwise -> check searchString
            const passFilter = lowerCaseFilter === '' || value.includes(lowerCaseFilter);

            if (passFilter === true && checklist.includes(value) === false) {
                checklist.push(value);
                res.push({ id: i, value });
            }
        }
        return res;
    }

    itemClickHandler = ({ value }: any) => {
        const itemIndex = this.ignoredItems.indexOf(value);
        if (itemIndex === -1) {
            this.ignoredItems.push(value);
        } else {
            this.ignoredItems.splice(itemIndex, 1);
        }
    }

    inputChangeHandler = ({ target: { value } }: any) => {
        this.searchInputValue = value;
    }

    findSuggestions = () => {
        this.searchString = this.searchInputValue;
    }

    sortOrderChangeHandler = (order: SORT_ORDER) => {
        this.order = order;
        console.log(
            'new order: ', order, toJS(this.order),
            'propName: ', toJS(this.propName));

    }

    popoverCloseHandler = () => {
        if (this.sortReaction) this.sortReaction();
        this.filterPopperAnchor = null;
        this.resetValues();
    }

    resetValues = () => {
        this.propName = null;
        this.order = null;
        this.ignoredItems = [];
        this.searchString = '';
        this.searchInputValue = '';
    }

    openFilterPopper = (propName: LPUSortableProps) => ({ target }: any) => {
        const {
            type,
            LPUs,
            pharmacies,
            sortSettings,
            filterSettings
        } = this.props;

        const source = type === 'pharmacy'
            ? pharmacies
            : LPUs;

        this.resetValues();
        this.filterPopperAnchor = target;
        this.propName = propName;

        this.sortReaction = reaction(
            () => ([this.isLoading, source && source.length]),
            ([isLoading, size]: [boolean, number], r) => {
                if (isLoading) {
                    if (!size) return;

                    const newItems = size > 200
                        ? source.slice(0, 200)
                        : source;

                    const storedItemsLength = this.source
                        ? this.source.length
                        : -1;

                    if (storedItemsLength !== newItems.length) {
                        this.source = newItems;
                    }
                } else {
                    this.source = source;
                    r.dispose();
                }
            }, {
                fireImmediately: true
            }
        );

        if (sortSettings && sortSettings.propName === propName) {
            this.order = sortSettings.order;
        }
        if (filterSettings && filterSettings.propName === propName) {
            this.ignoredItems = [...filterSettings.ignoredItems];
            // this.selectedItems = [...LpuFilterSettings.selectedValues];
        }
    }

    applyFilters = () => {
        const {
            sortDataBy,
            filterDataBy,
        } = this.props;

        if (this.order !== null) {
            sortDataBy(this.propName, this.order);
        }

        if (this.searchString) {
            for (const item of this.source) {
                let exists = false;
                for (const filtered of this.filteredOptions) {
                    if (item[this.propName] === filtered.value) {
                        exists = true;
                    }
                }
                if (!exists) {
                    this.ignoredItems.push(item[this.propName]);
                }
            }
        }

        filterDataBy(this.propName, this.ignoredItems);
        this.popoverCloseHandler();
    }

    toggleAll = () => {
        if (this.ignoredItems.length) {
            this.ignoredItems = [];
        } else {
            this.ignoredItems = this.sortedOptions.reduce((acc, { [this.propName]: value }) => {
                return acc.includes(value)
                    ? acc
                    : [...acc, value];
            }, []);
        }
    }

    clearAll = () => {
        const { clearFilters, clearSorting } = this.props;
        clearFilters();
        clearSorting();
    }

    componentWillUnmount() {
        if (this.sortReaction) this.sortReaction();
    }

    render() {
        const { classes, filterSettings, sortSettings } = this.props;

        const sortPropName = sortSettings ? sortSettings.propName : null;
        const filterPropName = filterSettings ? filterSettings.propName : null;

        return (
            <>
                <Grid className={classes.root} container alignItems='center'>
                    <Grid className={cx(classes.cell, classes.name)} xs alignItems='center' container item>
                        <Typography className={classes.text} variant='body2'>
                            Назва
                            <IconButton
                                onClick={this.openFilterPopper('name')}
                                className={cx(classes.iconButton, { active: ('name' === sortPropName || 'name' === filterPropName) })}>
                                <FilterList fontSize='small'/>
                            </IconButton>
                        </Typography>
                    </Grid>
                    <Grid className={cx(classes.cell, classes.region)} xs={1} alignItems='center' container item>
                        <Typography className={classes.text} variant='body2'>
                            Регіон
                            <IconButton
                                onClick={this.openFilterPopper('regionName')}
                                className={cx(classes.iconButton, { active: ('regionName' === sortPropName || 'regionName' === filterPropName) })}
                                // className={classes.iconButton}
                            >
                                <FilterList fontSize='small'/>
                            </IconButton>
                        </Typography>
                    </Grid>
                    <Grid className={cx(classes.cell, classes.oblast)} xs={1} alignItems='center' container item>
                        <Typography className={classes.text} variant='body2'>
                            Область
                            <IconButton
                                onClick={this.openFilterPopper('oblast')}
                                className={cx(classes.iconButton, { active: ('oblast' === sortPropName || 'oblast' === filterPropName) })}>
                                <FilterList fontSize='small'/>
                            </IconButton>
                        </Typography>
                    </Grid>
                    <Grid className={cx(classes.cell, classes.city)} xs={1} alignItems='center' container item>
                        <Typography className={classes.text} variant='body2'>
                            Місто
                            <IconButton
                                onClick={this.openFilterPopper('city')}
                                className={cx(classes.iconButton, { active: ('city' === sortPropName || 'city' === filterPropName) })}>
                                <FilterList fontSize='small'/>
                            </IconButton>
                        </Typography>
                    </Grid>
                    <Grid className={cx(classes.cell, classes.address)} xs alignItems='center' container item>
                        <Typography className={classes.text} variant='body2'>
                            Адрес
                        </Typography>
                    </Grid>
                    <Grid className={cx(classes.cell, classes.phone)} xs={1} alignItems='center' wrap='nowrap' container
                          item>
                        <Typography className={classes.text} variant='body2'>
                            Телефон
                        </Typography>
                        {
                            (!!sortSettings || !!filterSettings) &&
                            <IconButton className={classes.closeIconButton} onClick={this.clearAll}>
                                <Close fontSize='small'/>
                            </IconButton>
                        }
                    </Grid>
                </Grid>
                <LpuFilterPopper
                    toggleAll={this.toggleAll}
                    propName={this.propName}
                    anchor={this.filterPopperAnchor}
                    onClose={this.popoverCloseHandler}
                    isLoading={this.isLoading}

                    order={this.order}
                    onOrderChange={this.sortOrderChangeHandler}

                    searchString={this.searchInputValue}
                    onSearchStringChange={this.inputChangeHandler}
                    applySearch={this.findSuggestions}

                    totalLength={this.totalLength}
                    suggestions={this.filteredOptions}
                    ignoredItems={this.ignoredItems}
                    itemClickHandler={this.itemClickHandler}

                    applyClickHandler={this.applyFilters}
                />
            </>
        );
    }
}

export default withStyles(styles)(Header);
