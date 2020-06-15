import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Typography, IconButton } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import ExcelIcon from '../../../components/ExcelIcon';
import cx from 'classnames';
import { Close, FilterList } from '@material-ui/icons';
import DoctorsFilterPopper, { DoctorsSortableProps } from '../../../components/DoctorsFilterPopper/DoctorsFilterPopper';
import { computed, observable, reaction, toJS } from 'mobx';
import { IAsyncStatus } from '../../../stores/AsyncStore';
import { IFilterBy, ISortBy, SORT_ORDER } from '../../../stores/UIStore';
import { IDoctor } from '../../../interfaces/IDoctor';

const styles = (theme: any) => createStyles({
    column: {
        minWidth: 120
    },
    accessContainer: {
        minWidth: 100
    },
    root: {
        marginTop: 16,
        padding: '0 10px',
        height: 40,
    },
    excelButton: {
        marginLeft: 'auto'
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
        marginLeft: 'auto'
    }
});

interface IProps extends WithStyles<typeof styles> {
    loadDocsExcel?: () => void;
    unconfirmed?: boolean;

    getAsyncStatus?: (key: string) => IAsyncStatus;
    sortDataBy?: (propName: DoctorsSortableProps, order: SORT_ORDER) => void;
    clearSorting?: () => void;
    clearFilters?: () => void;
    doctors?: IDoctor[];
    sortSettings?: ISortBy;
    filterSettings?: IFilterBy;
    filterDataBy?: (propName: DoctorsSortableProps, selectedValues: IDoctor[]) => void;
}

@inject(({
             appState: {
                 departmentsStore: {
                     loadDocsExcel,
                     getAsyncStatus,
                     doctors
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
    sortSettings,
    filterSettings,
    filterDataBy,
    sortDataBy,
    clearSorting,
    clearFilters,
    loadDocsExcel,
    getAsyncStatus,
    doctors
}))
@observer
class ListHeader extends Component<IProps> {
    sortReaction: any;

    @observable filterPopperAnchor: HTMLElement = null;
    @observable searchString: string = '';
    @observable searchInputValue: string = '';
    @observable propName: DoctorsSortableProps = null;
    @observable order: SORT_ORDER = null;
    @observable ignoredItems: any[] = [];
    @observable source: IDoctor[] = null;

    get totalLength(): number {
        const { doctors } = this.props;
        return (doctors || []).length;
    }

    @computed
    get isLoading(): boolean {
        const { getAsyncStatus } = this.props;
        return getAsyncStatus('loadDoctors').loading;
    }

    @computed
    get sortedOptions(): IDoctor[] {
        return (this.order && this.source)
            ? this.source.slice().sort(this.sortCallback)
            : this.source;
    }

    @computed
    get sortCallback(): any {
        return this.order === SORT_ORDER.ASCENDING
            ? (a: any, b: any) => a[this.propName].localeCompare(b[this.propName])
            : (a: any, b: any) => b[this.propName].localeCompare(a[this.propName]);
    }

    resetValues = () => {
        this.propName = null;
        this.order = null;
        this.ignoredItems = [];
        this.searchString = '';
        this.searchInputValue = '';
    }

    openFilterPopper = (propName: DoctorsSortableProps) => ({ target }: any) => {
        const {
            doctors,
            sortSettings,
            filterSettings
        } = this.props;

        const source = doctors;

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
        }
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
                .replace(/\u02bc/, '')
                .replace('ʼ', '')
                .replace('`', '')
                .replace('\'', '')
            : '';

        for (let i = 0; i < maxIter; ++i) {
            const value = this.sortedOptions[i][this.propName];

            const passFilter = lowerCaseFilter === '' || value.toLowerCase()
                .replace(/\u02bc/, '')
                .includes(lowerCaseFilter);
            if (passFilter === true && checklist.includes(value) === false) {
                checklist.push(value);
                res.push({ id: i, value });
            }
        }
        return res;
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

    popoverCloseHandler = () => {
        if (this.sortReaction) this.sortReaction();
        this.filterPopperAnchor = null;
        this.resetValues();
    }

    sortOrderChangeHandler = (order: SORT_ORDER) => {
        this.order = order;
        console.log(
            'new order: ', order, toJS(this.order),
            'propName: ', toJS(this.propName));

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

    clearAll = () => {
        const { clearFilters, clearSorting } = this.props;
        clearFilters();
        clearSorting();
    }

    render() {
        const { classes, loadDocsExcel, unconfirmed, filterSettings, sortSettings } = this.props;
        const sortPropName = sortSettings ? sortSettings.propName : null;
        const filterPropName = filterSettings ? filterSettings.propName : null;
        return (
            <>
                <Grid className={classes.root} alignItems='center' container>
                    {
                        unconfirmed &&
                        <Grid className={classes.accessContainer}>
                            <Typography variant='body2' color='textSecondary'>
                                Підтверджено
                            </Typography>
                        </Grid>
                    }
                    <Grid xs container item>
                        <Typography variant='body2' color='textSecondary'>
                            ЛПУ
                            <IconButton
                                onClick={this.openFilterPopper('LPUName')}
                                className={cx(classes.iconButton, { active: ('LPUName' === sortPropName || 'LPUName' === filterPropName) })}>
                                <FilterList fontSize='small'/>
                            </IconButton>
                        </Typography>
                    </Grid>
                    <Grid xs container item>
                        <Typography variant='body2' color='textSecondary'>
                            ПІБ лікаря
                            <IconButton
                                onClick={this.openFilterPopper('name')}
                                className={cx(classes.iconButton, { active: ('name' === sortPropName || 'name' === filterPropName) })}>
                                <FilterList fontSize='small'/>
                            </IconButton>
                        </Typography>
                    </Grid>
                    <Grid xs={1} className={classes.column} container item>
                        <Typography variant='body2' color='textSecondary'>
                            Спецільність
                            <IconButton
                                onClick={this.openFilterPopper('specialty')}
                                className={cx(classes.iconButton, { active: ('specialty' === sortPropName || 'specialty' === filterPropName) })}>
                                <FilterList fontSize='small'/>
                            </IconButton>
                        </Typography>
                    </Grid>
                    <Grid xs={1} className={classes.column} container item>
                        <Typography variant='body2' color='textSecondary'>
                            Телефон
                        </Typography>
                    </Grid>
                    <Grid xs={1} className={classes.column} container item>
                        <Typography variant='body2' color='textSecondary'>
                            № карти
                        </Typography>
                    </Grid>

                    <Grid xs={3} alignItems='center' container item>
                        {
                            !unconfirmed &&
                            <>
                                <Typography variant='body2' color='textSecondary'>
                                    Депозит
                                </Typography>
                                {
                                    (!!sortSettings || !!filterSettings) &&
                                    <IconButton className={classes.closeIconButton} onClick={this.clearAll}>
                                        <Close fontSize='small'/>
                                    </IconButton>
                                }
                                <IconButton className={classes.excelButton} onClick={loadDocsExcel}>
                                    <ExcelIcon/>
                                </IconButton>
                            </>
                        }
                    </Grid>
                </Grid>
                <DoctorsFilterPopper
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

export default withStyles(styles)(ListHeader);
