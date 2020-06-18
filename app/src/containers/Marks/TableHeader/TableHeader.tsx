import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    Typography,
    Grid, IconButton
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { computed, observable, reaction, toJS } from 'mobx';
import { IMedicine } from '../../../interfaces/IMedicine';
import cx from 'classnames';
import { IDrugSale, IBonusInfo } from '../../../interfaces/IBonusInfo';
import { IUserInfo } from '../Table/Table';
import { IUserLikeObject } from '../../../stores/DepartmentsStore';
import { USER_ROLE } from '../../../constants/Roles';
import { FilterList } from '@material-ui/icons';
import MarksFilterPopper, { MarksSortableProps } from '../../../components/MarksFilterPopper/MarksFilterPopper';
import { ISortBy, SORT_ORDER } from '../../../stores/UIStore';
import { IAsyncStatus } from '../../../stores/AsyncStore';
import { LPUSortableProps } from '../../../components/LpuFilterPopper/LpuFilterPopper';
import { DoctorsSortableProps } from '../../../components/DoctorsFilterPopper/DoctorsFilterPopper';

const styles = (theme: any) => createStyles({
    doubleWidthColumn: {
        width: 284
    },
    wideColumn: {
        width: 284 / 2
    },
    column: {
        width: 70,
        '&:last-of-type': {
            width: 85
        }
    },
    container: {
        overflow: 'visible'
    },
    table: {
        tableLayout: 'fixed'
    },
    medItem: {
        transform: 'rotate(-45deg)',
        whiteSpace: 'nowrap',
        transformOrigin: 'left -50%',
        margin: '0 auto -10px 25%',
        fontSize: theme.typography.pxToRem(15),
        color: '#aaa'
    },
    cell: {
        verticalAlign: 'bottom',
        border: 'none',
        paddingBottom: '5px !important',
        '&:last-of-type': {
            paddingRight: 8
        },
        '&.invalid': {
            color: '#EE6969'
        }
    },
    span: {
        width: '100%',
        '&:first-of-type': {
            textAlign: 'right',
            fontFamily: 'Source Sans Pro SemiBold',
        }
    },
    salesStat: {
        width: '100%', display: 'flex'
    },
    iconButton: {
        padding: 4,
        borderRadius: 2,
        marginLeft: 5,
        '&.active': {
            color: theme.palette.primary.green.main
        }
    },
});

interface IProps extends WithStyles<typeof styles> {
    previewBonus: IBonusInfo;
    agents?: IUserInfo[];
    hideName?: boolean;
    parentUser: IUserInfo & IUserLikeObject;
    isNested: boolean;
    isMedicalAgent?: boolean;
    setDivisionValidity?: (value: boolean) => void;
    role?: USER_ROLE;
    totalSold?: (position?: number) => { [key: number]: number };
    meds?: IMedicine[];
    changedMedsMarks?: { [key: number]: number };
    sortSettings?: ISortBy;
    getAsyncStatus?: (key: string) => IAsyncStatus;
    sortDataBy?: (propName: MarksSortableProps, order: SORT_ORDER) => void;
    setPreviewDoctor?: (id: number) => void;
}

