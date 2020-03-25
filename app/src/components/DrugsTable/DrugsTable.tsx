import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    TableContainer,
    Table,
    Paper,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Grid,
    LinearProgress
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IMedicine } from '../../interfaces/IMedicine';
import HeaderItem from './HeaderItem';
import Body from './Body';
import { DisplayMode } from '../../stores/SalesStore';
import { IAsyncStatus } from '../../stores/AsyncStore';
import { IRegion } from '../../interfaces/IRegion';
import cx from 'classnames';
import { ISalesStat } from '../../interfaces/ISalesStat';
import { toJS } from 'mobx';

const styles = (theme: any) => createStyles({
    td: {},
    th: {},
    thRow: {
    },
    thCell: {
        height: 48,
        '&:first-of-type': {
            paddingLeft: 5,
            [theme.breakpoints.up('md')]: {
                width: 220,
            }
        },
        '&:last-of-type': {
            width: 100,
        },
        '&.alignBottom': {
            verticalAlign: 'bottom'
        }
    },
    tr: {},
    cell: {
        paddingLeft: 5,
        '&:last-of-type': {
            backgroundColor: 'red'
        }
    },
    table: {
        tableLayout: 'fixed'
    },
    container: {
        overflowY: 'hidden',
        transition: '0.3s',
    },
    prepend: {},
    append: {},
    body: {},

});

interface IProps extends WithStyles<typeof styles> {
    salesHeaderHeight?: number;
    setSalesHeaderHeight?: (value: number) => void;
    displayMode?: DisplayMode;
    getAsyncStatus?: (key: string) => IAsyncStatus;
    meds?: Map<number, IMedicine>;
    medsDisplayStatus?: Map<number, boolean>;

    salesStat: ISalesStat[];
    headerPrepend: any;
    rowPrepend: any;

    // regions?: Map<number, IRegion>;
}

@inject(({
    appState: {
        uiStore: {
            salesHeaderHeight,
            setSalesHeaderHeight,
        },
        salesStore: {
            displayMode,
            getAsyncStatus,
            medsDisplayStatus
        },
        departmentsStore: {
            regions,
            meds
        }
    }
}) => ({
    salesHeaderHeight,
    setSalesHeaderHeight,
    displayMode,
    getAsyncStatus,
    regions,
    meds,
    medsDisplayStatus
}))
@observer
class DrugsTable extends Component<IProps> {
    readonly headerHeight: number = 20;
    headerRefs: any = {};

    get isLoading(): boolean {
        const { getAsyncStatus } = this.props;
        const s1 = getAsyncStatus('loadLocaleSalesStat');
        const s2 = getAsyncStatus('loadMedsStat');
        return s1.loading || s2.loading;
    }

    get medsArray(): IMedicine[] {
        return [...this.props.meds.values()]
            .filter(({ id }) => this.props.medsDisplayStatus.get(id) === true);
    }

    get marginTop(): number {
        return this.props.salesHeaderHeight || this.headerHeight;
    }

    get showLoader(): boolean {
        const { salesStat } = this.props;
        const statIsAbsent = !salesStat || !salesStat.length;
        return this.isLoading && statIsAbsent;
    }

    calculateTopMargin = () => {
        const refs = [...Object.values(this.headerRefs)];
        const heights = refs.map((current: any) => current && current.getBoundingClientRect().height);
        const newValue = Math.max(...heights);
        this.props.setSalesHeaderHeight(newValue);
    }

    componentDidMount() {
        this.calculateTopMargin();
    }

    componentDidUpdate(prevProps: IProps) {
        const { meds: prevMeds } = prevProps;
        const { meds: actualMeds } = this.props;

        const medsIsChanged = prevMeds !== actualMeds || prevMeds.size !== actualMeds.size;

        if (medsIsChanged) {
            this.headerRefs = [...prevMeds.values()].reduce(
                (refs, meds) => {
                    if (actualMeds.has(meds.id)) return refs;
                    const { [meds.id]: omitted, ...rest } = refs;
                    return rest;
                },
                this.headerRefs
            );
        }

        this.calculateTopMargin();
    }

    render() {
        const {
            classes,
            meds,
            medsDisplayStatus,
            salesStat,
            displayMode,
            headerPrepend: HeaderPrepend,
            rowPrepend
            // regions
        } = this.props;

        return (
            <TableContainer style={{ paddingTop: this.marginTop }} component={Paper} className={classes.container} >
                <Table padding='none' className={classes.table}>
                    <TableHead className={classes.th}>
                        <TableRow className={classes.thRow}>
                            <TableCell colSpan={2} className={classes.thCell}>
                                {/* регион */}
                                <HeaderPrepend />
                            </TableCell>

                            {
                                this.medsArray.map(medicine =>
                                    <TableCell key={medicine.id} className={cx(classes.thCell, { alignBottom: true })}>
                                        <Grid container>
                                            <HeaderItem medicine={medicine} componentRef={(el: any) => this.headerRefs[medicine.id] = el} />
                                        </Grid>
                                    </TableCell>
                                )
                            }

                            {
                                !!this.medsArray.length &&
                                <TableCell className={classes.thCell}>
                                    total
                                </TableCell>
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody className={classes.body}>
                        {
                            this.showLoader
                            ? <TableRow>
                                <TableCell colSpan={this.medsArray.length + 1}>
                                    <LinearProgress />
                                </TableCell>
                              </TableRow>
                            : <Body
                                meds={meds}
                                salesStat={salesStat}
                                displayStatuses={medsDisplayStatus}
                                displayMode={displayMode}
                                rowPrepend={rowPrepend}
                                 // regions={regions}
                              />
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
}

export default withStyles(styles)(DrugsTable);
