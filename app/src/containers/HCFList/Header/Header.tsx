import React, { Component } from 'react';
import { WithStyles, createStyles, Grid, Typography, withStyles, IconButton } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import cx from 'classnames';
import { gridStyles } from '../gridStyles';
import { FilterList } from '@material-ui/icons';
import { observable, computed, toJS, reaction } from 'mobx';
import LpuFilterPopper from '../../../components/LpuFilterPopper';
import { SortableProps } from '../../../components/LpuFilterPopper/LpuFilterPopper';
import { ILPU } from '../../../interfaces/ILPU';
import { SORT_ORDER, ISortBy, IFilterBy } from '../../../stores/UIStore';
import { IAsyncStatus } from '../../../stores/AsyncStore';

const styles = (theme: any) => createStyles({
    ...gridStyles(theme),
    root: {
        marginBottom: 12
    },
    text: {
        fontFamily: 'Source Sans Pro SemiBold',
        color: theme.palette.primary.gray.light
    },
    iconButton: {
        padding: 4,
        borderRadius: 2,
        marginLeft: 5,
        '&.active': {
            color: theme.palette.primary.green.main
        }
    }
});

interface IProps extends WithStyles<typeof styles> {
    type: 'hcf' | 'pharmacy';

    getAsyncStatus?: (key: string) => IAsyncStatus;
    sortLpuBy?: (propName: SortableProps, order: SORT_ORDER) => void;
    clearLpuSorting?: () => void;
    LPUs?: ILPU[];
    pharmacies?: ILPU[];
    LpuSortSettings?: ISortBy;
    LpuFilterSettings?: IFilterBy;
    filterLpuBy?: (propName: SortableProps, selectedValues: ILPU[]) => void;
}

export interface IState {
    propName: SortableProps;
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
            LpuSortSettings,
            LpuFilterSettings,
            filterLpuBy,
            sortLpuBy
        }
    }
}) => ({
    LPUs,
    pharmacies,
    getAsyncStatus,
    LpuSortSettings,
    LpuFilterSettings,
    filterLpuBy,
    sortLpuBy
}))
@observer
class Header extends Component<IProps> {
    sortReaction: any;

    @observable filterPopperAnchor: HTMLElement = null;
    @observable searchString: string = '';
    @observable searchInputValue: string = '';
    @observable propName: SortableProps = null;
    @observable order: SORT_ORDER = null;
    // @observable selectedItems: any[] = [];
    @observable ignoredItems: any[] = [];

    @observable source: ILPU[] = null;

    get totalLength(): number {
        const { type, pharmacies, LPUs} = this.props;
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

    inputChangeHandler = ({ target: { value }}: any) => {
        this.searchInputValue = value;
    }

    findSuggestions = () => {
        this.searchString = this.searchInputValue;
    }

    sortOrderChangeHandler = (order: SORT_ORDER) => {
        this.order = order;
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

    openFilterPopper = (propName: SortableProps) => ({ target }: any) => {
        const {
            type,
            LPUs,
            pharmacies,
            LpuSortSettings,
            LpuFilterSettings
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

        if (LpuSortSettings && LpuSortSettings.propName === propName) {
            this.order = LpuSortSettings.order;
        }
        if (LpuFilterSettings && LpuFilterSettings.propName === propName) {
            this.ignoredItems = [ ...LpuFilterSettings.ignoredItems ];
            // this.selectedItems = [...LpuFilterSettings.selectedValues];
        }
    }

    applyFilters = () => {
        const {
            sortLpuBy,
            filterLpuBy,
        } = this.props;

        if (this.order !== null) {
            sortLpuBy(this.propName, this.order);
        }

        filterLpuBy(this.propName, this.ignoredItems);
        this.popoverCloseHandler();
    }

    componentWillUnmount() {
        if (this.sortReaction) this.sortReaction();
    }

    render() {
        const { classes, LpuFilterSettings, LpuSortSettings } = this.props;

        const sortPropName = LpuSortSettings ? LpuSortSettings.propName : null;
        const filterPropName = LpuFilterSettings ? LpuFilterSettings.propName : null;

        return (
            <>
            <Grid className={classes.root} container alignItems='center'>
                <Grid className={cx(classes.cell, classes.name)} xs alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        Назва
                        <IconButton
                            onClick={this.openFilterPopper('name')}
                            className={cx(classes.iconButton, { active: ('name' === sortPropName || 'name' === filterPropName) }) }>
                            <FilterList fontSize='small' />
                        </IconButton>
                    </Typography>
                </Grid>
                <Grid className={cx(classes.cell, classes.region)} xs={1} alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        Регіон
                        <IconButton
                            // onClick={this.openFilterPopper('region')}
                            // className={cx(classes.iconButton, { active: ('region' === sortPropName || 'region' === filterPropName) }) }>
                            className={classes.iconButton}>
                            <FilterList fontSize='small' />
                        </IconButton>
                    </Typography>
                </Grid>
                <Grid className={cx(classes.cell, classes.oblast)} xs={1} alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        Область
                        <IconButton
                            onClick={this.openFilterPopper('oblast')}
                            className={cx(classes.iconButton, { active: ('oblast' === sortPropName || 'oblast' === filterPropName) }) }>
                            <FilterList fontSize='small' />
                        </IconButton>
                    </Typography>
                </Grid>
                <Grid className={cx(classes.cell, classes.city)} xs={1} alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        Місто
                        <IconButton
                            onClick={this.openFilterPopper('city')}
                            className={cx(classes.iconButton, { active: ('city' === sortPropName || 'city' === filterPropName) }) }>
                            <FilterList fontSize='small' />
                        </IconButton>
                    </Typography>
                </Grid>
                <Grid className={cx(classes.cell, classes.address)} xs alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        Адрес
                    </Typography>
                </Grid>
                <Grid className={cx(classes.cell, classes.phone)} xs={1} alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        Телефон
                    </Typography>
                </Grid>
            </Grid>
            <LpuFilterPopper
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
                // selectedItems={this.selectedItems}
                ignoredItems={this.ignoredItems}
                itemClickHandler={this.itemClickHandler}

                applyClickHandler={this.applyFilters}
            />
            </>
        );
    }
}

export default withStyles(styles)(Header);
