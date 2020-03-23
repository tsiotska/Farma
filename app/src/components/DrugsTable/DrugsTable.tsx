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
import { ILocaleSalesStat } from '../../interfaces/ILocaleSalesStat';
import Body from './Body';
import { DisplayMode } from '../../stores/SalesStore';
import { IAsyncStatus } from '../../stores/AsyncStore';
import { toJS } from 'mobx';
import { IRegion } from '../../interfaces/IRegion';
import cx from 'classnames';

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

    meds?: Map<number, IMedicine>;
    medsStat?: ILocaleSalesStat[];
    medsDisplayStatuses?: Map<number, boolean>;
    displayMode?: DisplayMode;
    getAsyncStatus?: (key: string) => IAsyncStatus;
    regions?: Map<number, IRegion>;

    rowStartAddornment?: React.Component;
    rowEndAddornment?: React.Component;
    rowPrepend?: React.Component;
    rowAppend?: React.Component;
    headerPrepend?: React.Component;
    headerAppend?: React.Component;
}

@inject(({
    appState: {
        uiStore: {
            salesHeaderHeight,
            setSalesHeaderHeight,
        },
        salesStore: {
            displayMode,
            getAsyncStatus
        },
        departmentsStore: {
            regions
        }
    }
}) => ({
    salesHeaderHeight,
    setSalesHeaderHeight,
    displayMode,
    getAsyncStatus,
    regions
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
            .filter(({ id }) => this.props.medsDisplayStatuses.get(id) === true);
    }

    get marginTop(): number {
        return this.props.salesHeaderHeight || this.headerHeight;
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
            headerAppend,
            headerPrepend,
            medsDisplayStatuses,
            medsStat,
            displayMode,
            regions
        } = this.props;

        return (
            <TableContainer style={{ paddingTop: this.marginTop }} component={Paper} className={classes.container} >
                <Table padding='none' className={classes.table}>
                    <TableHead className={classes.th}>
                        <TableRow className={classes.thRow}>
                            {headerPrepend}

                            <TableCell colSpan={2} className={classes.thCell}>
                                регион
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

                            {headerAppend}
                        </TableRow>
                    </TableHead>
                    <TableBody className={classes.body}>
                        {
                            (this.isLoading && !medsStat.length)
                            ? <TableRow>
                                <TableCell colSpan={this.medsArray.length + 1}>
                                    <LinearProgress />
                                </TableCell>
                              </TableRow>
                            : <Body
                                meds={meds}
                                salesStat={medsStat}
                                displayStatuses={medsDisplayStatuses}
                                displayMode={displayMode}
                                regions={regions}
                              />
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
}

export default withStyles(styles)(DrugsTable);
