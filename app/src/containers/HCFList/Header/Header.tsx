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
    getAsyncStatus?: (key: string) => IAsyncStatus;
    sortLpuBy?: (propName: SortableProps, order: SORT_ORDER) => void;
    clearLpuSorting?: () => void;
    LPUs?: ILPU[];
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
            getAsyncStatus
        },
        uiStore: {
            LpuSortSettings,
            LpuFilterSettings,
            filterLpuBy
        }
    }
}) => ({
    LPUs,
    getAsyncStatus,
    LpuSortSettings,
    LpuFilterSettings,
    filterLpuBy
}))
@observer
class Header extends Component<IProps> {
    readonly defaultState: IState = {
        propName: null,
        order: null,
        selectedLpus: []
    };
    @observable sortState: IState = { ...this.defaultState };
    @observable filterPopperAnchor: HTMLElement = null;
    @observable searchString: string = '';
    @observable suggestions: Array<{ id: number, value: string}> = [];

    @computed
    get isLoading(): boolean {
        return this.props.getAsyncStatus('loadLPUs').loading;
    }

    @computed
    get sortCallback(): any {
        const { order, propName } = this.sortState;
        return order === SORT_ORDER.ASCENDING
            ? (a: ILPU, b: ILPU) => a[propName].localeCompare(b[propName])
            : (a: ILPU, b: ILPU) => b[propName].localeCompare(a[propName]);
    }

    // @computed
    get mappedLpus(): Array<{ id: number, value: string }> {
        const { LPUs } = this.props;
        const { propName } = this.sortState;
        if (!propName || !LPUs || this.isLoading) return [];
        const mapped = LPUs.map(({ id, [propName]: value }) => ({ id, value }));
        return uniqBy(mapped, 'value');
    }

    itemClickHandler = (x: any) => {
        const indOf = this.sortState.selectedLpus.indexOf(x);
        if (indOf === -1) {
            this.sortState.selectedLpus.push(x);
        } else {
            this.sortState.selectedLpus.splice(indOf, 1);
        }
    }

    inputChangeHandler = ({ target: { value }}: any) => {
        this.searchString = value;
    }

    findSuggestions = () => {
        const { propName } = this.sortState;
        const toLower = this.searchString.toLowerCase();
        this.suggestions = this.mappedLpus.filter(({ value }) => value.toLowerCase().includes(toLower));
    }

    sortOrderChangeHandler = (order: SORT_ORDER) => {
        this.sortState.order = order;
    }

    popoverCloseHandler = () => {
        this.filterPopperAnchor = null;
        this.sortState = {...this.defaultState};
    }

    buttonClickHandler = (propName: SortableProps) => ({ target }: any) => {
        const { LpuSortSettings, LpuFilterSettings } = this.props;

        this.filterPopperAnchor = target;
        this.sortState.propName = propName;

        if (LpuSortSettings && LpuSortSettings.propName === propName) {
            this.sortState.order = LpuSortSettings.order;
        }
        if (LpuFilterSettings && LpuFilterSettings.propName === propName) {
            // this.sortState.selectedLpus = LpuFilterSettings.selectedValues;
        }
    }

    applyFilters = () => {
        const {
            sortLpuBy,
            filterLpuBy,
            LpuSortSettings,
            LpuFilterSettings
        } = this.props;

        const {
            propName,
            order,
            selectedLpus,
        } = this.sortState;

        if (order !== null) {
            const condition = !!LpuSortSettings
                ? (order !== LpuSortSettings.order) || propName !== LpuSortSettings.propName
                : true;
            if (condition) sortLpuBy(propName, order);
        }

        if (selectedLpus.length || (!!LpuFilterSettings && LpuFilterSettings.propName === propName)) {
            // filterLpuBy(propName, selectedLpus);
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <>
            <Grid className={classes.root} container alignItems='center'>
                <Grid className={cx(classes.cell, classes.name)} xs alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        Назва
                        <IconButton
                            onClick={this.buttonClickHandler('name')}
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
                            // onClick={this.buttonClickHandler('region')}
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
                            onClick={this.buttonClickHandler('oblast')}
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
                            onClick={this.buttonClickHandler('city')}
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

                order={this.sortState.order}
                onOrderChange={this.sortOrderChangeHandler}

                searchString={this.searchString}
                onSearchStringChange={this.inputChangeHandler}
                applySearch={this.findSuggestions}

                suggestions={this.suggestions}
                selectedItems={this.sortState.selectedLpus}
                itemClickHandler={this.itemClickHandler}

                applyClickHandler={this.applyFilters}
            />
            </>
        );
    }
}

export default withStyles(styles)(Header);
