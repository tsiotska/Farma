import React, { Component } from 'react';
import { WithStyles, createStyles, Grid, Typography, withStyles, IconButton } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import cx from 'classnames';
import { gridStyles } from '../gridStyles';
import { FilterList } from '@material-ui/icons';
import { observable, computed, toJS } from 'mobx';
import LpuFilterPopper from '../../../components/LpuFilterPopper';
import { SortableProps } from '../../../components/LpuFilterPopper/LpuFilterPopper';
import { ILPU } from '../../../interfaces/ILPU';
import { SORT_ORDER, ISortBy, IFilterBy } from '../../../stores/UIStore';
import debounce from 'lodash/debounce';
import { IAsyncStatus } from '../../../stores/AsyncStore';
import { uniqBy } from 'lodash';

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
        marginLeft: 5
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
            filterLpuBy
        }
    }
}) => ({
    LPUs,
    pharmacies,
    getAsyncStatus,
    LpuSortSettings,
    LpuFilterSettings,
    filterLpuBy
}))
@observer
class Header extends Component<IProps> {
    @observable filterPopperAnchor: HTMLElement = null;
    @observable searchString: string = '';
    @observable propName: SortableProps = null;
    @observable order: SORT_ORDER = null;
    @observable selectedItems: any[] = [];

    @observable source: ILPU[] = null;

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
            ? (a: any, b: any) => a.value.localeCompare(b.value)
            : (a: any, b: any) => b.value.localeCompare(a.value);
    }

    // @computed
    get options(): any[] {
        const checklist: string[] = [];
        const res: any[] = [];

        if (!this.source || !this.propName) return res;

        const maxIter = this.isLoading
            ? (this.source.length > 200 ? 200 : this.source.length)
            : this.source.length;

        const lowerCaseFilter = this.searchString
            ? this.searchString.toLowerCase()
            : '';

        for (let i = 0; i < maxIter; ++i) {
            const curr = this.source[i];
            const {[this.propName]: value} = curr;

            const passFilter = lowerCaseFilter === ''
                ? true
                : value.includes(lowerCaseFilter);

            if (passFilter === true && checklist.includes(value) === false) {
                checklist.push(value);
                res.push({ id: i, value });
            }
        }

        return this.order
            ? res.sort(this.sortCallback)
            : res;
    }

    itemClickHandler = ({ value }: any) => {
        const itemIndex = this.selectedItems.indexOf(value);
        if (itemIndex === -1) {
            this.selectedItems.push(value);
        } else {
            this.selectedItems.splice(itemIndex, 1);
        }
        console.log(this.selectedItems);
    }

    inputChangeHandler = ({ target: { value }}: any) => {
        this.searchString = value;
    }

    findSuggestions = () => {
        // const { propName } = this.sortState;
        // const toLower = (this.searchString || '').toLowerCase();
        // console.log('options: ', toJS(this.options));
        // this.suggestions = this.options.filter(({ value }) => value.toLowerCase().includes(toLower));
    }

    sortOrderChangeHandler = (order: SORT_ORDER) => {
        this.order = order;
    }

    popoverCloseHandler = () => {
        this.filterPopperAnchor = null;
        this.resetValues();
    }

    resetValues = () => {
        this.propName = null;
        this.order = null;
        this.selectedItems = [];
        this.searchString = '';
    }

    openFilterPopper = (propName: SortableProps) => ({ target }: any) => {
        // const { LpuSortSettings, LpuFilterSettings } = this.props;

        this.resetValues();
        this.filterPopperAnchor = target;
        this.propName = propName;
        console.log('propName: ', this.propName);

        // if (LpuSortSettings && LpuSortSettings.propName === propName) {
        //     this.sortState.order = LpuSortSettings.order;
        // }
        // if (LpuFilterSettings && LpuFilterSettings.propName === propName) {
        //     // this.sortState.selectedLpus = LpuFilterSettings.selectedValues;
        // }
    }

    applyFilters = () => {
        // const {
        //     sortLpuBy,
        //     filterLpuBy,
        //     LpuSortSettings,
        //     LpuFilterSettings
        // } = this.props;

        // const {
        //     propName,
        //     order,
        //     selectedLpus,
        // } = this.sortState;

        // if (order !== null) {
        //     const condition = !!LpuSortSettings
        //         ? (order !== LpuSortSettings.order) || propName !== LpuSortSettings.propName
        //         : true;
        //     if (condition) sortLpuBy(propName, order);
        // }

        // if (selectedLpus.length || (!!LpuFilterSettings && LpuFilterSettings.propName === propName)) {
        //     // filterLpuBy(propName, selectedLpus);
        // }
    }

    componentDidUpdate(prevProps: IProps) {
        const { LPUs, pharmacies, type } = this.props;
        const source = type === 'pharmacy'
            ? pharmacies
            : LPUs;

        if (this.filterPopperAnchor && !!source) {
            if (this.source === source) return;

            const sourceIsEmpty = !this.source || !source.length;

            if (this.isLoading && sourceIsEmpty) {
                this.source = source.slice(0, 2500);
            } else if (this.isLoading === false) {
                this.source = source;
            }
        } else {
            this.source = null;
        }
    }

    render() {
        const { classes, LPUs } = this.props;
        console.log('src: ', this.source && this.source.length);
        console.log('opt: ', this.options.length);
        return (
            <>
            <Grid className={classes.root} container alignItems='center'>
                <Grid className={cx(classes.cell, classes.name)} xs alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        Назва
                        <IconButton
                            onClick={this.openFilterPopper('name')}
                            className={classes.iconButton}>
                            <FilterList fontSize='small' />
                        </IconButton>
                    </Typography>
                </Grid>
                <Grid className={cx(classes.cell, classes.region)} xs={1} alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        Регіон
                        <IconButton
                            disabled
                            // onClick={this.openFilterPopper('region')}
                            className={classes.iconButton}>
                            <FilterList fontSize='small' />
                        </IconButton>
                    </Typography>
                </Grid>
                <Grid className={cx(classes.cell, classes.oblast)} xs={1} alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        Область
                        <IconButton
                            disabled
                            onClick={this.openFilterPopper('oblast')}
                            className={classes.iconButton}>
                            <FilterList fontSize='small' />
                        </IconButton>
                    </Typography>
                </Grid>
                <Grid className={cx(classes.cell, classes.city)} xs={1} alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        Місто
                        <IconButton
                            disabled
                            onClick={this.openFilterPopper('city')}
                            className={classes.iconButton}>
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

                searchString={this.searchString}
                onSearchStringChange={this.inputChangeHandler}
                applySearch={this.findSuggestions}

                totalLength={this.source ? this.source.length : 0}
                suggestions={this.options}
                selectedItems={this.selectedItems}
                itemClickHandler={this.itemClickHandler}

                applyClickHandler={this.applyFilters}
            />
            </>
        );
    }
}

export default withStyles(styles)(Header);