@inject(({
             appState: {
                 departmentsStore: {
                     currentDepartmentMeds: meds,
                     getAsyncStatus,
                     setPreviewDoctor
                 },
                 userStore: {
                     totalSold,
                     role,
                     changedMedsMarks,
                     setDivisionValidity
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
    meds,
    role,
    totalSold,
    changedMedsMarks,
    setDivisionValidity,
    getAsyncStatus,
    sortSettings,
    filterSettings,
    filterDataBy,
    sortDataBy,
    clearSorting,
    clearFilters,
    setPreviewDoctor
}))
@observer
class TableHeader extends Component<IProps> {
    sortReaction: any;
    @observable filterPopperAnchor: HTMLElement = null;
    @observable searchString: string = '';
    @observable searchInputValue: string = '';
    @observable propName: MarksSortableProps = null;
    @observable order: SORT_ORDER = null;
    // @observable ignoredItems: any[] = [];
    @observable source: IUserInfo[] = null;
    @observable selected: any = null;
    isValid: boolean = false;

    get nestLevel(): number {
        const { role, parentUser } = this.props;
        const userRole = typeof parentUser.position === 'string'
            ? USER_ROLE.MEDICAL_AGENT + 1
            : parentUser.position;
        return (userRole - role) + 1;
    }

    get columnWidth(): number {
        return 170 - this.nestLevel * 16 / 2;
    }

    get sales(): Map<number, IDrugSale> {
        const { previewBonus } = this.props;
        return previewBonus
            ? previewBonus.sales
            : new Map();
    }

    componentDidUpdate() {
        const { setDivisionValidity, parentUser: { position } } = this.props;
        if (position === USER_ROLE.MEDICAL_AGENT) {
            setDivisionValidity(this.isValid);
        }
    }

    @computed
    get getMedsList() {
        const {
            classes,
            meds,
            totalSold,
            previewBonus,
            hideName,
            changedMedsMarks,
            parentUser: { position }
        } = this.props;

        this.isValid = true;
        const sold = totalSold(position);
        return meds.length
            ? meds.map(x => {
                const saleInfo = this.sales.get(x.id);
                const leftValue = (sold[x.id] || 0) + (
                    (x.id in changedMedsMarks)
                        ? changedMedsMarks[x.id]
                        : 0
                );
                const rightValue = saleInfo
                    ? saleInfo.amount
                    : 0;

                if (leftValue !== rightValue) {
                    this.isValid = false;
                }
                return (
                    <TableCell
                        key={x.id}
                        padding='none'
                        className={cx(classes.cell, { invalid: leftValue > rightValue })}>
                        <Grid
                            direction='column'
                            container>
                            {
                                !hideName &&
                                <Typography className={classes.medItem}>
                                    {x.name}
                                </Typography>
                            }
                            {
                                !!previewBonus &&
                                <Typography variant='subtitle1' className={classes.salesStat}>
                                    <span className={classes.span}>
                                        {leftValue}
                                    </span>
                                    <span>/</span>
                                    <span className={classes.span}>
                                        {rightValue}
                                    </span>
                                </Typography>
                            }
                        </Grid>
                    </TableCell>
                );
            })
            : <TableCell/>;
    }

    @computed
    get isLoading(): boolean {
        const { getAsyncStatus } = this.props;
        return getAsyncStatus('loadBonuses').loading;
    }

    resetValues = () => {
        this.searchString = '';
        this.propName = null;
        this.order = null;
        this.selected = null;
        this.searchInputValue = '';
    }

    openFilterPopper = (propName: MarksSortableProps) => ({ target }: any) => {
        const {
            agents,
            sortSettings
        } = this.props;
        const source = agents;
        this.resetValues();
        this.filterPopperAnchor = target;
        this.propName = propName;
        /* source.forEach((option) => {
            this.ignoredItems.push(option[propName]);
        });*/
        this.sortReaction = reaction(
            () => ([this.isLoading, source && source.length]),
            ([isLoading, size]: [boolean, number], r) => {
                if (isLoading) {
                    if (!size) return;
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
        /* if (filterSettings && filterSettings.propName === propName) {
             this.ignoredItems = [...filterSettings.ignoredItems];
         }*/
    }

    popoverCloseHandler = () => {
        if (this.sortReaction) this.sortReaction();
        this.filterPopperAnchor = null;
        this.resetValues();
    }

    inputChangeHandler = ({ target: { value } }: any) => {
        this.searchInputValue = value;
    }

    sortOrderChangeHandler = (order: SORT_ORDER) => {
        const { sortDataBy } = this.props;
        this.order = order;
        sortDataBy(this.propName, order);
        console.log(
            'new order: ', order, toJS(this.order),
            'propName: ', toJS(this.propName));

    }

    findSuggestions = () => {
        this.searchString = this.searchInputValue;
    }

    @computed
    get sortCallback(): any {
        return this.order === SORT_ORDER.ASCENDING
            ? (a: any, b: any) => a[this.propName].localeCompare(b[this.propName])
            : (a: any, b: any) => b[this.propName].localeCompare(a[this.propName]);
    }

    @computed
    get sortedOptions(): IUserInfo[] {
        return (this.order && this.source)
            ? this.source.slice().sort(this.sortCallback)
            : this.source;
    }

    @computed
    get filteredOptions(): any[] {
        const checklist: string[] = [];
        const res: any[] = [];
        if (!this.sortedOptions) return res;

        const lowerCaseFilter = this.searchString
            ? this.searchString.toLowerCase()
                .replace(/\u02bc/, '')
                .replace('ʼ', '')
                .replace('`', '')
                .replace('\'', '')
            : '';

        if (this.sortedOptions.length) {
            this.sortedOptions.forEach((option, i) => {
                const value = option[this.propName];
                const passFilter = lowerCaseFilter === '' ||
                    value.toLowerCase().replace(/\u02bc/, '').includes(lowerCaseFilter);

                if (passFilter === true && checklist.includes(value) === false) {
                    checklist.push(value);
                    res.push({ id: i, value });
                }
            });
        }
        return res;
    }

    itemClickHandler = ({ value }: any) => {
        if (this.selected === value) {
            this.selected = null;
        } else {
            this.selected = value;
        }
    }

    applyFilters = () => {
        const { setPreviewDoctor } = this.props;
        for (const item of this.source) {
            if (item[this.propName] === this.selected) {
                setPreviewDoctor(item.id);
                break;
            }
        }
        this.popoverCloseHandler();
    }

    render() {
        const { classes, sortSettings, isMedicalAgent } = this.props;
        const sortPropName = sortSettings ? sortSettings.propName : null;
        return (
            <>
                <TableContainer className={classes.container}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                {
                                    isMedicalAgent &&
                                    <TableCell
                                        padding='none'
                                        style={{ width: this.columnWidth }}
                                        className={cx(classes.cell, classes.wideColumn)}>
                                        ЛПУ
                                        <IconButton
                                            onClick={this.openFilterPopper('LPUName')}
                                            className={cx(classes.iconButton, { active: ('LPUName' === sortPropName) })}>
                                            <FilterList fontSize='small'/>
                                        </IconButton>
                                    </TableCell>
                                }
                                <TableCell
                                    padding='none'
                                    style={{ width: this.columnWidth * (!!isMedicalAgent ? 1 : 2) }}
                                    className={cx(classes.cell, {
                                        [classes.doubleWidthColumn]: !isMedicalAgent,
                                        [classes.wideColumn]: isMedicalAgent,
                                    })}>
                                    ПІБ
                                    {
                                        isMedicalAgent &&
                                        <IconButton
                                            onClick={this.openFilterPopper('name')}
                                            className={cx(classes.iconButton, { active: ('name' === sortPropName) })}>
                                            <FilterList fontSize='small'/>
                                        </IconButton>
                                    }
                                </TableCell>
                                {this.getMedsList}
                                <TableCell
                                    padding='none'
                                    align='center'
                                    className={cx(classes.cell, classes.column)}>
                                    уп
                                </TableCell>
                                <TableCell
                                    align='center'
                                    padding='none'
                                    className={cx(classes.cell, classes.column)}>
                                    бонуси
                                </TableCell>
                                <TableCell
                                    align='right'
                                    padding='none'
                                    className={cx(classes.cell, classes.column)}>
                                    всього
                                </TableCell>
                            </TableRow>
                        </TableHead>
                    </Table>
                </TableContainer>
                {
                    <MarksFilterPopper
                        anchor={this.filterPopperAnchor}
                        // toggleAll={this.toggleAll}
                        propName={this.propName}

                        onClose={this.popoverCloseHandler}
                        isLoading={this.isLoading}

                        order={this.order}
                        onOrderChange={this.sortOrderChangeHandler}

                        searchString={this.searchInputValue}
                        onSearchStringChange={this.inputChangeHandler}
                        applySearch={this.findSuggestions}

                        // totalLength={this.totalLength}
                        suggestions={this.filteredOptions}
                        selected={this.selected}
                        itemClickHandler={this.itemClickHandler}

                        applyClickHandler={this.applyFilters}
                    />
                }
            </>
        );
    }
}

export default withStyles(styles)(TableHeader);
